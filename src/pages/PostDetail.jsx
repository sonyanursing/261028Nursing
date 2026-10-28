// 이 파일이 하는 일: 자료 하나의 본문과 첨부 링크를 보여 주고, 아래에 토론(댓글) 영역을 붙입니다.
import { Link, useParams } from "react-router-dom";
import { getPost } from "../services/posts.js";
import { useLoader } from "../lib/useLoader.js";
import { formatDate, isSafeUrl, typeLabels } from "../lib/format.js";
import { TagList } from "../components/PostCard.jsx";
import CommentSection from "../components/CommentSection.jsx";
import { ErrorMessage, Loading } from "../components/Status.jsx";

export default function PostDetail() {
  const { id } = useParams();
  const { data: post, loading, error } = useLoader(() => getPost(id), [id]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!post) return <ErrorMessage message="요청한 자료를 찾을 수 없습니다." />;

  const backTo = post.type === "course" ? "/courses" : "/research";
  const links = (post.links || []).filter((link) => isSafeUrl(link.url));

  return (
    <article className="post-detail">
      <p>
        <Link to={backTo}>← {typeLabels[post.type]} 목록</Link>
      </p>
      <h1>{post.title}</h1>
      <p className="muted small">
        작성일 {formatDate(post.createdAt)}
        {post.updatedAt &&
          formatDate(post.updatedAt) !== formatDate(post.createdAt) &&
          ` · 수정일 ${formatDate(post.updatedAt)}`}
      </p>
      <TagList tags={post.tags} />
      {post.summary && <p className="lead">{post.summary}</p>}

      {/* 본문은 일반 텍스트로만 표시하고, 줄바꿈은 CSS(white-space: pre-wrap)로 유지합니다. */}
      <div className="post-body">{post.body}</div>

      {links.length > 0 && (
        <section className="section" aria-labelledby="links-title">
          <h2 id="links-title">첨부 링크</h2>
          <ul className="link-list">
            {links.map((link, i) => (
              <li key={i}>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.label || link.url}
                </a>
                <span className="visually-hidden"> (새 창에서 열림)</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <CommentSection postId={post.id} />
    </article>
  );
}
