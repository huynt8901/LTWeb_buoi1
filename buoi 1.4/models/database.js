import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('th_ltweb', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});

export default sequelize;
