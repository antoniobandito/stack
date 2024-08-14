import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCw9Ff3frX1PYwziK0Jr3I9yvyvkWxy9P8",
    authDomain: "stack-efd80.firebaseapp.com",
    projectId: "stack-efd80",
    storageBucket: "stack-efd80.appspot.com",
    messagingSenderId: "808166236379",
    appId: "1:808166236379:web:ce1fb65ef5b289283bacfe",
    measurementId: "G-R8G3CE6FJ0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
