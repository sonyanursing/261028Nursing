// 이 파일이 하는 일: 댓글 입력 상자(글자 수 표시 포함)입니다. 새 댓글 쓰기와 댓글 수정에 같이 씁니다.
import { useId, useState } from "react";
import { COMMENT_MAX_LENGTH } from "../services/comments.js";

export default function CommentForm({ initialValue = "", submitLabel, onSubmit, onCancel, label }) {
  const [body, setBody] = useState(initialValue);
  const [saving, setSaving] = useState(false);
  const fieldId = useId();
  const trimmed = body.trim();
  const tooLong = body.length > COMMENT_MAX_LENGTH;

  async function handleSubmit(event) {
    event.preventDefault();
    if (!trimmed || tooLong) return;
    setSaving(true);
    const ok = await onSubmit(body);
    setSaving(false);
    if (ok && !initialValue) setBody(""); // 새 댓글이면 입력 상자를 비웁니다.
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <label htmlFor={fieldId}>{label}</label>
      <textarea
        id={fieldId}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
        maxLength={COMMENT_MAX_LENGTH}
        required
      />
      <div className="form-row">
        <span className={tooLong ? "error-text small" : "muted small"} aria-live="polite">
          {body.length} / {COMMENT_MAX_LENGTH}자
        </span>
        <div className="button-row">
          {onCancel && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel}>
              취소
            </button>
          )}
          <button type="submit" className="btn btn-primary btn-sm" disabled={saving || !trimmed || tooLong}>
            {saving ? "저장 중…" : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
