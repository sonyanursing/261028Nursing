// 이 파일이 하는 일: 권한이 없는 사람이 들어오면 알맞은 화면으로 보냅니다.
// (화면 이동은 편의 기능이며, 실제 데이터 보호는 firestore.rules 가 담당합니다.)
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { isFirebaseConfigured } from "../lib/firebase.js";
import ConfigNotice from "./ConfigNotice.jsx";
import { Loading } from "./Status.jsx";

// require: "member"(회원 이상) 또는 "admin"(관리자만)
export default function ProtectedRoute({ require = "member" }) {
  const { role, loading } = useAuth();
  const location = useLocation();

  if (!isFirebaseConfigured) return <ConfigNotice />;
  if (loading) return <Loading text="로그인 정보를 확인하는 중…" />;

  // 비로그인 → 로그인 화면 (로그인 후 원래 가려던 곳으로 돌아오도록 주소를 기억)
  if (role === "visitor") return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  // 승인 대기 → 승인 대기 안내 화면
  if (role === "pending") return <Navigate to="/pending" replace />;
  // 회원이 관리자 화면에 들어오면 → 홈
  if (require === "admin" && role !== "admin") return <Navigate to="/" replace />;

  return <Outlet />;
}
