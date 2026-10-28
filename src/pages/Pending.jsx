// 이 파일이 하는 일: 로그인했지만 아직 교수님의 승인을 받지 못한 사람에게 안내를 보여 줍니다.
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { isFirebaseConfigured } from "../lib/firebase.js";
import ConfigNotice from "../components/ConfigNotice.jsx";
import Panel from "../components/Panel.jsx";
import { Clock } from "../components/Icons.jsx";
import { ErrorMessage, Loading } from "../components/Status.jsx";

export default function Pending() {
  const { user, role, loading, error, refreshProfile } = useAuth();

  if (!isFirebaseConfigured) return <ConfigNotice />;
  if (loading) return <Loading text="승인 상태를 확인하는 중…" />;
  if (!user) return <Navigate to="/login" replace />;
  if (role === "member" || role === "admin") return <Navigate to="/research" replace />;

  return (
    <Panel icon={<Clock />} tone="warning" title="승인 대기 중입니다">
      <p className="panel-lead">
        <strong>{user.displayName || user.email}</strong> 님, 가입 신청이 접수되었습니다.
      </p>
      <p className="muted">
        교수님이 승인하면 연구·수업 자료와 토론에 참여할 수 있습니다. 승인 후 아래 버튼을 눌러 주세요.
      </p>
      <ErrorMessage message={error} />
      <button type="button" className="btn btn-primary" onClick={refreshProfile}>
        승인 여부 다시 확인
      </button>
    </Panel>
  );
}
