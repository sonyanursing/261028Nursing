// 이 파일이 하는 일: 자료 상세·질문 상세 화면 아래의 댓글 영역입니다. 목록 보기·작성·수정·삭제를 담당합니다.
// parent="posts"(자료 토론) 또는 "questions"(질문 답변), title 은 영역 제목입니다.
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { addComment, deleteComment, listComments, updateComment } from "../services/comments.js";
import { toKoreanError } from "../services/errors.js";
import { useLoader } from "../lib/useLoader.js";
import CommentForm from "./CommentForm.jsx";
import CommentItem from "./CommentItem.jsx";
import { ErrorMessage, Loading } from "./Status.jsx";

export default function CommentSection({
  parent = "posts",
  parentId,
  title = "토론",
  placeholderLabel = "의견 남기기",
  submitLabel = "댓글 등록",
  canDeleteAll = false, // 관리자 외에 모든 댓글을 지울 수 있는 사람인지 (예: 질문 작성자)
}) {
  const { user, isAdmin } = useAuth();
  const {
    data,
    loading,
    error: loadError,
    reload,
  } = useLoader(() => listComments(parent, parentId), [parent, parentId]);
  const comments = data || [];
  const [error, setError] = useState("");

  // 작성·수정·삭제를 실행하고, 성공하면 목록을 새로 불러옵니다. 성공 여부(true/false)를 돌려줍니다.
  async function run(action) {
    setError("");
    try {
      await action();
      reload();
      return true;
    } catch (err) {
      setError(toKoreanError(err));
      return false;
    }
  }

  const handleAdd = (body) => run(() => addComment(parent, parentId, body, user));
  const handleUpdate = (commentId, body) => run(() => updateComment(parent, parentId, commentId, body));
  const handleDelete = (commentId) => {
    if (!window.confirm("이 댓글을 삭제할까요?")) return;
    run(() => deleteComment(parent, parentId, commentId));
  };

  return (
    <section className="section comments" aria-labelledby="comments-title">
      <h2 id="comments-title">
        {title} <span className="count-badge">{comments.length}</span>
      </h2>
      <ErrorMessage message={loadError || error} />
      {loading ? (
        <Loading text="댓글을 불러오는 중…" />
      ) : comments.length === 0 ? (
        <p className="empty-state">아직 의견이 없습니다. 첫 의견을 남겨 주세요.</p>
      ) : (
        <ul className="comment-list">
          {comments.map((comment) => {
            const isMine = comment.authorUid === user.uid;
            return (
              <CommentItem
                key={comment.id}
                comment={comment}
                canEdit={isMine}
                canDelete={isMine || isAdmin || canDeleteAll}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            );
          })}
        </ul>
      )}
      <CommentForm label={placeholderLabel} submitLabel={submitLabel} onSubmit={handleAdd} />
    </section>
  );
}
