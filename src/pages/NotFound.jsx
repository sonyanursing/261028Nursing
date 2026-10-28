// 이 파일이 하는 일: 없는 주소로 들어왔을 때 보여 주는 404 화면입니다.
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="notice">
      <h1>페이지를 찾을 수 없습니다 (404)</h1>
      <p>주소가 바뀌었거나 삭제된 페이지입니다.</p>
      <Link to="/" className="btn btn-primary">
        홈으로 가기
      </Link>
    </section>
  );
}
