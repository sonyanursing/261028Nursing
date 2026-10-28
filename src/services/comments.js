// 이 파일이 하는 일: 자료 토론 댓글(posts/{id}/comments)과 질문 답변(questions/{id}/comments)을 읽고 쓰는 함수 모음입니다.
// parent 에는 "posts"(자료) 또는 "questions"(질문)가, parentId 에는 그 문서의 id가 들어갑니다.
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase.js";

export const COMMENT_MAX_LENGTH = 3000;

const commentsRef = (parent, parentId) => collection(db, parent, parentId, "comments");

// 댓글을 오래된 순(대화 순서)으로 가져옵니다.
export async function listComments(parent, parentId) {
  const snap = await getDocs(query(commentsRef(parent, parentId), orderBy("createdAt", "asc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// 댓글을 새로 씁니다. 작성자 정보는 로그인한 사람 정보로 채웁니다.
export async function addComment(parent, parentId, body, user) {
  await addDoc(commentsRef(parent, parentId), {
    body,
    authorUid: user.uid,
    authorName: user.displayName || user.email || "이름 없음",
    authorPhotoURL: user.photoURL || "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

// 본인 댓글의 내용만 수정합니다.
export async function updateComment(parent, parentId, commentId, body) {
  await updateDoc(doc(db, parent, parentId, "comments", commentId), {
    body,
    updatedAt: serverTimestamp(),
  });
}

// 댓글을 지웁니다. (본인 댓글, 또는 관리자는 모든 댓글)
export async function deleteComment(parent, parentId, commentId) {
  await deleteDoc(doc(db, parent, parentId, "comments", commentId));
}
