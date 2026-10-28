// 이 파일이 하는 일: 날짜 표시, 링크 안전 검사처럼 여러 화면에서 쓰는 작은 도우미 함수 모음입니다.

// Firestore 시간 값을 "2026. 10. 28." 형태의 글자로 바꿉니다.
export function formatDate(timestamp) {
  if (!timestamp || typeof timestamp.toDate !== "function") return "방금 전";
  return timestamp.toDate().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

// http:// 또는 https:// 로 시작하는 링크만 안전한 링크로 인정합니다.
export function isSafeUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export const typeLabels = { research: "연구 자료", course: "수업 자료" };
