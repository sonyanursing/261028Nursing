// 이 파일이 하는 일: 연구 자료(/research) 또는 수업 자료(/courses) 목록을 카드로 보여 줍니다.
import { listPosts } from "../services/posts.js";
import { useLoader } from "../lib/useLoader.js";
import { typeLabels } from "../lib/format.js";
import PostCard from "../components/PostCard.jsx";
import { ErrorMessage, Loading } from "../components/Status.jsx";

export default function PostList({ type }) {
  const { data, loading, error } = useLoader(() => listPosts(), [type]);
  // 분류(type) 필터링은 여기(화면)에서 합니다. (복합 색인이 필요 없도록)
  const posts = (data || []).filter((p) => p.type === type);

  return (
    <section>
      <h1>{typeLabels[type]}</h1>
      {loading && <Loading />}
      <ErrorMessage message={error} />
      {!loading && !error && posts.length === 0 && <p className="muted">아직 등록된 자료가 없습니다.</p>}
      {posts.length > 0 && (
        <ul className="card-grid">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </ul>
      )}
    </section>
  );
}
