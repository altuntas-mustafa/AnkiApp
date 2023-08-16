const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const serviceAccount = require("./firebase-config.json");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
app.get("/", async (req, res) => {
  try {
    res.send("test");
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error"
    });
  }
});

app.post("/api/create-deck", async (req, res) => {
  try {
    console.log(req.body);
    const jsonData = req.body;

    const deckName = jsonData.deckName;
    const cards = jsonData.cards;

    // Create the deck
    const deckRef = db.collection("decks").doc(deckName);
    await deckRef.set({
      name: deckName
    });

    // Add cards to the deck
    for (const card of cards) {
      const front = card.front;
      const back = card.back;

      await deckRef.collection("flashcards").add({
        front,
        back
      });
    }

    res.status(201).json({
      message: "Deck and cards created successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error"
    });
  }
});
app.get("/api/decks", async (req, res) => {
  try {
    const decksSnapshot = await db.collection("decks").get();
    const decks = [];
    decksSnapshot.forEach((doc) => {
      decks.push({
        id: doc.id,
        ...doc.data()
      });
    });
    res.json(decks);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error"
    });
  }
});
app.get("/api/deck/family-members", async (req, res) => {
  try {
    const deckName = "Family Members";

    const deckRef = db.collection("decks").doc(deckName);
    const flashcardsSnapshot = await deckRef.collection("flashcards").get();

    const flashcards = [];
    flashcardsSnapshot.forEach((doc) => {
      flashcards.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json(flashcards);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error"
    });
  }
});

app.get("/api/flashcards/random", async (req, res) => {
  try {
    const snapshot = await db.collection("flashcards").get();
    const flashcards = [];
    snapshot.forEach((doc) => {
      flashcards.push({
        id: doc.id,
        ...doc.data()
      });
    });
    const randomIndex = Math.floor(Math.random() * flashcards.length);
    res.json(flashcards[randomIndex]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error"
    });
  }
});

app.post("/api/flashcards", async (req, res) => {
  try {
    const {
      word,
      definition
    } = req.body;
    await db.collection("flashcards").add({
      word,
      definition
    });
    res.status(201).json({
      message: "Flashcard created successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error"
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});