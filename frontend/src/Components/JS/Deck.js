// Deck.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setOrder, setDisplayOrder } from "../../redux/reducers";
import "../CSS/Deck.css"

const Deck = () => {
  const [languages, setLanguages] = useState([]);
  const dispatch = useDispatch();

  const isRandomOrder = useSelector((state) => state.flashcards.isRandomOrder);
  const isFrontDisplayed = useSelector((state) => state.flashcards.isFrontDisplayed);

  useEffect(() => {
    axios
      .get("https://ankiappclone-git-main-mustafa-altuntas.vercel.app/api/languages")
      .then(async (response) => {
        const data = response.data;

        const languagesWithDecks = await Promise.all(data.map(async (language) => {
          const response = await axios.get(`https://ankiappclone-git-main-mustafa-altuntas.vercel.app/api/languages/${encodeURIComponent(language.id)}/decks`);
          return {
            ...language,
            decks: response.data
          };
        }));

        setLanguages(languagesWithDecks);
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
      <h1>Language Page</h1>
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
      <ul className="language-list">
        {languages.map((language) => (
          <li key={language.id} className="language-container">
            <h2 className="language-name">{language.id}</h2>
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
