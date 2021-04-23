import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyAhoiAE2pZeTKNgKWhjlo-BgV3cPcZVq2c",
  authDomain: "clone-30408.firebaseapp.com",
  projectId: "clone-30408",
  storageBucket: "clone-30408.appspot.com",
  messagingSenderId: "836874666375",
  appId: "1:836874666375:web:0d4e52dc43d44725509322",
  measurementId: "G-53JV2KGN9B"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();

export { db, auth };

