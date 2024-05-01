const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import cors
const app = express();
const authRoutes = require('./routes/auth');

// Middleware
app.use(express.json());
app.use(cors());
app.use('/api/auth', authRoutes);



// Connect to MongoDB
mongoose.connect('mongodb+srv://Garvitx:Garvitx@cluster0.urfjoji.mongodb.net/SignBridgeApp?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected to SignBridgeApp'))
  .catch((err) => console.log(err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
