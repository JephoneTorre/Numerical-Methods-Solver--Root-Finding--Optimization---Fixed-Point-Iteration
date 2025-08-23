const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

const cars = ['Ford', 'Volvo', 'BMW'];

app.get('/cars', (req, res) => {
    res.json({ cars });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
