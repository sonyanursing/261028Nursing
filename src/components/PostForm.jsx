// 이 파일이 하는 일: (관리자) 자료 작성·수정 폼입니다. 분류, 제목, 요약, 본문, 태그, 첨부 링크(여러 개)를 입력합니다.
import { useState } from "react";
import { isSafeUrl } from "../lib/format.js";
import { ErrorMessage } from "./Status.jsx";

const emptyLink = { label: "", url: "" };

export default function PostForm({ post, onSave, onCancel }) {
  const [type, setType] = useState(post?.type || "research");
  const [title, setTitle] = useState(post?.title || "");
  const [summary, setSummary] = useState(post?.summary || "");
  const [body, setBody] = useState(post?.body || "");
  const [tagsText, setTagsText] = useState((post?.tags || []).join(", "));
  const [links, setLinks] = useState(post?.links?.length ? post.links : [emptyLink]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function changeLink(index, field, value) {
    setLinks(links.map((link, i) => (i === index ? { ...link, [field]: value } : link)));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const cleanLinks = links
      .map((l) => ({ label: l.label.trim(), url: l.url.trim() }))
      .filter((l) => l.label || l.url);
    if (cleanLinks.some((l) => !isSafeUrl(l.url))) {
      setError("첨부 링크 주소는 https:// 로 시작하는 전체 주소로 입력해 주세요.");
      return;
    }
    // "간호, 교육" → ["간호", "교육"] (빈 값과 중복 제거)
    const tags = [
      ...new Set(
        tagsText
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      ),
    ];
    setSaving(true);
    setError("");
    const message = await onSave({ type, title, summary, body, tags, links: cleanLinks });
    setSaving(false);
    if (message) setError(message);
  }

  return (
    <form className="card post-form" onSubmit={handleSubmit}>
      <p className="notice notice-warning" role="note">
        ⚠️ 환자·연구참여자 등 개인 식별 정보를 올리지 마세요.
      </p>
      <h3>{post ? "자료 수정" : "새 자료 작성"}</h3>

      <label htmlFor="pf-type">분류</label>
      <select id="pf-type" value={type} onChange={(e) => setType(e.target.value)}>
        <option value="research">연구 자료</option>
        <option value="course">수업 자료</option>
      </select>

      <label htmlFor="pf-title">제목 (필수)</label>
      <input
        id="pf-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        maxLength={200}
      />

      <label htmlFor="pf-summary">요약 (목록 카드에 표시)</label>
      <input id="pf-summary" value={summary} onChange={(e) => setSummary(e.target.value)} maxLength={500} />

      <label htmlFor="pf-body">본문</label>
      <textarea id="pf-body" value={body} onChange={(e) => setBody(e.target.value)} rows={10} />

      <label htmlFor="pf-tags">태그 (쉼표로 구분, 예: 노인간호, 질적연구)</label>
      <input id="pf-tags" value={tagsText} onChange={(e) => setTagsText(e.target.value)} />

      <fieldset className="links-fieldset">
        <legend>첨부 링크 (Google Drive 등 공유 링크)</legend>
        {links.map((link, i) => (
          <div key={i} className="link-row">
            <label className="visually-hidden" htmlFor={`pf-link-label-${i}`}>
              링크 {i + 1} 이름
            </label>
            <input
              id={`pf-link-label-${i}`}
              placeholder="이름 (예: 강의 슬라이드)"
              value={link.label}
              onChange={(e) => changeLink(i, "label", e.target.value)}
            />
            <label className="visually-hidden" htmlFor={`pf-link-url-${i}`}>
              링크 {i + 1} 주소
            </label>
            <input
              id={`pf-link-url-${i}`}
              type="url"
              placeholder="https://drive.google.com/..."
              value={link.url}
              onChange={(e) => changeLink(i, "url", e.target.value)}
            />
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setLinks(links.filter((_, j) => j !== i))}
              aria-label={`링크 ${i + 1} 삭제`}
            >
              삭제
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => setLinks([...links, emptyLink])}
        >
          + 링크 추가
        </button>
      </fieldset>

      <ErrorMessage message={error} />
      <div className="button-row">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          취소
        </button>
        <button type="submit" className="btn btn-primary" disabled={saving || !title.trim()}>
          {saving ? "저장 중…" : "저장"}
        </button>
      </div>
    </form>
  );
}
