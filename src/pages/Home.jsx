// 이 파일이 하는 일: 홈 화면입니다. 내용은 src/config/site.js 에서 고칩니다.
// Firebase 연동 여부와 상관없이 항상 정상적으로 보입니다.
import site from "../config/site.js";

export default function Home() {
  const { professor, contact } = site;

  return (
    <>
      <section className="hero">
        <h1>{site.labName}</h1>
        <p className="lead">{site.tagline}</p>
      </section>

      <section aria-labelledby="areas-title" className="section">
        <h2 id="areas-title">연구 분야</h2>
        <ul className="card-grid">
          {site.researchAreas.map((area) => (
            <li key={area.title} className="card">
              <h3>{area.title}</h3>
              <p>{area.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="prof-title" className="section">
        <h2 id="prof-title">교수 소개</h2>
        <div className="card profile">
          {professor.photo && (
            <img className="profile-photo" src={professor.photo} alt={`${professor.name} 교수 사진`} />
          )}
          <div>
            <h3>
              {professor.name} <span className="muted">{professor.title}</span>
            </h3>
            <p>{professor.bio}</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="contact-title" className="section">
        <h2 id="contact-title">연락처</h2>
        <dl className="card contact-list">
          <dt>이메일</dt>
          <dd>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </dd>
          <dt>연구실</dt>
          <dd>{contact.office}</dd>
          <dt>전화</dt>
          <dd>{contact.phone}</dd>
        </dl>
      </section>
    </>
  );
}
