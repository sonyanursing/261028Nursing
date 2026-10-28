// 이 파일이 하는 일: "Google로 로그인" 버튼이 있는 로그인 화면입니다.
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { isFirebaseConfigured } from "../lib/firebase.js";
import ConfigNotice from "../components/ConfigNotice.jsx";
import Panel from "../components/Panel.jsx";
import { Google, Lock } from "../components/Icons.jsx";
import { ErrorMessage, Loading } from "../components/Status.jsx";

export default function Login() {
  const { user, role, loading, error, signIn } = useAuth();
  const location = useLocation();

  if (!isFirebaseConfigured) return <ConfigNotice />;
  if (loading) return <Loading text="로그인 정보를 확인하는 중…" />;

  // 이미 로그인했다면 역할에 맞는 화면으로 보냅니다.
  if (user) {
    if (role === "pending") return <Navigate to="/pending" replace />;
    const from = location.state?.from;
    const fallback = role === "admin" ? "/admin" : "/research";
    return <Navigate to={from || fallback} replace />;
  }

  return (
    <Panel icon={<Lock />} title="연구실 구성원 로그인">
      <p className="panel-lead">연구·수업 자료와 토론은 승인된 구성원만 이용할 수 있습니다.</p>
      <ErrorMessage message={error} />
      <button type="button" className="btn btn-google btn-lg" onClick={signIn}>
        <Google /> Google로 로그인
      </button>
      <p className="muted small">처음 로그인하면 교수님의 승인 후 자료를 볼 수 있습니다.</p>
    </Panel>
  );
}
