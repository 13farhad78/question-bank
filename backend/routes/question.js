const express = require("express");
const router = express.Router();
const Question = require("../models/Question");

// در Node.js (فایل routes/question.js)

router.post("/", async (req, res) => {
    try {
        const newQuestion = new Question(req.body); // دریافت اطلاعات از بدنه درخواست
        const savedQuestion = await newQuestion.save(); // ذخیره در دیتابیس
        res.status(201).json(savedQuestion); // ارسال پاسخ موفقیت‌آمیز به فرانت‌اند
    } catch (error) {
        console.error("Error creating a new question:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET route for getting the total question count
router.get("/count", async (req, res) => {
    try {
        const count = await Question.countDocuments({});
        res.json({ totalQuestions: count });
    } catch (error) {
        console.error("Error fetching total question count:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET route for fetching all questions (with filters)
router.get("/", async (req, res) => {
    try {
        const {
            limit = 10,
            offset = 0,
            grade,
            lesson,
            topic,
            difficulty,
            questionType,
            searchText,
        } = req.query;

        const filterQuery = {};

        if (grade && grade !== "") filterQuery.grade = grade;
        if (lesson && lesson !== "") filterQuery.lesson = lesson;
        if (topic && topic !== "") filterQuery.topic = topic;
        if (difficulty && difficulty !== "")
            filterQuery.difficulty = difficulty;
        if (questionType && questionType !== "")
            filterQuery.questionType = questionType;

        if (searchText && searchText.trim() !== "") {
            filterQuery.$or = [
                { title: { $regex: searchText.trim(), $options: "i" } },
                { text: { $regex: searchText.trim(), $options: "i" } },
            ];
        }

        const questions = await Question.find(filterQuery)
            .skip(parseInt(offset))
            .limit(parseInt(limit));

        const hasMore = questions.length === parseInt(limit);

        res.json({ questions, hasMore });
    } catch (error) {
        console.error("خطا در دریافت سوالات:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// PUT route for editing (updating) a question
router.put("/:id", async (req, res) => {
    try {
        const updatedQuestion = await Question.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedQuestion) {
            return res.status(404).json({ error: "Question not found" });
        }
        res.status(200).json(updatedQuestion);
    } catch (error) {
        console.error("Error updating question:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// DELETE route for deleting a question
router.delete("/:id", async (req, res) => {
    try {
        const result = await Question.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ error: "Question not found" });
        }
        res.status(200).json({ message: "Question deleted successfully" });
    } catch (error) {
        console.error("Error deleting question:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
