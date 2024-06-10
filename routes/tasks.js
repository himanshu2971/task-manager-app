const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');

// Create a new task
router.post('/tasks', auth, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      owner: req.user.id
    });
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Retrieve all tasks with pagination, search, and filtering
router.get('/tasks', auth, async (req, res) => {
  const { page = 1, limit = 10, title, completed } = req.query; // Default to page 1 and 10 tasks per page
  const query = { owner: req.user.id };

  if (title) {
    query.title = { $regex: title, $options: 'i' }; // Case-insensitive regex search
  }

  if (completed) {
    query.completed = completed === 'true';
  }

  try {
    const tasks = await Task.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const count = await Task.countDocuments(query);

    res.json({
      tasks,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Retrieve a single task by ID
router.get('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user.id });
    if (!task) {
      return res.status(404).send({ message: 'Task not found' });
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a task by ID
router.patch('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!task) {
      return res.status(404).send({ message: 'Task not found' });
    }
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a task by ID
router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!task) {
      return res.status(404).send({ message: 'Task not found' });
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
