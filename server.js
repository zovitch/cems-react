const path = require('path');
const express = require('express');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const fileUpload = require('express-fileupload');
const port = process.env.PORT || 5000;

const app = express();

//connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));
app.use(
  fileUpload({
    createParentPath: true,
    safeFileNames: true,
    preserveExtension: true,
  }),
);

// for dev only, comment out in production
// app.get('/', (req, res) => res.send('API running'));

// Define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/departments', require('./routes/api/departments'));
app.use('/api/machines', require('./routes/api/machines'));
app.use('/api/categories', require('./routes/api/categories'));
app.use('/api/manufacturers', require('./routes/api/manufacturers'));
app.use('/api/locations', require('./routes/api/locations'));
app.use('/api/afas', require('./routes/api/afas'));
app.use('/api/rfas', require('./routes/api/rfas'));
app.use('/api/dfas', require('./routes/api/dfas'));
app.use('/api/investments', require('./routes/api/investments'));
app.use('/api/r3s', require('./routes/api/r3s'));
app.use('/api/failurecodes', require('./routes/api/failurecodes'));
app.use('/api/repaircodes', require('./routes/api/repaircodes'));
app.use('/api/analysiscodes', require('./routes/api/analysiscodes'));
app.use('/api/technicalsupports', require('./routes/api/technicalsupports'));

// Upload Endpoint
app.use('/api/upload', require('./routes/api/upload'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, './client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
} else {
  app.get('/', (req, res) => res.send('Please set to production'));
}

app.listen(port, () => console.log('Server started on port ' + port));
