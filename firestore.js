// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyB8pbyRY4ZpeThJY4y1OwrKDC631kGJFiI',
  authDomain: 'maine-fe60f.firebaseapp.com',
  projectId: 'maine-fe60f',
  storageBucket: 'maine-fe60f.appspot.com',
  messagingSenderId: '597881893189',
  appId: '1:597881893189:web:e4325dc6f52f3943190e2c',
  measurementId: 'G-2L2XLQKB92',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
