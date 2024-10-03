// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCtbx9MRUuN9AMWguGc7gBIFyeS1qP-8vE",
  authDomain: "investment-management-app-fire.firebaseapp.com",
  projectId: "investment-management-app-fire",
  storageBucket: "investment-management-app-fire.appspot.com",
  messagingSenderId: "540989496545",
  appId: "1:540989496545:web:f970e94fb06d93d2faaba0",
  measurementId: "G-2HS1682HLZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Initialize Firebase Auth and export it
export const auth = getAuth(app);