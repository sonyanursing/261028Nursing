// 이 파일이 하는 일: 모든 화면에 공통으로 들어가는 틀(헤더 · 본문 · 푸터)을 만듭니다.
import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

export default function Layout() {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        본문으로 건너뛰기
      </a>
      <Header />
      <main id="main" className="container main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
