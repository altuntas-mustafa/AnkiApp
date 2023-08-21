import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useHistory } from "react-router-dom";
import "./FlashCards.css";

const Flashcards = () => {
  const { deckName } = useParams();
  const formattedDeckName = deckName.toLowerCase().replace(/\s+/g, "-");

  const [shuffledFlashcards, setShuffledFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [redirected, setRedirected] = useState(false);

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNextCard = () => {
    if (currentCardIndex < shuffledFlashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    } else {
      setCompleted(true);
    }
  };

  useEffect(() => {
    axios
      .get(`https://anki-app-exau.vercel.app/api/deck/${formattedDeckName}`)
      .then((response) => {
        const data = response.data;
        setShuffledFlashcards(data); // Set flashcards without shuffling initially
        setCurrentCardIndex(0);
        setIsFlipped(false);
        setCompleted(false);
      })
      .catch((error) => console.error("Error fetching flashcards:", error));
  }, [formattedDeckName]);

  useEffect(() => {
    if (completed && !redirected) {
      const timeout = setTimeout(() => {
        setRedirected(true);
        window.location.href = "/decks"; // Redirect using window.location
      }, 1200); // 1200 milliseconds = 1.2 seconds

      return () => clearTimeout(timeout); // Clean up on component unmount
    }
  }, [completed, redirected]);

  if (shuffledFlashcards.length === 0) {
    return <div>Loading...</div>;
  }

  const currentFlashcard = shuffledFlashcards[currentCardIndex];
  const isLastFlashcard = currentCardIndex === shuffledFlashcards.length - 1;

  return (
    <div className="flashcards-container">
      {completed && !redirected && (
        <div>
          <p>Congratulations! You've completed all flashcards.</p>
        </div>
      )}
      <h2>{deckName}</h2>
      <div className={`flashcard ${isFlipped ? "flipped" : ""}`}>
        <div className="flashcard-content front">
          <p>{currentFlashcard.front}</p>
          <button onClick={handleFlip}>Flip</button>
        </div>
        {isFlipped && (
          <div className="flashcard-content back">
            <p className="front-word">{currentFlashcard.front}</p>
            <hr className="line" />
            <p className="back-word">{currentFlashcard.back}</p>
            {isLastFlashcard && (
              <Link to="/decks" className="viewDeck">
                Go to Decks
              </Link>
            )}
            {!isLastFlashcard && (
              <button onClick={handleNextCard}>Next Card</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Flashcards;
