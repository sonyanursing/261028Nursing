// 이 파일이 하는 일: 질문 작성·수정 폼입니다. (제목, 내용)
import { useState } from "react";
import { QUESTION_BODY_MAX, QUESTION_TITLE_MAX } from "../services/questions.js";
import { ErrorMessage } from "./Status.jsx";

export default function QuestionForm({ question, onSave, onCancel }) {
  const [title, setTitle] = useState(question?.title || "");
  const [body, setBody] = useState(question?.body || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const canSave = title.trim() && body.trim() && !saving;

  async function handleSubmit(event) {
    event.preventDefault();
    if (!canSave) return;
    setSaving(true);
    setError("");
    const message = await onSave({ title, body });
    setSaving(false);
    if (message) setError(message);
  }

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <p className="notice notice-warning" role="note">
        ⚠️ 환자·연구참여자 등 개인 식별 정보를 올리지 마세요.
      </p>
      <h3>{question ? "질문 수정" : "새 질문 작성"}</h3>

      <label htmlFor="qf-title">제목 (필수)</label>
      <input
        id="qf-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={QUESTION_TITLE_MAX}
        placeholder="예: 공분산분석 결과 해석이 궁금합니다"
        required
      />

      <label htmlFor="qf-body">내용 (필수)</label>
      <textarea
        id="qf-body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={8}
        maxLength={QUESTION_BODY_MAX}
        placeholder="궁금한 점을 자세히 적어 주세요. 파일은 Google Drive 링크로 붙여 주세요."
        required
      />
      <p className="muted small">
        {body.length} / {QUESTION_BODY_MAX}자
      </p>

      <ErrorMessage message={error} />
      <div className="button-row">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          취소
        </button>
        <button type="submit" className="btn btn-primary" disabled={!canSave}>
          {saving ? "저장 중…" : question ? "수정 저장" : "질문 올리기"}
        </button>
      </div>
    </form>
  );
}
