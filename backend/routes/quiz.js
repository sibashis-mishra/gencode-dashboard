import express from "express";
import {
  getAllQuizzes,
  createQuiz,
  updateQuiz,
  getQuizById,
  deleteQuiz,
} from "../controllers/quizController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getAllQuizzes);
router.post("/", authMiddleware, createQuiz);
router.put("/:id", authMiddleware, updateQuiz);
router.get("/:id", authMiddleware, getQuizById);
router.delete("/:id", authMiddleware, deleteQuiz);

export default router;
