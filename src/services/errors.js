// 이 파일이 하는 일: Firebase 오류 코드를 사용자가 이해할 수 있는 한국어 문장으로 바꿉니다.

const messages = {
  "permission-denied": "접근 권한이 없습니다.",
  unauthenticated: "로그인이 필요합니다.",
  "not-found": "요청한 자료를 찾을 수 없습니다.",
  unavailable: "서버에 연결할 수 없습니다. 인터넷 연결을 확인한 뒤 다시 시도해 주세요.",
  "deadline-exceeded": "응답이 너무 늦습니다. 잠시 후 다시 시도해 주세요.",
  "resource-exhausted": "무료 사용량 한도를 넘었습니다. 내일 다시 시도해 주세요.",
  "invalid-argument": "입력값이 올바르지 않습니다.",
  "failed-precondition": "요청을 처리할 수 없는 상태입니다. 잠시 후 다시 시도해 주세요.",
  "auth/popup-closed-by-user": "로그인 창이 닫혔습니다. 다시 시도해 주세요.",
  "auth/cancelled-popup-request": "로그인 창이 닫혔습니다. 다시 시도해 주세요.",
  "auth/popup-blocked": "브라우저가 로그인 팝업을 막았습니다. 팝업 허용 후 다시 시도해 주세요.",
  "auth/unauthorized-domain":
    "이 주소는 Firebase의 '승인된 도메인'에 등록되어 있지 않습니다. README의 안내를 확인해 주세요.",
  "auth/network-request-failed": "네트워크 오류입니다. 인터넷 연결을 확인해 주세요.",
};

export function toKoreanError(error) {
  // 개발자 도구(콘솔)에는 원래 오류를 남겨 두어 문제를 찾기 쉽게 합니다.
  console.error(error);
  const code = (error && error.code) || "";
  // Firestore 오류 코드는 "firestore/permission-denied" 형태일 때도 있어 앞부분을 떼어 냅니다.
  const shortCode = code.startsWith("firestore/") ? code.slice("firestore/".length) : code;
  return (
    messages[shortCode] || messages[code] || "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
  );
}
