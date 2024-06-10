import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import TaskList from './pages/TaskList';
import TaskForm from './pages/TaskForm';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tasks" element={<PrivateRoute element={TaskList} />} />
        <Route path="/create-task" element={<PrivateRoute element={TaskForm} />} />
        <Route path="/edit-task/:id" element={<PrivateRoute element={TaskForm} />} />
      </Routes>
    </div>
  );
};

export default App;
