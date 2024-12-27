import { useResultStore, useQuestionStore, useUserStore } from "../store";
import { getBit, setBit, fromBase64, toBase64 } from "./index";

export function useCheckAnswer(qInd: number, ans: string, interval: number) {
  const res = useResultStore();
  const qStore = useQuestionStore();
  const qData = qStore.getQuestion(qInd);

  setInterval(qInd, interval, qStore, res);
  updateResultStore(qInd, qStore, ans, res);
  updateLocalAnswerBit(qInd, qData.qid, res);
  if (res.getRes(qInd).correct) {
    let base = 60;
    let x = res.getRes(qInd).interval / qData.q_text.length;
    let bonus = [60, 50, 40, 20, 0][Math.min(4, Math.floor(x / 0.2))];
    res.setRes(qInd, { point: base + bonus });
    res.total += base + bonus;
  }
}

export function buttonGood(qInd: number) {
  updateLocalRatingBit(qInd, 1);
}

export function buttonBad(qInd: number) {
  updateLocalRatingBit(qInd, 0);
}

export function getQid(qInd: number) {
  const qStore = useQuestionStore();
  const qid = qStore.getQuestion(qInd).qid;
  return qid;
}

function setInterval(qInd: number, interval: number, qStore: any, res: any) {
  if (interval === 0) {
    res.setRes(qInd, { interval: qStore.getQuestion(qInd).q_text.length});
  }
  else {
    res.setRes(qInd, { interval: interval });
  }
}

function updateResultStore(qInd: number, qStore: any, ans: string, res: any) {
  if (ans.length === 0) {
    res.setRes(qInd, { answer: "未回答" });
  } else {
    res.setRes(qInd, { answer: ans });
  }
  let isMatch = qStore
    .getQuestion(qInd)
    .q_answer.some(
      (item: any) => item.trim().toLowerCase() === ans.trim().toLowerCase()
    ); //check if matches any answer in list
  res.setRes(qInd, { done: true }); // mark the question as done
  res.setRes(qInd, { correct: isMatch });
}

function updateLocalAnswerBit(qInd: number, qid: number, res: any) {
  const user = useUserStore();
  const userData = user.dataList;
  let ans_bit = fromBase64(userData.answer_history);
  let cor_bit = fromBase64(userData.correct_history);

  ans_bit = setBit(ans_bit, qid, 1);
  userData.answer_history = toBase64(ans_bit);
  cor_bit = setBit(cor_bit, qid, +res.getRes(qInd).correct); //[+bool] becomes a number
  userData.correct_history = toBase64(cor_bit);
}

function updateLocalRatingBit(qInd: number, rate: number) {
  const qid = getQid(qInd);
  const user = useUserStore();
  const userData = user.dataList;
  let bad_bit = fromBase64(userData.bad_history);
  let good_bit = fromBase64(userData.good_history);

  if (rate === 1) {
    good_bit = setBit(good_bit, qid, +!getBit(good_bit, qid)); // set 1 if old record is not good(means init or old record is bad), else means cancel so set 0
    bad_bit = setBit(bad_bit, qid, 0);
  } else if (rate === 0) {
    bad_bit = setBit(bad_bit, qid, +!getBit(bad_bit, qid)); // when rate is bad
    good_bit = setBit(good_bit, qid, 0);
  }
  userData.good_history = toBase64(good_bit);
  userData.bad_history = toBase64(bad_bit);
}
