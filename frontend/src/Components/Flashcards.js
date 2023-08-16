import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./FlashCards.css";

const Flashcards = () => {
  const { deckName } = useParams();
  const [flashcards, setFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false); // Initialize with front side visible

  const formattedDeckName = deckName.toLowerCase().replace(/\s+/g, "-");

  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/deck/${formattedDeckName}`)
      .then((response) => {
        const data = response.data;
        setFlashcards(data);
        setCurrentCardIndex(0); // Reset current card index
        setIsFlipped(false); // Ensure front side is visible when a new deck is loaded
      })
      .catch((error) => console.error("Error fetching flashcards:", error));
  }, [formattedDeckName]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
    setIsFlipped(false); // Reset to front side when moving to the next card
  };

  if (flashcards.length === 0) {
    return <div>Loading...</div>;
  }

  const currentFlashcard = flashcards[currentCardIndex];

  return (
    <div className="flashcards-container">
      <h2>{deckName}</h2>
      <div className={`flashcard ${isFlipped ? "flipped" : ""}`}>
        <div className="flashcard-content front">
          <p>{currentFlashcard.front}</p>
          <button onClick={handleFlip}>Flip</button>
        </div>
        {isFlipped && (
          <div className="flashcard-content back">
            <p className="front-word">{currentFlashcard.front}</p>
            <hr  className="line"/>
            <p className="back-word">{currentFlashcard.back}</p>
            <button onClick={handleNextCard}>Next Card</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Flashcards;
