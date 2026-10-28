// 이 파일이 하는 일: 로그인·승인 대기·안내 화면처럼 가운데에 놓이는 안내 상자를 만듭니다.
export default function Panel({ icon, tone = "default", title, children }) {
  return (
    <section className={`panel-center tone-${tone}`}>
      {icon && <div className="panel-icon">{icon}</div>}
      <h1>{title}</h1>
      {children}
    </section>
  );
}
