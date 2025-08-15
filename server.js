const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

app.use('/api/auth', authRoutes);
const dietRoutes = require('./routes/diet');
app.use('/diet-plan', dietRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));





