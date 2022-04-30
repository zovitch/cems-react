const express = require('express');
const connectDB = require('./config/db');
const fileUpload = require('express-fileupload');

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
app.use('/api/afas', require('./routes/api/afas'));
app.use('/api/rfas', require('./routes/api/rfas'));
app.use('/api/dfas', require('./routes/api/dfas'));
app.use('/api/investments', require('./routes/api/investments'));
app.use('/api/r3s', require('./routes/api/r3s'));
app.use('/api/failurecodes', require('./routes/api/failurecodes'));
app.use('/api/repaircodes', require('./routes/api/repaircodes'));
app.use('/api/analysiscodes', require('./routes/api/analysiscodes'));

// File Upload
app.use(fileUpload());

// Upload Endpoint
app.post('/upload', (req, res) => {
  if (req.files === null) {
    console.log('1');
    return res.status(400).json({ msg: 'No file uploaded' });
  }

  const file = req.files.file;

  file.mv(`${__dirname}/client/public/uploads/machines/${file.name}`, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    res.json({
      fileName: file.name,
      filePath: `/uploads/machines/${file.name}`,
    });
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log('Server started on port ' + PORT));
