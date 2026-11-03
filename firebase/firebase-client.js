import { initializeApp, getApps } from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-storage.js';
import { getAnalytics, isSupported } from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-analytics.js';

const firebaseConfig = {
  apiKey: 'AIzaSyCT_VtJ0x99PbkxzUixvm5n1qEAeb185vw',
  authDomain: 'noirave.firebaseapp.com',
  projectId: 'noirave',
  storageBucket: 'noirave.firebasestorage.app',
  messagingSenderId: '694976451991',
  appId: '1:694976451991:web:bbd35ecd25da4f9cc020d2',
  measurementId: 'G-7SKCGLGYM1',
};

export const firebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
export const firebaseStorage = getStorage(firebaseApp);
export const analytics = isSupported().then((supported) => supported ? getAnalytics(firebaseApp) : null);
