import express from 'express';
import myDateTime from './date.js'; 
import getURL from './getURL.js';

const router = express.Router();

// Route cho trang chủ
router.get('/', (req, res) => {
    res.render('home'); // Render tệp home.ejs
});

// Route cho /date
router.get('/date', (req, res) => {
    const currentDate = myDateTime(); 
    res.send(currentDate); 
});

// Route cho /geturl
router.get('/geturl', (req, res) => {
    const path = getURL.getPath(req);           
    const params = getURL.getParamsURL(req); 
    res.send(`Path: ${path}\nParameters: ${params}`); 
});

// Route cho trang About
router.get('/about', (req, res) => {
    res.render('about'); // Render tệp about.ejs
});

// Route cho trang EJS
router.get('/ejs', (req, res) => {
    res.render('test'); // Render tệp test.ejs
});

export default router;
