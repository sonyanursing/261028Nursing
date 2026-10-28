// 이 파일이 하는 일: 홈 화면입니다. 내용은 src/config/site.js 에서 고칩니다.
// Firebase 연동 여부와 상관없이 항상 정상적으로 보입니다.
import { Link } from "react-router-dom";
import site from "../config/site.js";
import { ArrowRight, Building, Mail, Phone } from "../components/Icons.jsx";

function SectionTitle({ id, eyebrow, children }) {
  return (
    <div className="section-title">
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id}>{children}</h2>
    </div>
  );
}

export default function Home() {
  const { professor, contact } = site;

  return (
    <>
      <section className="hero full-bleed">
        <div className="container hero-inner">
          <p className="eyebrow eyebrow-light">{site.labNameEn}</p>
          <h1>{site.labName}</h1>
          <p className="hero-lead">{site.tagline}</p>
          <div className="hero-actions">
            <Link to="/research" className="btn btn-light btn-lg">
              연구 자료 보기 <ArrowRight />
            </Link>
            <Link to="/courses" className="btn btn-outline-light btn-lg">
              수업 자료
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="areas-title" className="section">
        <SectionTitle id="areas-title" eyebrow="Research Areas">
          연구 분야
        </SectionTitle>
        <ol className="area-grid">
          {site.researchAreas.map((area, i) => (
            <li key={area.title} className="area-card">
              <span className="area-num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3>{area.title}</h3>
              <p>{area.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="prof-title" className="section">
        <SectionTitle id="prof-title" eyebrow="Principal Investigator">
          교수 소개
        </SectionTitle>
        <div className="profile">
          {professor.photo ? (
            <img className="profile-photo" src={professor.photo} alt={`${professor.name} 교수 사진`} />
          ) : (
            <div className="profile-photo profile-initial" aria-hidden="true">
              {professor.name.slice(0, 1)}
            </div>
          )}
          <div className="profile-body">
            <h3 className="profile-name">
              {professor.name} <span>{professor.title}</span>
            </h3>
            <p>{professor.bio}</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="contact-title" className="section">
        <SectionTitle id="contact-title" eyebrow="Contact">
          연락처
        </SectionTitle>
        <dl className="contact-grid">
          <div className="contact-item">
            <span className="contact-icon">
              <Mail />
            </span>
            <dt>이메일</dt>
            <dd>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </dd>
          </div>
          <div className="contact-item">
            <span className="contact-icon">
              <Building />
            </span>
            <dt>연구실</dt>
            <dd>{contact.office}</dd>
          </div>
          <div className="contact-item">
            <span className="contact-icon">
              <Phone />
            </span>
            <dt>전화</dt>
            <dd>{contact.phone}</dd>
          </div>
        </dl>
      </section>
    </>
  );
}
