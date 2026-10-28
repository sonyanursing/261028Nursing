// 이 파일이 하는 일: 관리자(교수) 전용 화면입니다. 회원 관리와 자료 관리를 한곳에 모았습니다.
import UserManager from "../components/UserManager.jsx";
import PostManager from "../components/PostManager.jsx";
import PageHeader from "../components/PageHeader.jsx";

export default function Admin() {
  return (
    <>
      <PageHeader
        eyebrow="Administration"
        title="관리자 페이지"
        description="구성원 가입 승인과 연구·수업 자료 관리를 이곳에서 합니다."
      />
      <UserManager />
      <PostManager />
    </>
  );
}
