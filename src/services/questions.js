// 이 파일이 하는 일: 질문 게시판(questions 컬렉션)을 읽고 쓰는 함수 모음입니다.
// 무료 요금제에서 복합 색인이 필요 없도록 orderBy("createdAt", "desc") 하나만 씁니다.
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../lib/firebase.js";

export const QUESTION_TITLE_MAX = 200;
export const QUESTION_BODY_MAX = 10000;

const questionsRef = () => collection(db, "questions");

// 모든 질문을 최신순으로 가져옵니다.
export async function listQuestions() {
  const snap = await getDocs(query(questionsRef(), orderBy("createdAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// 질문 하나를 가져옵니다. 없으면 null.
export async function getQuestion(id) {
  const snap = await getDoc(doc(db, "questions", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// 새 질문을 올립니다. 작성자 정보는 로그인한 사람 정보로 채웁니다.
export async function createQuestion({ title, body }, user) {
  const ref = await addDoc(questionsRef(), {
    title: title.trim(),
    body,
    resolved: false,
    authorUid: user.uid,
    authorName: user.displayName || user.email || "이름 없음",
    authorPhotoURL: user.photoURL || "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

// (질문 작성자) 제목·내용을 수정합니다.
export async function updateQuestion(id, { title, body }) {
  await updateDoc(doc(db, "questions", id), { title: title.trim(), body, updatedAt: serverTimestamp() });
}

// (질문 작성자 또는 관리자) "해결됨" 표시를 켜고 끕니다.
export async function setQuestionResolved(id, resolved) {
  await updateDoc(doc(db, "questions", id), { resolved });
}

// (질문 작성자 또는 관리자) 질문을 삭제합니다. 남는 데이터가 없도록 답변도 함께 지웁니다.
export async function deleteQuestion(id) {
  const answers = await getDocs(collection(db, "questions", id, "comments"));
  for (let i = 0; i < answers.docs.length; i += 450) {
    const batch = writeBatch(db);
    answers.docs.slice(i, i + 450).forEach((c) => batch.delete(c.ref));
    await batch.commit();
  }
  await deleteDoc(doc(db, "questions", id));
}
