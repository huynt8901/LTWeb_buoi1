import session from 'express-session';
import passport from 'passport';
// Middleware cho session
app.use(session({
    secret: 'secret_key', // Thay đổi thành một chuỗi bí mật mạnh
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
// middleware/authMiddleware.js
export const isAdmin = (req, res, next) => {
    if (req.user.role === 'admin') {
        return next();
    }
    res.status(403).send('Access denied.');
};


export const isUser = (req, res, next) => {
    if (req.user) {
        return next(); // Cho phép nếu đã đăng nhập
    }
    return res.status(401).send('Unauthorized.'); // Từ chối nếu chưa đăng nhập
};
// middlewares/auth.js
export const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login'); // Nếu chưa đăng nhập, chuyển hướng về trang login
};