// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Validate required Firebase environment variables
const requiredEnvVars = [
  'VITE_APIKEY',
  'VITE_AUTHDOMAIN',
  'VITE_PROJECTID',
  'VITE_STORAGEBUCKET',
  'VITE_MESSAGINGSENDERID',
  'VITE_APPID',
  'VITE_MEASUREMENTID'
];

requiredEnvVars.forEach(v => {
  if (!import.meta.env[v]) {
    console.warn(`Warning: Firebase environment variable ${v} is not defined`);
  }
});

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: import.meta.env.VITE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_PROJECTID,
  storageBucket: import.meta.env.VITE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_APPID,
  measurementId: import.meta.env.VITE_MEASUREMENTID
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
