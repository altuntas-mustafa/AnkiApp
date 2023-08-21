import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../src/redux/store';
import Deck from './Components/Deck';
import Flashcards from './Components/Flashcards';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="content">
          <nav className="navbar">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/decks" className="nav-link">
              View Decks
            </Link>
          </nav>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/decks" element={<Deck />} />
            <Route path="/languages/:language/decks/:deckName" element={<Flashcards />} /> {/* Update this route */}
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

function Home() {
  return (
    <div>
      <h1 className="home-title">Home Page</h1>
    </div>
  );
}

export default App;
