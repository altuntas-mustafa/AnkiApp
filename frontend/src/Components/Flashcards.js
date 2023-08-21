import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "./FlashCards.css";
import { useSelector } from "react-redux";

const Flashcards = () => {
  const { deckName } = useParams();

  const [shuffledFlashcards, setShuffledFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Get state values from Redux
  const isRandomOrder = useSelector((state) => state.flashcards.isRandomOrder);
  const isFrontDisplayed = useSelector(
    (state) => state.flashcards.isFrontDisplayed
  );

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
    }
  };

  useEffect(() => {
    let isMounted = true;

    axios
      .get(`https://ankiappclone-git-main-mustafa-altuntas.vercel.app/api/languages/Dutch/decks/${encodeURIComponent(deckName)}`)
      .then((response) => {
        const data = response.data.flashcards; // Access the flashcards array
        const flashcards = isRandomOrder ? shuffleArray(data) : data;

        if (isMounted) {
          setShuffledFlashcards(flashcards);
          setCurrentCardIndex(0);
          setIsFlipped(false);
        }
      })
      .catch((error) => console.error("Error fetching flashcards:", error));

    return () => {
      isMounted = false;
    };
  }, [deckName]);

  if (shuffledFlashcards.length === 0) {
    return <div>Loading...</div>;
  }

  const currentFlashcard = shuffledFlashcards[currentCardIndex];
  const isLastFlashcard = currentCardIndex === shuffledFlashcards.length - 1;

  return (
    <div className="flashcards-container">
      <h2>{deckName}</h2>
      <div className={`flashcard ${isFlipped ? "flipped" : ""}`}>
        <div className="flashcard-content front">
          {isFrontDisplayed && Math.random() < 0.5 ? (
            <p>{currentFlashcard.back}</p>
          ) : (
            <p>{currentFlashcard.front}</p>
          )}
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
