// 이 파일이 하는 일: 모든 화면 맨 아래에 연구실 정보와 연구윤리 안내 문구를 보여 줍니다.
import site from "../config/site.js";
import { LogoMark } from "./Icons.jsx";

const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <span className="brand-mark brand-mark-light">
            <LogoMark />
          </span>
          <div>
            <p className="footer-name">{site.labName}</p>
            <p className="footer-sub">{site.labNameEn}</p>
          </div>
        </div>
        <address className="footer-contact">
          <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
          <span>{site.contact.office}</span>
        </address>
      </div>
      <div className="container footer-bottom">
        <p className="footer-ethics">{site.ethicsNotice}</p>
        <p className="footer-copy">
          © {year} {site.labName}
        </p>
      </div>
    </footer>
  );
}
