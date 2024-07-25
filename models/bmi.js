const mongoose = require('mongoose');

const bmiSchema = new mongoose.Schema({
    weight: Number,
    height: Number,
    bmi: Number,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BMI', bmiSchema);