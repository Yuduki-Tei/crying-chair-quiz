import { useResultStore, useQuestionStore, useUserStore } from "../store";
import { getBit, setBit, fromBase64, toBase64 } from "./index";

export function useCheckAnswer(qInd: number, ans: string) {
  const res = useResultStore();
  const qStore = useQuestionStore();
  const qid = qStore.getQuestion(qInd).qid;

  updateResultStore(qInd, qStore, ans, res);
  updateLocalBit(qInd, qid, res);
  if (res.getRes(qInd).correct) {
    let point =
      Math.floor(
        (1 -
          res.getRes(qInd).interval / qStore.getQuestion(qInd).q_text.length) *
          10
      ) *
        10 +
      30;
    res.setRes(qInd, { point: point });
  }
}

export function updateResultStore(
  qInd: number,
  qStore: any,
  ans: string,
  res: any
) {
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

export function updateLocalBit(qInd: number, qid: number, res: any) {
  const user = useUserStore();
  const userData = user.dataList;
  let ans_bit = fromBase64(userData.answer_history);
  let cor_bit = fromBase64(userData.correct_history);
  if (getBit(ans_bit, qid) === 0) {
    ans_bit = setBit(ans_bit, qid, 1);
    userData.answer_history = toBase64(ans_bit);

    cor_bit = setBit(cor_bit, qid, +res.getRes(qInd).correct); //[+bool] becomes a number
    userData.correct_history = toBase64(cor_bit);
  }
}
