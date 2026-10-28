// 이 파일이 하는 일: 회원 정보(users 컬렉션)를 읽고 쓰는 함수 모음입니다.
// Firestore 접근은 services 폴더에서만 합니다.
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase.js";

// 내 회원 문서를 읽습니다. 없으면 null을 돌려줍니다.
export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// 처음 로그인한 사람의 회원 문서를 "승인 대기(pending)" 상태로 만듭니다.
export async function createPendingProfile(user) {
  const data = {
    displayName: user.displayName || "",
    email: user.email || "",
    photoURL: user.photoURL || "",
    role: "pending",
    createdAt: serverTimestamp(),
  };
  await setDoc(doc(db, "users", user.uid), data);
  return { id: user.uid, ...data, createdAt: null };
}

// (관리자) 전체 회원 목록을 최신 가입 순으로 가져옵니다.
export async function listUsers() {
  const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// (관리자) 승인: 역할을 member로 바꿉니다.
export async function approveUser(uid) {
  await updateDoc(doc(db, "users", uid), { role: "member" });
}

// (관리자) 거절 또는 회원 삭제: 회원 문서를 지웁니다.
// 다시 로그인하면 승인 대기 상태로 새로 등록됩니다.
export async function removeUser(uid) {
  await deleteDoc(doc(db, "users", uid));
}
