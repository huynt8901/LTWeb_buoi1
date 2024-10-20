import express from 'express';
import myDateTime from './date.js'; 
import dotenv from 'dotenv/config';
import getURL from './getURL.js';
import viewEngine from './viewEngine.js';
import webRoute from './webRoute.js';
import bodyParser from 'body-parser';
import sequelize from './models/database.js'; // Đảm bảo đường dẫn đúng

const app = express();
const port = process.env.PORT || 3000;
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
viewEngine(app);
app.use('/', webRoute);

// Khởi động server và kết nối đến cơ sở dữ liệu
sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch((error) => {
    console.error('Unable to connect to the database:', error);
});
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
