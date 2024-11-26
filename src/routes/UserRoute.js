const express = require('express');
const UserRouter = express.Router(); 
const AuthorizedUserRouter = express.Router();

const { getuserById, getAlluser, signup, deleteUserById, updateUserById } = require('../handlers/userHandler');
const { authenticate } = require('../middleware/authentication');
const { login, logout } = require('../handlers/authenticationHandler');

// Public routes
UserRouter.get('/users', getAlluser);
UserRouter.post('/signup', signup);
UserRouter.post('/login', login);
UserRouter.get('/users/:id', getuserById);

// Middleware for authenticated routes
AuthorizedUserRouter.use(authenticate);

// Protected routes
AuthorizedUserRouter.put('/users/:id', updateUserById);
AuthorizedUserRouter.delete('/users/:id', deleteUserById);
AuthorizedUserRouter.post('/logout', logout);

module.exports = {
    UserRouter,
    AuthorizedUserRouter
};
