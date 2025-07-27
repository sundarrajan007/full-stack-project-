require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require("path"); // file hndlin path
const eventRoutes = require('./routes/eventRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); //uplds img
app.use('/api/events', eventRoutes); 

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch(err => console.error('MongoDB error:', err));
