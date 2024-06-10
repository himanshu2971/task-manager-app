import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const TaskForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchTask = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/tasks/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          const task = response.data;
          setTitle(task.title);
          setDescription(task.description);
          setDueDate(task.dueDate);
          setPriority(task.priority);
        } catch (error) {
          console.error('Error fetching task', error);
        }
      };
      fetchTask();
    }
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const taskData = { title, description, dueDate, priority };
    try {
      if (id) {
        await axios.patch(`http://localhost:5000/tasks/${id}`, taskData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      } else {
        await axios.post('http://localhost:5000/tasks', taskData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      }
      navigate('/tasks');
    } catch (error) {
      console.error('Error saving task', error);
    }
  };

  return (
    <div>
      <h2>{id ? 'Edit Task' : 'Create Task'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label>Due Date:</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div>
          <label>Priority:</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <button type="submit">{id ? 'Update Task' : 'Create Task'}</button>
      </form>
    </div>
  );
};

export default TaskForm;
