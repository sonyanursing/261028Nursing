// 이 파일이 하는 일: 모든 화면 맨 위의 메뉴와 로그인 상태(이름·사진·로그아웃)를 보여 줍니다.
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { isFirebaseConfigured } from "../lib/firebase.js";
import site from "../config/site.js";

const roleLabels = { pending: "승인 대기", member: "회원", admin: "관리자" };

export default function Header() {
  const { user, role, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/");
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand">
          {site.labName}
        </Link>

        <nav aria-label="주 메뉴">
          <ul className="nav-list">
            <li>
              <NavLink to="/" end>
                홈
              </NavLink>
            </li>
            <li>
              <NavLink to="/research">연구 자료</NavLink>
            </li>
            <li>
              <NavLink to="/courses">수업 자료</NavLink>
            </li>
            {isAdmin && (
              <li>
                <NavLink to="/admin">관리자</NavLink>
              </li>
            )}
          </ul>
        </nav>

        <div className="user-area">
          {user ? (
            <>
              {user.photoURL ? (
                <img className="avatar" src={user.photoURL} alt="" referrerPolicy="no-referrer" />
              ) : null}
              <span className="user-name">
                {user.displayName || user.email}
                <span className="role-badge">{roleLabels[role]}</span>
              </span>
              <button type="button" className="btn btn-ghost btn-sm" onClick={handleSignOut}>
                로그아웃
              </button>
            </>
          ) : (
            isFirebaseConfigured && (
              <Link to="/login" className="btn btn-primary btn-sm">
                로그인
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  );
}
