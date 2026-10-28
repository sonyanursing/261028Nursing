// 이 파일이 하는 일: 댓글 하나를 보여 주고, 권한이 있으면 수정·삭제 버튼을 보여 줍니다.
import { useState } from "react";
import { formatDate } from "../lib/format.js";
import CommentForm from "./CommentForm.jsx";

export default function CommentItem({ comment, canEdit, canDelete, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);

  async function handleUpdate(body) {
    const ok = await onUpdate(comment.id, body);
    if (ok) setEditing(false);
    return ok;
  }

  const edited =
    comment.updatedAt &&
    comment.createdAt &&
    comment.updatedAt.toMillis() - comment.createdAt.toMillis() > 1000;

  return (
    <li className="comment">
      <div className="comment-head">
        {comment.authorPhotoURL ? (
          <img className="avatar" src={comment.authorPhotoURL} alt="" referrerPolicy="no-referrer" />
        ) : (
          <span className="avatar avatar-empty" aria-hidden="true" />
        )}
        <strong>{comment.authorName}</strong>
        <span className="muted small">
          {formatDate(comment.createdAt)}
          {edited && " (수정됨)"}
        </span>
      </div>

      {editing ? (
        <CommentForm
          label="댓글 수정"
          initialValue={comment.body}
          submitLabel="수정 저장"
          onSubmit={handleUpdate}
          onCancel={() => setEditing(false)}
        />
      ) : (
        // 사용자 입력은 글자 그대로(텍스트로만) 표시합니다.
        <p className="comment-body">{comment.body}</p>
      )}

      {!editing && (canEdit || canDelete) && (
        <div className="button-row">
          {canEdit && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditing(true)}>
              수정
            </button>
          )}
          {canDelete && (
            <button type="button" className="btn btn-danger btn-sm" onClick={() => onDelete(comment.id)}>
              삭제
            </button>
          )}
        </div>
      )}
    </li>
  );
}
