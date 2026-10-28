// 이 파일이 하는 일: 없는 주소로 들어왔을 때 보여 주는 404 화면입니다.
import { Link } from "react-router-dom";
import Panel from "../components/Panel.jsx";
import { Compass } from "../components/Icons.jsx";

export default function NotFound() {
  return (
    <Panel icon={<Compass />} title="페이지를 찾을 수 없습니다">
      <p className="panel-code">404</p>
      <p className="panel-lead">주소가 바뀌었거나 삭제된 페이지입니다.</p>
      <Link to="/" className="btn btn-primary">
        홈으로 가기
      </Link>
    </Panel>
  );
}
