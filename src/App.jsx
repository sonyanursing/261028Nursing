// 이 파일이 하는 일: 주소(URL)별로 어떤 화면을 보여 줄지 정합니다(라우팅).
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import PostList from "./pages/PostList.jsx";
import PostDetail from "./pages/PostDetail.jsx";
import QuestionList from "./pages/QuestionList.jsx";
import QuestionDetail from "./pages/QuestionDetail.jsx";
import Login from "./pages/Login.jsx";
import Pending from "./pages/Pending.jsx";
import Admin from "./pages/Admin.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="pending" element={<Pending />} />

        {/* 회원(승인된 대학원생)과 관리자만 볼 수 있는 화면 */}
        <Route element={<ProtectedRoute require="member" />}>
          <Route path="research" element={<PostList type="research" />} />
          <Route path="courses" element={<PostList type="course" />} />
          <Route path="posts/:id" element={<PostDetail />} />
          <Route path="questions" element={<QuestionList />} />
          <Route path="questions/:id" element={<QuestionDetail />} />
        </Route>

        {/* 관리자(교수)만 볼 수 있는 화면 */}
        <Route element={<ProtectedRoute require="admin" />}>
          <Route path="admin" element={<Admin />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
