// 이 파일이 하는 일: "불러오는 중…" 표시와 오류 메시지 상자를 여러 화면에서 같이 쓰도록 만든 작은 부품입니다.
export function Loading({ text = "불러오는 중…" }) {
  return (
    <p className="loading" role="status">
      <span className="spinner" aria-hidden="true" />
      {text}
    </p>
  );
}

export function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <p className="notice notice-error" role="alert">
      {message}
    </p>
  );
}
