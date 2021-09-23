const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

// we use a try as to prevent crash if connection errors to the database
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      // useCreateIndex: true, //not supported with mongoose 6.0.1
      useUnifiedTopology: true,
      // useFindAndModify: false, //not supported with mongoose 6.0.1
    });
    console.log('MongoDB connected...');
  } catch (err) {
    console.log('error to catch');
    console.log(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
