import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Deck = () => {
  const [decks, setDecks] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/decks")
      .then((response) => {
        const data = response.data;
        setDecks(data);
      })
      .catch((error) => console.error("Error fetching decks:", error));
  }, []);

  return (
    <div className="deck-container">
      <h2>Deck Page</h2>
      <ul className="deck-list">
        {decks.map((deck) => (
          <li key={deck.id}>
            {/* Use Link to navigate to the deck's flashcards */}
            <Link to={`/decks/${encodeURIComponent(deck.name)}`} className="deck-link">
              {deck.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Deck;
