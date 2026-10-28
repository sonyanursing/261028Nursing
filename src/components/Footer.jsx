// 이 파일이 하는 일: 모든 화면 맨 아래에 연구윤리 안내 문구를 보여 줍니다.
import site from "../config/site.js";

const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <p>{site.ethicsNotice}</p>
        <p className="muted small">
          © {year} {site.labName}
        </p>
      </div>
    </footer>
  );
}
