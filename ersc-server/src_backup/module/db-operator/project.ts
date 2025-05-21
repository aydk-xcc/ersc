const { Sequelize, DataTypes } = require('sequelize');

// 连接到 SQLite 数据库
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite', // SQLite 数据库文件名称
  logging: false, // 禁用日志
});

// 定义 User 模型
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
});

// 同步数据库
sequelize.sync();

// 封装操作
const createUser = async (userData) => {
  try {
    const user = await User.create(userData);
    return user;
  } catch (error) {
    throw error;
  }
};

const getAllUsers = async () => {
  try {
    const users = await User.findAll();
    return users;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createUser,
  getAllUsers,
};