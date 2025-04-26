const bcrypt = require('bcryptjs');
const { loadUsers, saveUsers } = require('../utils/userData');

// Register User
exports.register = (req, res) => {
    const { username, password } = req.body;
    let users = loadUsers();

    if (users.some(user => user.username === username)) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = {
        id: users.length + 1,
        username,
        password: bcrypt.hashSync(password, 10),
        role: 'user',
        blocked: false
    };

    users.push(newUser);
    saveUsers(users);
    res.status(201).json({ message: 'User registered successfully', newUser });
};

// Login User
exports.login = (req, res) => {
    const { username, password } = req.body;
    const users = loadUsers();
    const user = users.find(u => u.username === username);

    if (!user) return res.status(400).json({ message: 'User not found' });
    if (!bcrypt.compareSync(password, user.password)) {
        return res.status(400).json({ message: 'Invalid password' });
    }

    res.json({ message: 'Login successful' });
};

// Logout User
exports.logout = (req, res) => {
    res.json({ message: 'Logout successful' });
};

// Get All Users
exports.getAllUsers = (req, res) => {
    const users = loadUsers();
    res.json({ message: 'All users fetched successfully', users });
};

// Get User By ID
exports.getUserById = (req, res) => {
    const users = loadUsers();
    const user = users.find(u => u.id == req.params.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User fetched successfully', user });
};

// Update User (Username)
exports.updateUser = (req, res) => {
    const { id, username } = req.body;
    let users = loadUsers();
    const user = users.find(u => u.id == id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.username = username || user.username;
    saveUsers(users);
    res.json({ message: 'User updated successfully', user });
};

// Delete User
exports.deleteUser = (req, res) => {
    let users = loadUsers();
    users = users.filter(u => u.id != req.params.id);
    saveUsers(users);
    res.json({ message: 'User deleted successfully' });
};

// Change Password
exports.changePassword = (req, res) => {
    const { id, newPassword } = req.body;
    const users = loadUsers();
    const user = users.find(u => u.id == id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = bcrypt.hashSync(newPassword, 10);
    saveUsers(users);
    res.json({ message: 'Password changed successfully' });
};

// Update Profile (Username)
exports.updateProfile = (req, res) => {
    const { id, username } = req.body;
    const users = loadUsers();
    const user = users.find(u => u.id == id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.username = username || user.username;
    saveUsers(users);
    res.json({ message: 'Profile updated successfully' });
};

// Make Admin
exports.makeAdmin = (req, res) => {
    const users = loadUsers();
    const user = users.find(u => u.id == req.params.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = 'admin';
    saveUsers(users);
    res.json({ message: 'User promoted to admin' });
};

// Remove Admin
exports.removeAdmin = (req, res) => {
    const users = loadUsers();
    const user = users.find(u => u.id == req.params.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = 'user';
    saveUsers(users);
    res.json({ message: 'Admin role removed' });
};

// Search Users by Name
exports.searchUsers = (req, res) => {
    const { name } = req.query;
    const users = loadUsers();
    const result = users.filter(u => u.username.toLowerCase().includes(name.toLowerCase()));

    res.json({ message: 'Users found', result });
};

// Filter Users by Role
exports.filterUsers = (req, res) => {
    const { role } = req.query;
    const users = loadUsers();
    const result = users.filter(u => u.role === role);

    res.json({ message: 'Users filtered by role', result });
};

// Block User
exports.blockUser = (req, res) => {
    const users = loadUsers();
    const user = users.find(u => u.id == req.params.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.blocked = true;
    saveUsers(users);
    res.json({ message: 'User blocked successfully' });
};

// Unblock User
exports.unblockUser = (req, res) => {
    const users = loadUsers();
    const user = users.find(u => u.id == req.params.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.blocked = false;
    saveUsers(users);
    res.json({ message: 'User unblocked successfully' });
};
