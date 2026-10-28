// 이 파일이 하는 일: 자료 목록에서 자료 하나를 카드 모양(제목·요약·태그·작성일)으로 보여 줍니다.
import { Link } from "react-router-dom";
import { formatDate } from "../lib/format.js";
import { ArrowRight } from "./Icons.jsx";

export default function PostCard({ post }) {
  return (
    <li className="post-card">
      <p className="post-card-date">
        <time>{formatDate(post.createdAt)}</time>
      </p>
      <h2 className="post-card-title">
        {/* 링크가 카드 전체를 덮도록 CSS로 넓혀 두었습니다(카드 어디를 눌러도 이동). */}
        <Link to={`/posts/${post.id}`} className="stretched-link">
          {post.title}
        </Link>
      </h2>
      {post.summary && <p className="post-card-summary">{post.summary}</p>}
      <TagList tags={post.tags} />
      <span className="post-card-more" aria-hidden="true">
        자세히 보기 <ArrowRight />
      </span>
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
