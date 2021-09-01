const express = require('express');
const connectDB = require('./config/db');

const app = express();

//connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API running'));

// Define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/departments', require('./routes/api/departments'));
app.use('/api/machines', require('./routes/api/machines'));
app.use('/api/categories', require('./routes/api/categories'));
app.use('/api/manufacturers', require('./routes/api/manufacturers'));
app.use('/api/locations', require('./routes/api/locations'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('Server started on port ${PORT}'));
