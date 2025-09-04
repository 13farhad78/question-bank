const express = require("express");
const router = express.Router();
const Question = require("../models/Question");

// New route to get the total number of questions
router.get("/count", async (req, res) => {
    try {
        const count = await Question.countDocuments({});
        res.json({ totalQuestions: count });
    } catch (error) {
        console.error("Error fetching total question count:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Your existing route for fetching questions
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

module.exports = router;
