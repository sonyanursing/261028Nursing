// 이 파일이 하는 일: 연구·수업 자료(posts 컬렉션)를 읽고 쓰는 함수 모음입니다.
// 무료 요금제에서 복합 색인이 필요 없도록 orderBy("createdAt", "desc") 하나만 쓰고,
// 분류(type) 필터링은 화면(클라이언트)에서 합니다.
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

const postsRef = () => collection(db, "posts");

// 모든 자료를 최신순으로 가져옵니다.
export async function listPosts() {
  const snap = await getDocs(query(postsRef(), orderBy("createdAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// 자료 하나를 가져옵니다. 없으면 null.
export async function getPost(id) {
  const snap = await getDoc(doc(db, "posts", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// 폼에서 받은 값을 저장 형식에 맞게 정리합니다.
function cleanPost(form) {
  return {
    type: form.type === "course" ? "course" : "research",
    title: form.title.trim(),
    summary: form.summary.trim(),
    body: form.body,
    tags: form.tags,
    links: form.links,
  };
}

// (관리자) 새 자료를 만듭니다.
export async function createPost(form, authorUid) {
  const ref = await addDoc(postsRef(), {
    ...cleanPost(form),
    authorUid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

// (관리자) 자료를 수정합니다.
export async function updatePost(id, form) {
  await updateDoc(doc(db, "posts", id), { ...cleanPost(form), updatedAt: serverTimestamp() });
}

// (관리자) 자료를 삭제합니다. 남는 데이터가 없도록 딸린 댓글도 함께 지웁니다.
export async function deletePost(id) {
  const comments = await getDocs(collection(db, "posts", id, "comments"));
  // 한 번에 최대 500개까지 지울 수 있어 나눠서 처리합니다.
  for (let i = 0; i < comments.docs.length; i += 450) {
    const batch = writeBatch(db);
    comments.docs.slice(i, i + 450).forEach((c) => batch.delete(c.ref));
    await batch.commit();
  }
  await deleteDoc(doc(db, "posts", id));
}
