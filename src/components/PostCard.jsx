// 이 파일이 하는 일: 자료 목록에서 자료 하나를 카드 모양(제목·요약·태그·작성일)으로 보여 줍니다.
import { Link } from "react-router-dom";
import { formatDate } from "../lib/format.js";

export default function PostCard({ post }) {
  return (
    <li className="card post-card">
      <h2 className="post-card-title">
        <Link to={`/posts/${post.id}`}>{post.title}</Link>
      </h2>
      {post.summary && <p>{post.summary}</p>}
      <TagList tags={post.tags} />
      <p className="muted small">
        작성일 <time>{formatDate(post.createdAt)}</time>
      </p>
    </li>
  );
}

export function TagList({ tags }) {
  if (!tags || tags.length === 0) return null;
  return (
    <ul className="tag-list" aria-label="태그">
      {tags.map((tag) => (
        <li key={tag} className="tag">
          #{tag}
        </li>
      ))}
    </ul>
  );
}
