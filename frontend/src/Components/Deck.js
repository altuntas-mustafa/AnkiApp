import React, { useState, useEffect } from "react";
import { collection, getDocs} from "firebase/firestore";
import { db } from "../firebase/firebase";

const LanguagePage = () => {
  const [decks, setDecks] = useState([]);

  async function fetchDecks() {
    const decksCollectionRef = collection(db, "languages/Dutch/decks");

    try {
      const decksQuerySnapshot = await getDocs(decksCollectionRef);
      const decksData = [];

      for (const deckDoc of decksQuerySnapshot.docs) {
        const deckId = deckDoc.id;

        const flashcardsCollectionRef = collection(
          db,
          `languages/Dutch/decks/${deckId}/flashcards`
        );

        const flashcardsQuerySnapshot = await getDocs(flashcardsCollectionRef);
        const flashcardsData = [];

        flashcardsQuerySnapshot.forEach((flashcardDoc) => {
          flashcardsData.push({ id: flashcardDoc.id, ...flashcardDoc.data() });
        });

        decksData.push({
          id: deckId,
          flashcards: flashcardsData,
          isExpanded: false, // Initialize as not expanded
        });
      }

      setDecks(decksData);
    } catch (error) {
      console.error("Error fetching decks and flashcards:", error);
    }
  }

  useEffect(() => {
    fetchDecks();
  }, []);

  const toggleFlashcards = (deckId) => {
    setDecks((prevDecks) =>
      prevDecks.map((deck) => {
        if (deck.id === deckId) {
          return { ...deck, isExpanded: !deck.isExpanded };
        }
        return deck;
      })
    );
  };

  return (
    <div>
      <h1>Decks and Flashcards</h1>
      <ul>
        {decks.map((deck) => (
          <li key={deck.id}>
            <h2 onClick={() => toggleFlashcards(deck.id)}>{deck.id}</h2>
            {deck.isExpanded && (
              <ul>
                {deck.flashcards.map((flashcard) => (
                  <li key={flashcard.id}>{flashcard.back}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LanguagePage;
