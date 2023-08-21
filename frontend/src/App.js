import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Provider } from 'react-redux'; // Import Provider from react-redux
import store from '../src/redux/store'; // Import the Redux store
import Deck from './Components/Deck';
import Flashcards from './Components/Flashcards'; // Import the Flashcards component
import './App.css'; // Import the external CSS file

function App() {
  return (
    <Provider store={store}> {/* Wrap the entire app with the Provider component */}
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
            <Route path="/decks/:deckName" element={<Flashcards />} /> {/* Add this route */}
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
