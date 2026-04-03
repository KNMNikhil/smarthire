const axios = require('axios');
const { Admin, sequelize } = require('./models');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function testApi() {
    try {
        // 1. Create a token manually (skip login)
        const token = jwt.sign(
            { id: 1, role: 'admin', username: 'admin' },
            process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_make_it_long_and_secure',
            { expiresIn: '1h' }
        );
        console.log('Generated Token:', token);

        // 2. Hit the endpoint
        console.log('Making request to /api/admin/dashboard...');
        const response = await axios.get('http://localhost:5000/api/admin/dashboard', {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('SUCCESS:', response.data);
    } catch (error) {
        console.error('API FAIL:', error.response ? error.response.data : error.message);
        if (error.response && error.response.status === 500) {
            console.error('500 Error Details:', error.response.data);
        }
    }
}

testApi();
