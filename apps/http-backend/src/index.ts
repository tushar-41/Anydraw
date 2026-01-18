import express from "express";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";
import { JWT_SECRET } from "@repo/backend-common/config";
import { UserSchema } from "@repo/common/types";
// import { prismaClient } from "@repo/db/client";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is live");
});

app.post("/signin", (req, res) => {
  let userId = 1;
  const token = jwt.sign(
    {
      userId,
    },
    JWT_SECRET,
    { expiresIn: "1hr" }
  );
  //generate jwt token
  //validate name and password from the db stored data
  //redirect to the next page.
  return res.json({
    message: "Welcome user",
    token: token,
  });
});

app.post("/signup", async (req, res) => {
  const parsedData = UserSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "Incorrect inputs",
    });
    return;
  }

  // try {
  //   const user = await prismaClient.user.create({
  //     data: {
  //       email: parsedData.data.email,
  //       name: parsedData.data.name,
  //       password: parsedData.data.password,
  //     },
  //   });

  //   res.json({
  //     userId: user.id,
  //   });
  // } catch (error) {
  //   res.status(411).json({
  //     error: error,
  //     message:
  //       "This email address already registered please us another email adress",
  //   });
  // }
});

app.post("room", middleware, (req, res) => {
  // db call

  res.json({
    roomId: Math.random(),
  });
});

app.listen(7676, () => {
  console.log("HTTP backend server is running on http://localhost:7676");
});
