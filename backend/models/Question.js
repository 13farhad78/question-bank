const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    text: { type: String, required: true },
    grade: { type: String },
    lesson: { type: String },
    topic: { type: String },
    difficulty: { type: String },
    questionType: { type: String, required: true },
    questionSource: { type: String, required: true },
    year: { type: Number },
    month: { type: String },
    province: { type: String },
    options: [
        {
            text: { type: String, required: true },
            isCorrect: { type: Boolean, default: false },
        },
    ],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Question", questionSchema);
