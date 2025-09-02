const express = require("express");
const router = express.Router();
const Question = require("../models/Question");

// ایجاد سوال جدید
router.post("/", async (req, res) => {
    try {
        const question = new Question(req.body);
        await question.save();
        res.status(201).json(question);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// گرفتن همه سوال‌ها
router.get("/", async (req, res) => {
    try {
        const questions = await Question.find();
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
