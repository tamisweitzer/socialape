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

// C  ~/api/scream
// R  ~/api/screams
// U
// D

// Read (list) screams  ~/api/screams
app.get("/screams", (req, res) => {
  admin
    .firestore()
    .collection("screams")
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

  admin
    .firestore()
    .collection("screams")
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

  // TODO validate data

  // create the user
  firebase
    .auth()
    .createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then(data => {
      return res
        .status(201)
        .json({ message: `user ${data.user.uid} signed up successfully` });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
});

// ~/api/
exports.api = functions.https.onRequest(app);
