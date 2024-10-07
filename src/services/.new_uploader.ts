import * as admin from 'firebase-admin';
import * as serviceAccount from './path_of_api_key.json';
import * as fs from 'fs';

const questionsData = JSON.parse(fs.readFileSync('./output.json', 'utf-8'));
const statsData = JSON.parse(fs.readFileSync('./stats.json', 'utf-8'));
const categoryData = JSON.parse(fs.readFileSync('./cats.json', 'utf-8'));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});

const db = admin.firestore();

interface Question {
  qid: number;
  main_cat: string;
  sub_cat: string;
  q_text: string;
  q_answer: string[];
  q_type: string;
}

interface Stat {
  qid: number;
  attempt_count: number;
  correct_count: number;
  rating: number;
  rated_player_count: number;
}

type CategoryData = {
  [key: string]: number[];
};

async function uploadQuestions() {
  try {
    for (const question of questionsData as Question[]) {
      const questionDetails = question;
      await db.collection('Questions').doc(String(question.qid)).set(questionDetails);
    }
    console.log("Questions 上傳完成");
  } catch (error) {
    console.error("上傳 Questions 時出錯: ", error);
  }
}

async function uploadStats() {
  try {
    for (const stat of statsData as Stat[]) {
      const statDetails = stat;
      await db.collection('Stats').doc(String(stat.qid)).set(statDetails);
    }
    console.log("Stats 上傳完成");
  } catch (error) {
    console.error("上傳 Stats 時出錯: ", error);
  }
}

async function updateCategories() {
  try {
    for (const [category, qidArray] of Object.entries(categoryData as CategoryData)) {
      const categoryDocRef = db.collection('Category').doc(category);
      for (const qid of qidArray) {
        await categoryDocRef.update({
          qids: admin.firestore.FieldValue.arrayUnion(qid)
        });
      }
    }
    console.log("Category 更新完成");
  } catch (error) {
    console.error("更新 Category 時出錯: ", error);
  }
}

async function uploadAllData() {
  await uploadQuestions();
  await uploadStats();
  await updateCategories();
}

uploadAllData().then(() => {
  console.log("所有資料上傳完成");
});