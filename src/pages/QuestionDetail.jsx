// 이 파일이 하는 일: 질문 하나의 내용을 보여 주고, 아래에 답변(댓글) 영역을 붙입니다.
// 질문 작성자는 수정·삭제·해결 표시를, 관리자는 삭제·해결 표시를 할 수 있습니다.
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { deleteQuestion, getQuestion, setQuestionResolved, updateQuestion } from "../services/questions.js";
import { toKoreanError } from "../services/errors.js";
import { useLoader } from "../lib/useLoader.js";
import { formatDate } from "../lib/format.js";
import CommentSection from "../components/CommentSection.jsx";
import QuestionForm from "../components/QuestionForm.jsx";
import { ArrowLeft } from "../components/Icons.jsx";
import { ErrorMessage, Loading } from "../components/Status.jsx";

export default function QuestionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { data: question, loading, error, reload } = useLoader(() => getQuestion(id), [id]);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!question) return <ErrorMessage message="요청한 질문을 찾을 수 없습니다." />;

  const isMine = question.authorUid === user.uid;

  async function run(action) {
    setBusy(true);
    setActionError("");
    try {
      await action();
      return true;
    } catch (err) {
      setActionError(toKoreanError(err));
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function handleSave(form) {
    try {
      await updateQuestion(question.id, form);
      setEditing(false);
      reload();
      return "";
    } catch (err) {
      return toKoreanError(err);
    }
  }

  async function handleToggleResolved() {
    if (await run(() => setQuestionResolved(question.id, !question.resolved))) reload();
  }

  async function handleDelete() {
    if (!window.confirm("이 질문과 달린 답변을 모두 삭제할까요? 되돌릴 수 없습니다.")) return;
    if (await run(() => deleteQuestion(question.id))) navigate("/questions");
  }

  return (
    <article className="post-detail">
      <Link to="/questions" className="back-link">
        <ArrowLeft /> 질문 게시판 목록
      </Link>

      {editing ? (
        <QuestionForm question={question} onSave={handleSave} onCancel={() => setEditing(false)} />
      ) : (
        <>
          <header className="post-header">
            <span className={question.resolved ? "status-chip status-resolved" : "status-chip status-open"}>
              {question.resolved ? "해결됨" : "답변 대기"}
            </span>
            <h1>{question.title}</h1>
            <div className="post-meta">
              <span>{question.authorName}</span>
              <span>작성일 {formatDate(question.createdAt)}</span>
              {question.updatedAt && formatDate(question.updatedAt) !== formatDate(question.createdAt) && (
                <span>수정일 {formatDate(question.updatedAt)}</span>
              )}
            </div>
            {(isMine || isAdmin) && (
              <div className="button-row">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  disabled={busy}
                  onClick={handleToggleResolved}
                >
                  {question.resolved ? "해결 표시 취소" : "✓ 해결됨으로 표시"}
                </button>
                {isMine && (
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditing(true)}>
                    수정
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  disabled={busy}
                  onClick={handleDelete}
                >
                  삭제
                </button>
              </div>
            )}
          </header>
          <ErrorMessage message={actionError} />
          {/* 질문 내용은 일반 텍스트로만 표시하고, 줄바꿈은 CSS로 유지합니다. */}
          <div className="post-body">{question.body}</div>
        </>
      )}

      <CommentSection
        parent="questions"
        parentId={question.id}
        title="답변"
        placeholderLabel="답변 남기기"
        submitLabel="답변 등록"
        canDeleteAll={isMine}
      />
    </article>
  );
}
