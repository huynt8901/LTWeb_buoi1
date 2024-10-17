import express from 'express';
import myDateTime from './date.js'; 
import dotenv from 'dotenv/config';
import getURL from './getURL.js';
import viewEngine from './viewEngine.js';
import webRoute from './webRoute.js';

const app = express();
const port = process.env.PORT || 3000;

viewEngine(app);
app.use('/', webRoute);

// Route cho trang chủ
app.get('/', (req, res) => {
    res.render('home'); // Render tệp home.ejs
});

// Route cho /about
app.get('/about', (req, res) => {
    res.render('about'); // Render tệp about.ejs
});

// Route cho /ejs
app.get('/ejs', (req, res) => {
    res.render("test"); // Render tệp test.ejs
});

// Khởi động server
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
