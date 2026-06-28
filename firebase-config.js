// firebase-config.js
// Firebase config for MeSooK / Koicerys POS

const firebaseConfig = {
  apiKey: "AIzaSyBY-ly04oZbygi1HM4dqJqYT7gK6H6O4uU",
  authDomain: "mesook-b6c45.firebaseapp.com",
  projectId: "mesook-b6c45",
  storageBucket: "mesook-b6c45.firebasestorage.app",
  messagingSenderId: "379465665429",
  appId: "1:379465665429:web:19bad228690d651d7a449c"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
