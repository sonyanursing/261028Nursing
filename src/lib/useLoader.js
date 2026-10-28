// 이 파일이 하는 일: Firestore에서 데이터를 불러올 때 필요한 "로딩 중 / 오류 / 결과"를 한 번에 관리하는 도우미입니다.
// 사용법: const { data, loading, error, reload } = useLoader(() => listPosts(), [의존값]);
import { useCallback, useEffect, useState } from "react";
import { toKoreanError } from "../services/errors.js";

export function useLoader(load, deps) {
  const [result, setResult] = useState({ depsKey: null, data: null, error: "" });
  const [version, setVersion] = useState(0);
  // 의존값(예: 자료 id)이 바뀌거나 reload()를 부르면 다시 불러옵니다.
  const depsKey = JSON.stringify(deps);
  const key = depsKey + "#" + version;

  useEffect(() => {
    let ignore = false; // 화면을 떠난 뒤 늦게 도착한 결과는 무시
    load().then(
      (data) => !ignore && setResult({ depsKey, data, error: "" }),
      (err) => !ignore && setResult({ depsKey, data: null, error: toKoreanError(err) }),
    );
    return () => {
      ignore = true;
    };
    // load 함수는 매번 새로 만들어지므로 key가 바뀔 때만 다시 실행합니다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);

  // 의존값이 바뀐 뒤 아직 새 결과가 없으면 "로딩 중"입니다.
  // (reload() 때는 새 결과가 올 때까지 기존 목록을 계속 보여 줍니다.)
  const loading = result.depsKey !== depsKey;
  return {
    data: loading ? null : result.data,
    error: loading ? "" : result.error,
    loading,
    reload,
  };
}
