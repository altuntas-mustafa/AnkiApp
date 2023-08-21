import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setOrder, setDisplayOrder } from "../redux/reducers";

const Deck = () => {
  const [languages, setLanguages] = useState([]); // Corrected variable name
  const dispatch = useDispatch();

  // Get state values from Redux
  const isRandomOrder = useSelector((state) => state.flashcards.isRandomOrder);
  const isFrontDisplayed = useSelector((state) => state.flashcards.isFrontDisplayed);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/languages") // Fetch languages instead of decks
      .then(async (response) => {
        const data = response.data;

        // Fetch decks for each language
        const languagesWithDecks = await Promise.all(data.map(async (language) => {
          const response = await axios.get(`http://localhost:3001/api/languages/${encodeURIComponent(language.id)}/decks`);
          return {
            ...language,
            decks: response.data
          };
        }));

        setLanguages(languagesWithDecks); // Update state with fetched languages and decks
      })
      .catch((error) => console.error("Error fetching languages:", error));
  }, []);

  const handleRandomOrderToggle = () => {
    dispatch(setOrder(!isRandomOrder));
  };

  const handleRandomSideToggle = () => {
    dispatch(setDisplayOrder(!isFrontDisplayed));
  };

  return (
    <div className="deck-container">
      <h1>Language Page</h1> {/* Updated heading */}
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
      <ul className="language-list"> {/* Updated class name */}
        {languages.map((language) => (
          <li key={language.id}>
            <h2>{language.id}</h2>
            <ul className="deck-list">
              {language.decks.map((deck) => (
                <li key={deck.id}>
                  <Link to={`/languages/${encodeURIComponent(language.id)}/decks/${encodeURIComponent(deck.name)}`} className="deck-link">
                    {deck.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Deck;
