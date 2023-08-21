const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");

const serviceAccount = {
  "type": "service_account",
  "project_id": "ankiapp-clone",
  "private_key_id": "6bb073ea81f8fafb167aa5c472b4790bf5b1184c",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCyopFsC8LUnc8x\ng2b4QZO4sex8W9Vq/EujP7PI+NfORiL9Dqye6mwzkKhGs1yBoXv+8c90rD5+AJDE\nwmUBsVmMEM7AnVIW8NE7oPfbtINQi4TecTn+7zQK7KfH4SxCkPjfnVTSaHKoESbA\nK2ryfaMp6BhtY6qlUpoBXEavP2DUzUOof8mo8oFnurUQNPaw9JYmoow3tAXGzgHd\nPF+Qa6wyong0PXhezJ7w/6M/KexNmnNBI0IB/XnWmwfDC+qDwyNYigkyxzGakqx8\nHpCLVNsdmdT+lisMpm7E14hYGHs3qiAxjOQAcxEmJ8lBgRTZAa3NJMv/6VVnJ6qD\nSZ6Sqi4xAgMBAAECggEAFwABKwEH/g8u672dpu5D7QkU8rLHnlBLaYKyDSN5Hykp\np8fZaFa08B4P2evjHRpj2DYIk4mlPDJUxs4Ov5028zwAxY0b/NyB3CRuyrOJyszu\noni//Q04eAWeLrP/2mGcdvzkvHilS/LKuKh+ddLBDOFs2md1mSFdtzoggb+ZIfJF\nd1ZP2/nZ7KQDy1DtP2i9aOL7GK8a86y4QqjuCKHyX5DrzjP9eqOjZkccwNS9h4d0\nshc5SaXcdhmd5qqXCSv66/7F4Hg7oKNVY4orjIUrjfF8m7DzkRj/qFI+D9K0koEK\n23l/h4bCOQFefrrbLTFzwriV0Cf99z3XxyqREtwy9wKBgQDcG2sD87a4AtJmnIbb\nhLSHcYdWaLtzE1gnbHBQ+RK+h7gFBOnHqmcyYNX0pn33NRnRUg/L9k6n7pIID/3d\nMULTM1dg2ZXq46FVA0Sz2idW6PEn1Jtzo6z/MmismJV8mywFFZBDkKm17xvaKD6c\n8y5Uhlfm3RwtFkiDSE0YALS+0wKBgQDPw9vTid5c38jeJ5HVfFBA5f1feSM/+ubm\npoAUL82enZqAj3CfWOMaw23gaeUuBHblsXOANn7yoe0JdbS61aDMK1C04YJrEaU8\ntRdQlCw5i24sI8Svpu2m2U++snfdE3X/6RVeFLZTnMDNEjsQRpDK+W/tXttkgAX1\n3+zwjJxkawKBgC38HHOK61WuYT7G3PXn17+kXF4VK3RzSiuSYDTKlLvxpuSFjkIE\nu+KukIS4dAC9u1McDejS4MP8981vad5YeFmflFXLn6KfRAl60VOx9B4YNKnZpVCX\nlYELiwrkJfcOhDfbtXQoOQylk/AUEGDB/Z/zIVI+R7CzwxqKdHDbVOe5AoGBALB0\ny0YdqRK+Kc6sUsq7ezmzW/9zVgHn6aXpsYvzkbJubqNTsDZV+wRnCPH5XmE3/3dT\nwCIbprQR3M0VADtSZvAgtbn6cZbX9LvbngKc5fa1uguZEVqR7vOvS3BOCUllVunT\nn4c5FiVrU8CYBDvtgtoxAePblYAEz4sk9QrUkZsjAoGAYNGcHR4wTzMasDYQ4b3b\ntsDpleoB4qNEqJ1ECIfyfC4powqCKcUDM6lIYq1bKlzjEz8b9DkZySAAO3GHKGLC\nrotfEvGNu68N0fCgCrjS6ZsF20ASRCtLOy79hNibZ6eTOcWhGrWPdK8l7ZMojoG2\nAnXZpURDxBrrtDBlw4bX050=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-9lozt@ankiapp-clone.iam.gserviceaccount.com",
  "client_id": "104818050740779303556",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-9lozt%40ankiapp-clone.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};


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
    const jsonData = req.body;

    const deckName = jsonData.deckName;
    const language = jsonData.language;
    const cards = jsonData.cards;

    // Check if the language already exists
    const languageRef = db.collection("languages").doc(language);
    const languageDoc = await languageRef.get();

    if (!languageDoc.exists) {
      // Create the language document if it doesn't exist
      await languageRef.set({});
    }

    // Create the deck document inside the language's "decks" subcollection
    const deckRef = languageRef.collection("decks").doc(deckName);
    await deckRef.set({
      name: deckName
    });

    // Add cards to the deck's "flashcards" subcollection
    const flashcardsCollectionRef = deckRef.collection("flashcards");

    for (const card of cards) {
      const front = card.front;
      const back = card.back;

      await flashcardsCollectionRef.add({
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

app.get("/api/languages", async (req, res) => {
  try {
    const languagesSnapshot = await db.collection("languages").get();
    const languages = [];
    languagesSnapshot.forEach((doc) => {
      languages.push({
        id: doc.id,
        ...doc.data()
      });
    });
    res.json(languages);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error"
    });
  }
});

app.get("/api/language/:language/decks", async (req, res) => {
  try {
    const language = req.params.language;

    const languageRef = db.collection("languages").doc(language);
    const decksSnapshot = await languageRef.collection("decks").get();

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

app.get("/api/language/:language/deck/:deckName", async (req, res) => {
  try {
    const language = req.params.language;
    const deckName = req.params.deckName;

    const deckRef = db.collection("languages").doc(language)
                    .collection("decks").doc(deckName);
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
