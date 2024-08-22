import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  addDoc,
  arrayUnion,
  updateDoc,
} from "firebase/firestore";
import * as fs from "fs";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

initializeApp(firebaseConfig);
const db = getFirestore();

const file1 = JSON.parse(fs.readFileSync("./output.json", "utf-8"));
const file2 = JSON.parse(fs.readFileSync("./stats.json", "utf-8"));
const file3 = JSON.parse(fs.readFileSync("./cats.json", "utf-8"));

const qidToDocId: { [key: string]: string } = {};

const addQuestions = async () => {
  for (const item of file1) {
    const docRef = await addDoc(collection(db, "Questions"), item);
    const docId = docRef.id;
    qidToDocId[item.qid] = docId;
    await setDoc(docRef, item);
  }
};

const addStatus = async () => {
  for (const item of file2) {
    const docId = qidToDocId[item.qid];
    if (docId) {
      await setDoc(doc(db, "Stats", docId), item);
    } else {
      console.warn(`No matching document ID found for qid: ${item.qid}`);
    }
  }
};

const updateCat = async () => {
  for (const [key, elements] of Object.entries(file3)) {
    const docRef = doc(db, "Category", key);
    await updateDoc(docRef, {
      qids: arrayUnion(...(elements as number[])),
    });
  }
};

// 執行上傳
const run = async () => {
  await addQuestions();
  await addStatus();
  await updateCat();
};

run().catch(console.error);
