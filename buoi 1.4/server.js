import express from 'express';
import dotenv from 'dotenv/config';
import session from 'express-session';
import passport from './passport.js'; // Import Passport
import sequelize from './models/database.js';
import webRoute from './webRoute.js';
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize()); // Khởi tạo Passport
app.use(passport.session()); // Sử dụng phiên của Passport

app.use('/', webRoute);

sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}).catch((error) => {
    console.error('Unable to connect to the database:', error);
});
