// Full Stack React & Firebase Tutorial - Build a social media app
// freeCodeCamp.org
// https://www.youtube.com/watch?v=m_u6P5k0vP0

const functions = require("firebase-functions");

const app = require("express")();

const admin = require("firebase-admin");
admin.initializeApp();

const firebase = require("firebase");
const config = {
  apiKey: "AIzaSyD2acfWydnSLYQOaxDNGoiBBahckHbUYbY",
  authDomain: "socialape-93d05.firebaseapp.com",
  databaseURL: "https://socialape-93d05.firebaseio.com",
  projectId: "socialape-93d05",
  storageBucket: "socialape-93d05.appspot.com",
  messagingSenderId: "565819402963",
  appId: "1:565819402963:web:857303ca29a5d2e831c226",
  measurementId: "G-89G6PP77R7"
};
firebase.initializeApp(config);

const db = admin.firestore();

// C  ~/api/scream
// R  ~/api/screams
// U
// D

// Read (list) screams  ~/api/screams
app.get("/screams", (req, res) => {
  db.collection("screams")
    .orderBy("createdAt", "desc")
    .get()
    .then(data => {
      let screams = [];
      data.forEach(doc => {
        screams.push({
          screamId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt
        });
      });
      return res.json(screams);
    })
    .catch(err => {
      console.error(err);
    });
});

// Create a scream  ~/api/scream
app.post("/scream", (req, res) => {
  const newScream = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString()
  };

  db.collection("screams")
    .add(newScream)
    .then(doc => {
      res.json({ message: `document ${doc.id} created successfully ` });
    })
    .catch(err => {
      res.status(500).json({ error: "something went wrong" });
      console.error(err);
    });
});

// Signup route
app.post("/signup", (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle
  };

  // Validate data
  let token, userId;
  db.doc(`/users/${newUser.handle}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        return res.status(400).json({ handle: "This handle is already taken" });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then(data => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then(idToken => {
      token = idToken;
      const userCredentials = {
        handle: newUser.handle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId: userId
      };
      // Persist into the collection
      return db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch(err => {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({ email: "Email is already in use" });
      } else {
        return res.status(500).json({ error: err.code });
      }
    });
});

// ~/api/
exports.api = functions.https.onRequest(app);
