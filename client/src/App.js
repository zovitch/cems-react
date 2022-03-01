import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navbar } from './layout/Navbar';
import { Landing } from './layout/Landing';

import './App.css';

const App = () => (
  <Router>
    <Navbar />
    <Landing />
  </Router>
);

export default App;
