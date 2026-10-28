// 이 파일이 하는 일: (관리자) 자료 목록을 보여 주고 작성·수정·삭제를 처리합니다.
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { createPost, deletePost, listPosts, updatePost } from "../services/posts.js";
import { toKoreanError } from "../services/errors.js";
import { formatDate, typeLabels } from "../lib/format.js";
import { useLoader } from "../lib/useLoader.js";
import PostForm from "./PostForm.jsx";
import { ErrorMessage, Loading } from "./Status.jsx";

export default function PostManager() {
  const { user } = useAuth();
  const { data, loading, error: loadError, reload } = useLoader(() => listPosts(), []);
  const posts = data || [];
  const [error, setError] = useState("");
  // editing: null(폼 닫힘) / "new"(새 자료) / 자료 객체(수정 중)
  const [editing, setEditing] = useState(null);

  // 저장에 성공하면 빈 문자열, 실패하면 오류 문장을 돌려줍니다(폼에 표시).
  async function handleSave(form) {
    try {
      if (editing === "new") await createPost(form, user.uid);
      else await updatePost(editing.id, form);
      setEditing(null);
      reload();
      return "";
    } catch (err) {
      return toKoreanError(err);
    }
  }

  async function handleDelete(post) {
    if (!window.confirm(`"${post.title}" 자료와 딸린 댓글을 모두 삭제할까요? 되돌릴 수 없습니다.`)) return;
    setError("");
    try {
      await deletePost(post.id);
      reload();
    } catch (err) {
      setError(toKoreanError(err));
    }
  }

  return (
    <section className="section" aria-labelledby="posts-title">
      <div className="form-row">
        <h2 id="posts-title">자료 관리</h2>
        {!editing && (
          <button type="button" className="btn btn-primary" onClick={() => setEditing("new")}>
            + 새 자료 작성
          </button>
        )}
      </div>

      {editing && (
        <PostForm
          key={editing === "new" ? "new" : editing.id}
          post={editing === "new" ? null : editing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}

      <ErrorMessage message={loadError || error} />
      {loading ? (
        <Loading />
      ) : posts.length === 0 ? (
        <p className="muted">아직 등록된 자료가 없습니다.</p>
      ) : (
        <ul className="user-list">
          {posts.map((post) => (
            <li key={post.id} className="user-row">
              <div>
                <span className="role-badge">{typeLabels[post.type]}</span>{" "}
                <Link to={`/posts/${post.id}`}>{post.title}</Link>
                <div className="muted small">작성일 {formatDate(post.createdAt)}</div>
              </div>
              <div className="button-row">
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditing(post)}>
                  수정
                </button>
                <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete(post)}>
                  삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
