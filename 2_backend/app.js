import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import UserModel from './models/userModel.js';

const app = express();
dotenv.config();

const PORT = process.env.PORT;

// Middlewares
app.use(express.json());
app.use(cors());

// Connecting DB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
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
  const user = new UserModel({
    name: name,
    age: age,
    email: email,
    password: password,
  });

  try {
    await user.save();
    res.send('inserted data');
  } catch (err) {
    res.status(403).send({ message: 'Something is Wrong' });
  }
});

// Update
app.put('/api/users', async (req, res) => {
  const { name, email, id } = req.body;

  try {
    await UserModel.findById(id, (err, updateUser) => {
      updateUser.name = name || updateUser.name;

      updateUser.email = email || updateUser.email;
      updateUser.save();
    });

    res.json('updated');
  } catch (err) {
    return err;
  }
});

// Delete
app.delete('/api/users/:id', async (req, res) => {
  const id = req.params.id;

  await UserModel.findByIdAndRemove(id).exec();
  res.send('deleted');
});
