import express from 'express';
import { ensureAuthenticated, isAdmin, isUser } from './middlewares/authMiddleware.js'; 
import { listUsers as getUsers, addUser, updateUser, deleteUser, login, logout, register } from './controllers/UserController.js'; 
import User from './models/User.js';

const router = express.Router();

// Route cho trang đăng ký
router.get('/register', (req, res) => {
    res.render('register'); // Render trang register.ejs
});
router.post('/register', register); // Gọi hàm register từ UserController

// Route cho trang đăng nhập
router.get('/login', (req, res) => {
    res.render('login'); // Render trang login.ejs
});
router.post('/login', login); // Gọi hàm login từ UserController

// Route cho đăng xuất
router.post('/logout', logout);

// Route cho trang chủ
router.get('/', ensureAuthenticated, (req, res) => {
    res.render('home', { user: req.user }); // Pass user to home view
});

// Route cho người dùng bình thường để xem thông tin của chính mình
router.get('/users/self', ensureAuthenticated, isUser, async (req, res) => {
    res.render('userProfile', { user: req.user });
});

// Route: Hiển thị danh sách người dùng (chỉ admin)
router.get('/users', ensureAuthenticated, isAdmin, getUsers);

// Route: Thêm người dùng (chỉ admin)
router.post('/users/add', ensureAuthenticated, isAdmin, addUser);

// Route: Cập nhật thông tin người dùng
router.post('/users/edit/:id', ensureAuthenticated, async (req, res) => {
    const userId = req.params.id;
    // Kiểm tra nếu là admin hoặc là người dùng hiện tại
    if (req.user.role === 'admin' || req.user.id === userId) {
        await updateUser(req, res); // Gọi hàm cập nhật người dùng
    } else {
        return res.status(403).send('Access denied.'); // Từ chối truy cập
    }
});

// Route: Xóa người dùng (chỉ admin)
router.post('/users/delete/:id', ensureAuthenticated, isAdmin, deleteUser);

// Route: Hiển thị trang chỉnh sửa người dùng (chỉ admin)
router.get('/users/edit/:id', ensureAuthenticated, isAdmin, async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.render('editUser', { user });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route để người dùng bình thường cập nhật thông tin của chính mình
router.post('/users/self/edit', ensureAuthenticated, isUser, async (req, res) => {
    // Xử lý cập nhật thông tin người dùng
    const { username, fullname, address, email } = req.body;
    try {
        const user = await User.findByPk(req.user.id);
        if (user) {
            user.username = username;
            user.fullname = fullname;
            user.address = address;
            user.email = email;
            await user.save();
            res.redirect('/users/self');
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Internal Server Error');
    }
});

export default router;
