import { eq } from "drizzle-orm";
import { db } from "../db";
import { usersTable } from "../db/schema";
import { Request, Response } from "express";

export const getAllUser = async (req: Request, res: Response) => {
    try {
        const users = await db.query.usersTable.findMany()
        res.status(200).json({ data: users });
        return;
    } catch (error) {
        res.status(500).json({message: error});
        return;
    }
  
};
export const getUserById = async (req: Request, res: Response) => {
    try {
        const userId=req.params.userId;
        const user = await db.select()
        .from(usersTable)
        .where(eq(usersTable.id as any , userId as any)).then((u)=>u[0]);
        
        res.status(200).json({ data: user });
        return;
    } catch (error) {
        res.status(500).json({message: error});
        return;
    }
  
};
export const updateUser= async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const { username, email } = req.body;

    if (!username && !email) {
       res.status(400).json({ message: "At least one field (username or email) is required to update." });
       return;
    }

    await db
      .update(usersTable)
      .set({ ...(username && { username }), ...(email && { email }) })
      .where(eq(usersTable.id as any, userId));

    res.status(200).json({ message: "User updated successfully."});
    return;
  } catch (error: any) {
    res.status(500).json({ message: error.message});
    return;
  }
};
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    await db
      .delete(usersTable)
      .where(eq(usersTable.id as any, userId));

    res.status(200).json({ message: "User deleted successfully." });
    return;
  } catch (error: any) {
    res.status(500).json({ message: error.message });
    return;
  }
};

