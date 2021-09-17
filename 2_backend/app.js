import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import UserModel from './models/userModel.js';

const app = express();
dotenv.config();

const PORT = process.env.PORT;

// Middleware
app.use(express.json());
app.use(cors());

// Connecting DB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((response) => {
    console.log('MongoDB connected');

    //Starting server
    app.listen(PORT, () => console.log(`Starting server on port: ${PORT}...`));
  })
  .catch((err) => console.log(err));

//Routes

// Get
app.get('/api/users', async (req, res) => {
  UserModel.find({}, (err, result) => {
    if (err) {
      res.send(err);
    }

    res.send(result);
  });
});

// Post
app.post('/api/users', async (req, res) => {
  const { name, age, email, password } = req.body;
  const user = new UserModel({ name, age, email, password });

  try {
    await user.save();
    res.send('inserted data');
  } catch (err) {
    res.status(403).send({ message: 'Something is Wrong' });
  }
});

// Update
app.put('/api/users', async (req, res) => {
  const { name, age, email, id } = req.body;

  try {
    await UserModel.findById(id, (err, updateUser) => {
      updateUser.name = name;
      updateUser.age = age;
      updateUser.email = email;
      updateUser.save();
    });
    res.send('updated');
  } catch (err) {
    res.status(403).send({ message: 'Something is Wrong' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  const id = req.params.id;

  await UserModel.findByIdAndRemove(id).exec();
  res.send('deleted');
});
