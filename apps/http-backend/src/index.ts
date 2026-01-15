import express from "express";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";
import { JWT_SECRET } from "@repo/backend-common/config";
import { SigninSchema, UserSchema } from "@repo/common/types";

const app = express();

app.listen(7676, () => {
  console.log("HTTP backend server is running on http://localhost:7676");
});

app.get("/", (req, res) => {
  res.send("Server is live");
});

app.post("/signin", (req, res) => {
  const { name, password } = req.body;

  if (!name) return new Error("Name is not present");
  if (!password) return new Error("Password is not present");

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

app.post("/signup", (req, res) => {
  const data = UserSchema.safeParse(req.body);
  if (!data.success) {
    res.json({
      message: "Incorrect inputs",
    });
    return;
  }
  //Sign up information
  //db call
});

app.post("room", middleware, (req, res) => {
  // db call

  res.json({
    roomId: Math.random(),
  });
});
