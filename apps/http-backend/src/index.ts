import express from "express";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";
import { JWT_SECRET } from "@repo/backend-common/config";
import { UserSchema, SigninSchema, CreateroomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import { generateHash } from "./utils/generateHash";
import "dotenv/config";
import compare from "./utils/comparePass";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  return res.status(200).send("Server is live");
});

// ---------------- SIGNIN ----------------
app.post("/signin", async (req, res) => {
  const parsedData = SigninSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid input format",
    });
  }

  try {
    const user = await prismaClient.user.findFirst({
      where: {
        email: parsedData.data.email,
      },
    });

    // user not found
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPassCorrect = await compare(
      parsedData.data.password,
      user.password,
    );

    if (!isPassCorrect) {
      res.status(400).json({
        success: false,
        message: "Password is incorrect! Try again",
      });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      success: true,
      user,
      message: "Welcome user",
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// ---------------- SIGNUP ----------------
app.post("/signup", async (req, res) => {
  const parsedData = UserSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json({
      success: false,
      message: "Incorrect inputs",
    });
  }

  try {
    const hashedPassword = await generateHash(parsedData.data.password);

    const user = await prismaClient.user.create({
      data: {
        email: parsedData.data.email,
        name: parsedData.data.name,
        password: hashedPassword,
      },
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      userId: user.id,
    });
  } catch (error) {
    return res.status(409).json({
      success: false,
      message: "Email already registered. Please use another email address.",
    });
  }
});

// ---------------- CREATE ROOM ----------------
app.post("/room", middleware, async (req, res) => {
  const parsedData = CreateroomSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid room input",
    });
  }

  // @ts-ignore
  const userId = req.userId;

  try {
    const room = await prismaClient.room.create({
      data: {
        slug: parsedData.data.name,
        adminId: userId,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Room created successfully",
      roomId: room.id,
    });
  } catch (error) {
    return res.status(409).json({
      success: false,
      message: "Room slug already exists. Use a different name.",
    });
  }
});

app.listen(7676, () => {
  console.log("HTTP backend server is running on http://localhost:7676");
});
