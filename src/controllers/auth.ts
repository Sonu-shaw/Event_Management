import bcrypt from "bcryptjs";
import { db } from "../db/index";
import { usersTable } from "../db/schema";
import { eq } from "drizzle-orm";
import { generateAccessToken, generateRefreshToken } from "../auth/jwt";
import { Request, Response } from "express";
import { otpMail } from "../utils/email";
import { otpGen } from "../utils/otp";

export const register = async (req: Request, res: Response) => {
  try {
    const {name, username, email, password } = req.body;
    const user = await db.select()
        .from(usersTable)
        .where(eq(usersTable.email as any , email as any)).then((u)=>u[0]);
    if(user){
      res.status(401).json({ message: "User already exist" });
      return;
    }
    const hash = await bcrypt.hash(password, 10);
    const otp = otpGen();
    const time = new Date();
    await db
      .insert(usersTable)
      .values({
        name,
        username,
        email,
        password: hash,
        isActive: false,
        otp,
        otpGeneratedTime: time,
      });

    await otpMail(email, otp);
    res.status(201).json({
      message: "Otp sent to mail Id. Verify mail to complete registration",
    });
    return;
  } catch (error) {
    res.status(500).json({ message: error });
    return;
  }
  
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .then((u) => u[0]);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: "User not found or Invalid Credentials" });
      return;
    }
    if(user.otp !== null){
      res.status(401).json({ message: "Verify Email First" });
      return;
    }
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    res.status(200).json({ user, accessToken, refreshToken });
    return;
  } catch (error) {
    res.status(500).json({ message: error });
    return;
  }
  
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { email, otpInp } = req.body;
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .then((u) => u[0]);
    if(!user){
      res.status(401).json({ message: "User not found or Invalid Credentials" });
      return;
    }
    if (
      otpInp === user.otp &&
      user.otpGeneratedTime && (Date.now() - user.otpGeneratedTime.getTime()) / (1000 * 60) < 2) {
      await db
        .update(usersTable)
        .set({ isActive: true, otp: null, otpGeneratedTime: null })
        .where(eq(usersTable.id, user.id));
      res.status(200).json({ message: "User registration Successful" });
      return;
    } else {
      res.status(500).json({ message: "Invalid otp" });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: error });
    return;
  }
  
};
