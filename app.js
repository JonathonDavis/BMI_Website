const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const BMI = require('./models/bmi');
const app = express();
const port = 3000;

const mongoURI = 'mongodb+srv://jonathonhdavis:Zk9awab8NGWnorhe@cluster0.gssmxmj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
    const bmiRecords = await BMI.find().sort({ date: -1 });
    res.render('index', { bmi: null, records: bmiRecords });
});

app.post('/calculate', async (req, res) => {
    try {
    const weight = parseFloat(req.body.weight);
    const height = parseFloat(req.body.height);
    const bmi = weight / (height * height);

    const bmiRecord = new BMI({
        weight: weight,
        height: height,
        bmi: bmi
    });

    await bmiRecord.save();

    // req.session.bmi = bmi.toFixed(2); // Store the BMI result in session
    res.redirect('/');
    } catch (error) {
    console.error('Error in POST /calculate:', error);
    res.status(500).send('Internal Server Error');
    }
});

app.post('/delete/:id', async (req, res) => {
    try {
        await BMI.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (error) {
        console.error('Error in POST /delete/:id:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/edit/:id', async (req, res) => {
    try {
        const record = await BMI.findById(req.params.id);
        res.render('edit', { record });
    } catch (error) {
        console.error('Error in GET /edit/:id:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/edit/:id', async (req, res) => {
    try {
        const { weight, height } = req.body;
        const bmi = weight / (height * height);
        await BMI.findByIdAndUpdate(req.params.id, { weight, height, bmi });
        res.redirect('/');
    } catch (error) {
        console.error('Error in POST /edit/:id:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});