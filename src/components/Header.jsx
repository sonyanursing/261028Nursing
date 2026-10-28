// 이 파일이 하는 일: 모든 화면 맨 위의 메뉴와 로그인 상태(이름·사진·로그아웃)를 보여 줍니다.
// 휴대폰처럼 좁은 화면에서는 메뉴가 ☰ 버튼 안으로 접힙니다.
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { isFirebaseConfigured } from "../lib/firebase.js";
import site from "../config/site.js";
import { Close, LogoMark, Menu } from "./Icons.jsx";

const roleLabels = { pending: "승인 대기", member: "회원", admin: "관리자" };

export default function Header() {
  const { user, role, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  async function handleSignOut() {
    closeMenu();
    await signOut();
    navigate("/");
  }

  const links = [
    { to: "/", label: "홈", end: true },
    { to: "/research", label: "연구 자료" },
    { to: "/courses", label: "수업 자료" },
    { to: "/questions", label: "질문 게시판" },
  ];
  if (isAdmin) links.push({ to: "/admin", label: "관리자" });

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand" onClick={closeMenu}>
          <span className="brand-mark">
            <LogoMark />
          </span>
          <span className="brand-text">
            <span className="brand-name">{site.labName}</span>
            <span className="brand-sub">{site.headerSubtitle}</span>
          </span>
        </Link>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <Close /> : <Menu />}
          <span className="visually-hidden">{menuOpen ? "메뉴 닫기" : "메뉴 열기"}</span>
        </button>

        <div id="site-menu" className={menuOpen ? "header-menu is-open" : "header-menu"}>
          <nav aria-label="주 메뉴">
            <ul className="nav-list">
              {links.map((link) => (
                <li key={link.to}>
                  <NavLink to={link.to} end={link.end} onClick={closeMenu}>
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="user-area">
            {user ? (
              <>
                <span className="user-chip">
                  {user.photoURL ? (
                    <img className="avatar" src={user.photoURL} alt="" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="avatar avatar-initial" aria-hidden="true">
                      {(user.displayName || user.email || "?").slice(0, 1)}
                    </span>
                  )}
                  <span className="user-name">{user.displayName || user.email}</span>
                  <span className={`role-badge role-${role}`}>{roleLabels[role]}</span>
                </span>
                <button type="button" className="btn btn-ghost btn-sm" onClick={handleSignOut}>
                  로그아웃
                </button>
              </>
            ) : (
              isFirebaseConfigured && (
                <Link to="/login" className="btn btn-primary btn-sm" onClick={closeMenu}>
                  로그인
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
