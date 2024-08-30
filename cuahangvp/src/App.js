// src/App.js
import React from 'react';
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import Footer from './components/Footer/Footer';
import './App.css'; // CSS toàn cục

function App() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Home />
      </main>
      <Footer />
    </div>
  );
}

export default App;
