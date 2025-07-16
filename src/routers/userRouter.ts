import express from "express"
import { deleteUser, getAllUser, getUserById, registerUser, updateUser } from "../controllers/userController";

const router  = express.Router()

router.post("/register", registerUser); //register user     http://localhost:3000/user/register
router.get("/", getAllUser);// get all user     http://localhost:3000/user/
router.get("/getById/:userId", getUserById); //get user by id   http://localhost:3000/user/getById/:userId
router.put("/update/:userId", updateUser);// update user    http://localhost:3000/user/update/:userId
router.delete("/delete/:userId", deleteUser);// delete user     http://localhost:3000/user/delete/:userId

export const UserRoutes = router;