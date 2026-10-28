// 이 파일이 하는 일: 질문 게시판 목록 화면(/questions)입니다. 질문 목록과 "질문하기" 폼을 보여 줍니다.
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { createQuestion, listQuestions } from "../services/questions.js";
import { toKoreanError } from "../services/errors.js";
import { useLoader } from "../lib/useLoader.js";
import { formatDate } from "../lib/format.js";
import PageHeader from "../components/PageHeader.jsx";
import QuestionForm from "../components/QuestionForm.jsx";
import { ErrorMessage, Loading } from "../components/Status.jsx";

const filters = [
  { key: "all", label: "전체" },
  { key: "open", label: "답변 대기" },
  { key: "resolved", label: "해결됨" },
];

export default function QuestionList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data, loading, error } = useLoader(() => listQuestions(), []);
  const [writing, setWriting] = useState(false);
  const [filter, setFilter] = useState("all");

  // 상태 필터링은 화면에서 합니다. (복합 색인이 필요 없도록)
  const all = data || [];
  const questions = all.filter((q) => filter === "all" || (filter === "resolved") === Boolean(q.resolved));

  async function handleSave(form) {
    try {
      const id = await createQuestion(form, user);
      navigate(`/questions/${id}`);
      return "";
    } catch (err) {
      return toKoreanError(err);
    }
  }

  return (
    <section>
      <PageHeader
        eyebrow="Q&A"
        title="질문 게시판"
        description="연구·수업에 관해 궁금한 점을 자유롭게 묻고 답하는 공간입니다."
      >
        {!writing && (
          <button type="button" className="btn btn-primary" onClick={() => setWriting(true)}>
            + 질문하기
          </button>
        )}
      </PageHeader>

      {writing && <QuestionForm onSave={handleSave} onCancel={() => setWriting(false)} />}

      <div className="filter-tabs" role="group" aria-label="질문 상태로 거르기">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            className={filter === f.key ? "filter-tab is-active" : "filter-tab"}
            aria-pressed={filter === f.key}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading && <Loading />}
      <ErrorMessage message={error} />
      {!loading && !error && questions.length === 0 && (
        <p className="empty-state">
          {all.length === 0 ? "아직 질문이 없습니다. 첫 질문을 올려 보세요." : "해당하는 질문이 없습니다."}
        </p>
      )}
      {questions.length > 0 && (
        <ul className="user-list question-list">
          {questions.map((q) => (
            <li key={q.id} className="user-row question-row">
              <div className="row-main">
                <span className={q.resolved ? "status-chip status-resolved" : "status-chip status-open"}>
                  {q.resolved ? "해결됨" : "답변 대기"}
                </span>
                <div>
                  <Link to={`/questions/${q.id}`} className="row-title stretched-link">
                    {q.title}
                  </Link>
                  <div className="muted small">
                    {q.authorName} · {formatDate(q.createdAt)}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
