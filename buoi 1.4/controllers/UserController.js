import User from '../models/User.js';
import passport from '../passport.js';
import bcrypt from 'bcryptjs'; // Để mã hóa mật khẩu

// Hiển thị danh sách người dùng
export const listUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.render('users', { users });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Thêm người dùng
export const addUser = async (req, res) => {
    if (req.method === 'POST') {
        const { username, password, fullname, address, sex, email, role } = req.body;
        try {
            // Mã hóa mật khẩu trước khi lưu
            const hashedPassword = await bcrypt.hash(password, 10);
            await User.create({ username, password: hashedPassword, fullname, address, sex, email, role });
            res.redirect('/users');
        } catch (error) {
            res.status(500).send(error.message);
        }
    } else {
        res.render('add-user');
    }
};

// Phương thức đăng ký
export const register = async (req, res) => {
    try {
        const { username, password, fullname, address, sex, email } = req.body;
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).send('Username already exists');
        }

        // Mã hóa mật khẩu trước khi lưu
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, password: hashedPassword, fullname, address, sex, email });
        
        req.logIn(newUser, (err) => {
            if (err) {
                return res.status(500).send('Internal Server Error');
            }
            return res.redirect('/');
        });

    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Xem thông tin người dùng
export const viewUser = async (req, res) => {
    const { id } = req.params;
    const user = await User.findByPk(id);
    res.render('edit-user', { user });
};

// Cập nhật thông tin người dùng
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, password, fullname, address, sex, email } = req.body;
    try {
        // Kiểm tra nếu là admin hoặc là người dùng hiện tại
        if (req.user.role === 'admin' || req.user.id === id) {
            // Nếu có mật khẩu mới, mã hóa nó
            const updateData = { username, fullname, address, sex, email };
            if (password) {
                updateData.password = await bcrypt.hash(password, 10); // Mã hóa mật khẩu mới
            }
            await User.update(updateData, { where: { id } });
            // Chuyển hướng đến danh sách người dùng hoặc trang cá nhân tùy thuộc vào quyền
            if (req.user.role === 'admin') {
                return res.redirect('/users');
            }
            return res.redirect('/users/self');
        } else {
            return res.status(403).send('Access denied.'); // Từ chối truy cập
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Xóa người dùng
export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        if (req.user.role === 'admin') {
            await User.destroy({ where: { id } });
            return res.redirect('/users');
        } else {
            return res.status(403).send('Access denied.'); // Từ chối truy cập
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Đăng nhập
export const login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error('Error during authentication:', err);
            return next(err);
        }
        if (!user) {
            console.log('Authentication failed:', info.message);
            return res.redirect('/login'); // Chuyển hướng về trang login nếu không có người dùng
        }
        req.logIn(user, (err) => {
            if (err) {
                console.error('Error logging in:', err);
                return next(err);
            }
            console.log('User logged in successfully:', user);
            return res.redirect('/'); // Chuyển hướng về trang chủ sau khi đăng nhập
        });
    })(req, res, next);
};

// Đăng xuất
export const logout = (req, res) => {
    req.session.destroy(err => { // Xóa session
        if (err) {
            return res.status(500).send('Could not log out');
        }
        res.redirect('/'); // Chuyển hướng đến trang chủ
    });
};
