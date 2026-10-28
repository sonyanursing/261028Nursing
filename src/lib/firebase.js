// 이 파일이 하는 일: Firebase(로그인·데이터베이스)를 준비합니다.
// 환경변수가 없으면 Firebase를 켜지 않고, 사이트는 "연동 전" 상태로 안전하게 동작합니다.
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// 로그인과 데이터베이스에 꼭 필요한 값이 모두 있을 때만 "설정됨"으로 봅니다.
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId,
);

// 화면에서 관리자 메뉴를 보여 줄지 정하는 데만 쓰는 값입니다.
// ※ 편의 기능일 뿐, 실제 보안(누가 무엇을 읽고 쓸 수 있는지)은 firestore.rules 가 담당합니다.
//   그래서 이 값은 firestore.rules 안의 관리자 이메일과 반드시 같아야 합니다.
export const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL || "").trim().toLowerCase();

let app = null;
let auth = null;
let db = null;
let googleProvider = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: "select_account" });
}

export { app, auth, db, googleProvider };
