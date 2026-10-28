// 이 파일이 하는 일: (관리자) 승인 대기 중인 사람과 회원 목록을 보여 주고 승인·거절·삭제를 처리합니다.
import { useState } from "react";
import { approveUser, listUsers, removeUser } from "../services/users.js";
import { toKoreanError } from "../services/errors.js";
import { formatDate } from "../lib/format.js";
import { useLoader } from "../lib/useLoader.js";
import { ErrorMessage, Loading } from "./Status.jsx";

export default function UserManager() {
  const { data, loading, error: loadError, reload } = useLoader(() => listUsers(), []);
  const users = data || [];
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");

  async function run(uid, action) {
    setBusyId(uid);
    setError("");
    try {
      await action();
      reload();
    } catch (err) {
      setError(toKoreanError(err));
    } finally {
      setBusyId("");
    }
  }

  function handleRemove(u, label) {
    if (window.confirm(`${u.displayName || u.email} 님을 ${label}할까요?`)) run(u.id, () => removeUser(u.id));
  }

  const pending = users.filter((u) => u.role !== "member");
  const members = users.filter((u) => u.role === "member");

  function renderRow(u, isPending) {
    const busy = busyId === u.id;
    return (
      <li key={u.id} className="user-row">
        <div className="row-main">
          {u.photoURL ? (
            <img className="avatar" src={u.photoURL} alt="" referrerPolicy="no-referrer" />
          ) : (
            <span className="avatar avatar-initial" aria-hidden="true">
              {(u.displayName || u.email || "?").slice(0, 1)}
            </span>
          )}
          <div>
            <strong>{u.displayName || "(이름 없음)"}</strong> <span className="muted small">{u.email}</span>
            <div className="muted small">가입 신청일 {formatDate(u.createdAt)}</div>
          </div>
        </div>
        <div className="button-row">
          {isPending && (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              disabled={busy}
              onClick={() => run(u.id, () => approveUser(u.id))}
            >
              승인
            </button>
          )}
          <button
            type="button"
            className="btn btn-danger btn-sm"
            disabled={busy}
            onClick={() => handleRemove(u, isPending ? "거절" : "삭제")}
          >
            {isPending ? "거절" : "삭제"}
          </button>
        </div>
      </li>
    );
  }

  return (
    <section className="admin-panel" aria-labelledby="users-title">
      <h2 id="users-title">회원 관리</h2>
      <ErrorMessage message={loadError || error} />
      {loading ? (
        <Loading />
      ) : (
        <>
          <h3 className="subhead">
            승인 대기 <span className="count-badge count-alert">{pending.length}</span>
          </h3>
          {pending.length === 0 ? (
            <p className="empty-state">승인 대기 중인 사람이 없습니다.</p>
          ) : (
            <ul className="user-list">{pending.map((u) => renderRow(u, true))}</ul>
          )}
          <h3 className="subhead">
            회원 <span className="count-badge">{members.length}</span>
          </h3>
          {members.length === 0 ? (
            <p className="empty-state">아직 승인된 회원이 없습니다.</p>
          ) : (
            <ul className="user-list">{members.map((u) => renderRow(u, false))}</ul>
          )}
        </>
      )}
    </section>
  );
}
