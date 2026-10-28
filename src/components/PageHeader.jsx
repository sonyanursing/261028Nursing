// 이 파일이 하는 일: 목록·관리자 화면 맨 위의 제목 영역(작은 영문 표시 + 제목 + 설명)을 만듭니다.
export default function PageHeader({ eyebrow, title, description, children }) {
  return (
    <header className="page-header">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p className="page-desc">{description}</p>}
      </div>
      {children && <div className="page-header-actions">{children}</div>}
    </header>
  );
}
