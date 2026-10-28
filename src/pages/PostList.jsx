// 이 파일이 하는 일: 연구 자료(/research) 또는 수업 자료(/courses) 목록을 카드로 보여 줍니다.
import { listPosts } from "../services/posts.js";
import { useLoader } from "../lib/useLoader.js";
import { typeLabels } from "../lib/format.js";
import PageHeader from "../components/PageHeader.jsx";
import PostCard from "../components/PostCard.jsx";
import { ErrorMessage, Loading } from "../components/Status.jsx";

const headers = {
  research: { eyebrow: "Research", description: "연구실의 연구 진행 자료, 문헌, 방법론 자료를 모았습니다." },
  course: { eyebrow: "Courses", description: "강의 슬라이드, 읽기 자료, 과제 안내를 모았습니다." },
};

export default function PostList({ type }) {
  const { data, loading, error } = useLoader(() => listPosts(), [type]);
  // 분류(type) 필터링은 여기(화면)에서 합니다. (복합 색인이 필요 없도록)
  const posts = (data || []).filter((p) => p.type === type);

  return (
    <section>
      <PageHeader
        eyebrow={headers[type].eyebrow}
        title={typeLabels[type]}
        description={headers[type].description}
      >
        {!loading && !error && <span className="count-pill">총 {posts.length}건</span>}
      </PageHeader>
      {loading && <Loading />}
      <ErrorMessage message={error} />
      {!loading && !error && posts.length === 0 && (
        <p className="empty-state">아직 등록된 자료가 없습니다.</p>
      )}
      {posts.length > 0 && (
        <ul className="post-grid">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </ul>
      )}
    </section>
  );
}
