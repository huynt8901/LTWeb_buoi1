import express from 'express';
import myDateTime from './date.js'; 
import getURL from './getURL.js';
import ContactController from './controllers/ContactController.js'; 
import { listUsers as getUsers, addUser, updateUser, deleteUser } from './controllers/UserController.js'; // Nhớ import từ đúng file

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

// Route cho contact
router.get('/contact', ContactController);

// Route: Hiển thị danh sách người dùng
router.get('/users', getUsers); // Sử dụng hàm getUsers để lấy danh sách

// Route: Thêm người dùng
router.post('/users/add', addUser); // Sử dụng hàm addUser để thêm người dùng

// Route: Cập nhật thông tin người dùng
router.post('/users/edit/:id', updateUser); // Sử dụng hàm updateUser để cập nhật

// Route: Xóa người dùng
router.post('/users/delete/:id', deleteUser); // Sử dụng hàm deleteUser để xóa

export default router;
