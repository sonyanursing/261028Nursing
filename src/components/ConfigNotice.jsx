// 이 파일이 하는 일: Firebase 환경변수가 아직 없을 때 "연동 후 사용 가능" 안내를 보여 줍니다.
export default function ConfigNotice() {
  return (
    <section className="notice notice-info" aria-live="polite">
      <h1>준비 중입니다</h1>
      <p>Firebase 연동 후 사용할 수 있습니다.</p>
      <p className="muted small">
        관리자 안내: README.md의 「Firebase 연동하기」 순서대로 설정한 뒤 다시 배포하면 이 화면이 자동으로
        사라집니다.
      </p>
    </section>
  );
}
