// 이 파일이 하는 일: 자료별 토론 댓글(posts/{postId}/comments)을 읽고 쓰는 함수 모음입니다.
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

const commentsRef = (postId) => collection(db, "posts", postId, "comments");

// 댓글을 오래된 순(대화 순서)으로 가져옵니다.
export async function listComments(postId) {
  const snap = await getDocs(query(commentsRef(postId), orderBy("createdAt", "asc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// 댓글을 새로 씁니다. 작성자 정보는 로그인한 사람 정보로 채웁니다.
export async function addComment(postId, body, user) {
  await addDoc(commentsRef(postId), {
    body,
    authorUid: user.uid,
    authorName: user.displayName || user.email || "이름 없음",
    authorPhotoURL: user.photoURL || "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

// 본인 댓글의 내용만 수정합니다.
export async function updateComment(postId, commentId, body) {
  await updateDoc(doc(db, "posts", postId, "comments", commentId), {
    body,
    updatedAt: serverTimestamp(),
  });
}

// 댓글을 지웁니다. (본인 댓글, 또는 관리자는 모든 댓글)
export async function deleteComment(postId, commentId) {
  await deleteDoc(doc(db, "posts", postId, "comments", commentId));
}
