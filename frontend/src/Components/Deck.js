import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setOrder, setDisplayOrder } from "../redux/reducers";

const Deck = () => {
  const [decks, setDecks] = useState([]);
  const dispatch = useDispatch();

  // Get state values from Redux
  const isRandomOrder = useSelector((state) => state.flashcards.isRandomOrder);
  const isFrontDisplayed = useSelector((state) => state.flashcards.isFrontDisplayed);

  useEffect(() => {
    axios
      .get("https://anki-app-exau.vercel.app/api/decks")
      .then((response) => {
        const data = response.data;
        setDecks(data);
      })
      .catch((error) => console.error("Error fetching decks:", error));
  }, []);

  const handleRandomOrderToggle = () => {
    dispatch(setOrder(!isRandomOrder));
    console.log("Random Order Toggle:", !isRandomOrder);
  };

  const handleRandomSideToggle = () => {
    dispatch(setDisplayOrder(!isFrontDisplayed));
    console.log("Random Side Toggle:", !isFrontDisplayed);
  };

  return (
    <div className="deck-container">
      <h2>Deck Page</h2>
      <div>
        <label>
          Random Order:{" "}
          <input
            type="checkbox"
            checked={isRandomOrder}
            onChange={handleRandomOrderToggle}
          />
        </label>
        <label>
          Random Side:{" "}
          <input
            type="checkbox"
            checked={isFrontDisplayed}
            onChange={handleRandomSideToggle}
          />
        </label>
      </div>
      <ul className="deck-list">
        {decks.map((deck) => (
          <li key={deck.id}>
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
