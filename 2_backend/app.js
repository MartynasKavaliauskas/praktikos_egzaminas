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
app.get('/read', async (req, res) => {
  UserModel.find({}, (err, result) => {
    if (err) {
      res.send(err);
    }

    res.send(result);
  });
});

// Post
app.post('/insert', async (req, res) => {
  const name = req.body.userName;
  const age = req.body.age;
  const email = req.body.email;
  const password = req.body.password;
  const user = new UserModel({ name, age, email, password });

  try {
    await user.save();
    res.send('inserted data');
  } catch (err) {
    console.log(err);
  }
});

// Update
app.put('/update', async (req, res) => {
  const newUserName = req.body.newUserName;
  const newUserAge = req.body.newUserAge;
  const newUserEmail = req.body.newUserEmail;
  const id = req.body.id;

  try {
    await UserModel.findById(id, (err, updateUser) => {
      updateUser.name = newUserName;
      updateUser.age = newUserAge;
      updateUser.email = newUserEmail;
      updateUser.save();
      res.send('updated');
    });
  } catch (err) {
    console.log(err);
  }
});

app.delete('/delete/:id', async (req, res) => {
  const id = req.params.id;

  await UserModel.findByIdAndRemove(id).exec();
  res.send('deleted');
});
