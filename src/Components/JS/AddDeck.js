import React, { useState } from "react";
import "../CSS/AddDeck.css";
// http://localhost:3001/api/create-deck

const AddDeck = () => {
  const [deckInfo, setDeckInfo] = useState({
    deckName: "",
    language: "",
    cards: [
      { front: "", back: "" },
      { front: "", back: "" },
    ],
  });

  const handleCardChange = (index, field, value) => {
    const newCards = [...deckInfo.cards];
    newCards[index][field] = value;
    setDeckInfo({ ...deckInfo, cards: newCards });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if required fields are empty
    if (!deckInfo.deckName || !deckInfo.language) {
      alert("Please fill out the deck name and language fields.");
      return;
    }

    // Check if each card has at least 2 total words (combined front and back)
    if (
      deckInfo.cards.some(
        (card) =>
          (card.front.trim() + " " + card.back.trim()).split(" ").length < 2
      )
    ) {
      console.log(
        "Each card should have at least 2 total words (front and back combined)."
      );
      alert(
        "Each card should have at least 2 total words (front and back combined)."
      );
      return;
    }

    try {
      const response = await fetch("https://ankiappclone-git-main-mustafa-altuntas.vercel.app/api/create-deck", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(deckInfo),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData.message); // "Deck and cards created successfully"
        setDeckInfo({
          deckName: "",
          language: "",
          cards: [
            { front: "", back: "" },
            { front: "", back: "" },
          ],
        });
      } else {
        const errorData = await response.json();
        console.log(errorData.error); // Display the error message sent from the server
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="add-deck-container">
      <h2 className="form-heading">Create New Deck</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Deck Name:</label>
          <input
            type="text"
            value={deckInfo.deckName}
            onChange={(e) =>
              setDeckInfo({ ...deckInfo, deckName: e.target.value })
            }
          />
        </div>
        <div className="form-group">
          <label> Language :</label>
          <input
            type="text"
            value={deckInfo.language}
            onChange={(e) =>
              setDeckInfo({ ...deckInfo, language: e.target.value })
            }
          />
        </div>
        <div className="card-group">
          {deckInfo.cards.map((card, index) => (
            <div key={index} className="input-group">
              <label>Front:</label>
              <input
                type="text"
                value={card.front}
                onChange={(e) =>
                  handleCardChange(index, "front", e.target.value)
                }
              />
              <label>Back:</label>
              <input
                type="text"
                value={card.back}
                onChange={(e) =>
                  handleCardChange(index, "back", e.target.value)
                }
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          className="add-card-button"
          onClick={() =>
            setDeckInfo({
              ...deckInfo,
              cards: [...deckInfo.cards, { front: "", back: "" }],
            })
          }
        >
          Add Card
        </button>
        <button type="submit" className="create-deck-button">
          Create Deck
        </button>
      </form>
    </div>
  );
};

export default AddDeck;
