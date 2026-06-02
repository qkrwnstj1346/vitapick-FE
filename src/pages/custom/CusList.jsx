import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiCall, getSessionData } from "../../service/apiService";
import "./cusList.css";

export default function CusList() {
  const navigate = useNavigate();

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userNum = getSessionData("userNum");
    if (!userNum) {
      alert("로그인이 필요합니다.");
      navigate("/v1/auth/login");
      return;
    }

    apiCall.get(`/v1/cus/list/${userNum}`)
      .then((data) => {
        // 최신순 정렬
        const sorted = [...(data || [])].sort(
          (a, b) => new Date(b.crtAt) - new Date(a.crtAt)
        );
        setList(sorted);
      })
      .catch((err) => {
        console.error("추천 목록 조회 실패", err);
        setError("목록을 불러오지 못했습니다.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  function formatDate(dateStr) {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  if (loading) {
    return (
      <div className="cusl-loading-wrap">
        <div className="cusl-loading-spinner" />
        <p className="cusl-loading-text">추천 목록을 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cusl-error-wrap">
        <p className="cusl-error-text">{error}</p>
        <button className="cusl-btn cusl-btn--back" onClick={() => navigate(-1)}>
          ← 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="cusl-wrap">
      {/* ── 헤더 ── */}
      <div className="cusl-header">
        <h1 className="cusl-header__title">📋 내 추천 목록</h1>
        <p className="cusl-header__sub">
          지금까지 받은 AI 맞춤 추천 내역이에요.
        </p>
      </div>

      {/* ── 목록 없음 ── */}
      {list.length === 0 ? (
        <div className="cusl-empty">
          <div className="cusl-empty__icon">🌱</div>
          <p className="cusl-empty__title">아직 추천 내역이 없어요</p>
          <p className="cusl-empty__sub">
            AI 설문을 통해 나에게 맞는 영양제를 찾아보세요!
          </p>
          <button
            className="cusl-btn cusl-btn--survey"
            onClick={() => navigate("/v1/sur/save")}
          >
            🌿 AI 설문 시작하기
          </button>
        </div>
      ) : (
        <>
          <div className="cusl-count">총 {list.length}건의 추천 내역</div>

          <div className="cusl-list">
            {list.map((item, idx) => (
              <div
                key={item.cusId}
                className="cusl-card"
                onClick={() => navigate(`/cus/result/${item.cusId}`)}
              >
                <div className="cusl-card__left">
                  <div className="cusl-card__num">{idx + 1}</div>
                </div>
                <div className="cusl-card__body">
                  <p className="cusl-card__sum">{item.cusSum || "AI 맞춤 추천"}</p>
                  <p className="cusl-card__date">{formatDate(item.crtAt)}</p>
                </div>
                <div className="cusl-card__arrow">›</div>
              </div>
            ))}
          </div>

          {/* ── 하단 버튼 ── */}
          <div className="cusl-actions">
            <button
              className="cusl-btn cusl-btn--survey"
              onClick={() => navigate("/v1/sur/save")}
            >
              🌿 새 설문 받기
            </button>
          </div>
        </>
      )}
    </div>
  );
}