import express from "express"
import { deleteUser, getAllUser, getUserById, updateUser } from "../controllers/userController";
import { authenticate } from "../middleware/authMiddleware";

const router  = express.Router()

router.get("/",authenticate, getAllUser);// get all user     http://localhost:3000/user/
router.get("/getById/:userId",authenticate, getUserById); //get user by id   http://localhost:3000/user/getById/:userId
router.put("/update/:userId",authenticate, updateUser);// update user    http://localhost:3000/user/update/:userId
router.delete("/delete/:userId",authenticate, deleteUser);// delete user     http://localhost:3000/user/delete/:userId

export const UserRoutes = router;