// 이 파일이 하는 일: 로그인 상태와 역할(방문자·승인 대기·회원·관리자)을 사이트 전체에 알려 줍니다.
// 어느 화면에서든 useAuth()로 user, profile, role, isAdmin, loading 값을 꺼내 쓸 수 있습니다.
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut } from "firebase/auth";
import { adminEmail, auth, googleProvider, isFirebaseConfigured } from "../lib/firebase.js";
import { createPendingProfile, getUserProfile } from "../services/users.js";
import { toKoreanError } from "../services/errors.js";

const AuthContext = createContext(null);

// 화면에서 관리자인지 판단합니다.
// ※ 이것은 메뉴를 보여 줄지 정하는 편의 기능입니다. 실제 보안은 firestore.rules 가 담당하므로
//   누군가 화면을 조작해도 관리자 데이터에는 접근할 수 없습니다.
function checkAdmin(user) {
  return Boolean(user && adminEmail && user.emailVerified && (user.email || "").toLowerCase() === adminEmail);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  // Firebase가 설정되지 않았으면 기다릴 것이 없으므로 처음부터 loading = false
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [error, setError] = useState("");

  // 로그인한 사람의 회원 문서를 읽고, 없으면 승인 대기 상태로 만듭니다.
  const loadProfile = useCallback(async (currentUser) => {
    if (!currentUser || checkAdmin(currentUser)) {
      // 관리자는 회원 문서가 없어도 관리자로 인식합니다(문서를 만들지 않음).
      setProfile(null);
      return;
    }
    try {
      setError("");
      const existing = await getUserProfile(currentUser.uid);
      setProfile(existing || (await createPendingProfile(currentUser)));
    } catch (err) {
      setProfile(null);
      setError(toKoreanError(err));
    }
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured) return undefined;
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      setUser(currentUser);
      await loadProfile(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, [loadProfile]);

  // Google 팝업으로 로그인합니다. (signInWithRedirect는 사용하지 않습니다)
  const signIn = useCallback(async () => {
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setError(toKoreanError(err));
    }
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
    setProfile(null);
  }, []);

  // 승인 대기 화면의 "승인 여부 다시 확인" 버튼에서 사용합니다.
  const refreshProfile = useCallback(async () => {
    setLoading(true);
    await loadProfile(auth.currentUser);
    setLoading(false);
  }, [loadProfile]);

  const isAdmin = checkAdmin(user);
  let role = "visitor";
  if (isAdmin) role = "admin";
  else if (user && profile) role = profile.role === "member" ? "member" : "pending";
  else if (user) role = "pending";

  const value = { user, profile, role, isAdmin, loading, error, signIn, signOut, refreshProfile };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 컴포넌트와 useAuth를 한 파일에 두어 이해하기 쉽게 했습니다. (개발 중 화면 자동 새로고침 경고만 끔)
// eslint-disable-next-line react/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
