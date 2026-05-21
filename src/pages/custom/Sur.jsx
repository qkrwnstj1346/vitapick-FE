import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiCall, getLocalData, getToken } from "../../service/apiService";
import "./sur.css";

// ─── 상수 ────────────────────────────────────────────────────────────────────

const TOTAL_STEPS = 3;

// STEP 1 선택지
const GENDER_OPTIONS = [
  { label: "남성", value: "male" },
  { label: "여성", value: "female" },
  { label: "기타", value: "other" },
];

const AGE_GROUP_OPTIONS = [
  { label: "10대", value: "10s" },
  { label: "20대", value: "20s" },
  { label: "30대", value: "30s" },
  { label: "40대", value: "40s" },
  { label: "50대", value: "50s" },
  { label: "60대 이상", value: "60s_plus" },
];

const ACTIVITY_OPTIONS = [
  { label: "거의 없음", value: "none" },
  { label: "가벼운 활동", value: "light" },
  { label: "보통", value: "moderate" },
  { label: "활발한 편", value: "active" },
];

// STEP 2 선택지
const HEALTH_STATUS_OPTIONS = [
  { label: "만성피로·무기력", value: "fatigue" },
  { label: "수면장애", value: "sleep_disorder" },
  { label: "임신중·수유중", value: "pregnant_nursing" },
  { label: "임신 준비중", value: "preparing_pregnancy" },
  { label: "소화불량·위장장애", value: "digestive" },
  { label: "관절통·근육통", value: "joint_muscle" },
];

const DISEASE_OPTIONS = [
  { label: "고혈압·심혈관질환", value: "hypertension" },
  { label: "당뇨·혈당이상", value: "diabetes" },
  { label: "고지혈증", value: "hyperlipidemia" },
  { label: "갑상선질환", value: "thyroid" },
  { label: "위장질환(위염 등)", value: "gastric" },
  { label: "없음", value: "none" },
];

const MEDICATION_OPTIONS = [
  { label: "혈압약·심장약", value: "antihypertensive" },
  { label: "당뇨약·인슐린", value: "diabetes_med" },
  { label: "혈액희석제", value: "anticoagulant" },
  { label: "갑상선약", value: "thyroid_med" },
  { label: "피임약", value: "contraceptive" },
  { label: "없음", value: "none" },
];

const SUPPLEMENT_OPTIONS = [
  { label: "종합비타민", value: "multivitamin" },
  { label: "비타민C·D·B군", value: "vitamin_b" },
  { label: "오메가3", value: "omega3" },
  { label: "마그네슘·칼슘", value: "magnesium" },
  { label: "유산균", value: "probiotics" },
  { label: "없음", value: "none" },
];

const ALLERGY_OPTIONS = [
  { label: "갑각류", value: "shellfish" },
  { label: "유제품", value: "dairy" },
  { label: "대두·콩류", value: "soy" },
  { label: "글루텐(밀)", value: "gluten" },
  { label: "견과류", value: "nuts" },
  { label: "없음", value: "none" },
];

// STEP 3 선택지
const DESIRED_EFFECT_OPTIONS = [
  { label: "피로회복·에너지", value: "energy" },
  { label: "면역력 강화", value: "immunity" },
  { label: "수면 개선", value: "sleep" },
  { label: "다이어트·체중관리", value: "diet" },
  { label: "피부·모발 개선", value: "skin" },
  { label: "뼈·관절 건강", value: "bone_joint" },
];

const INTERESTED_SUPPLEMENT_OPTIONS = [
  { label: "종합비타민", value: "multivitamin" },
  { label: "오메가3", value: "omega3" },
  { label: "유산균", value: "probiotics" },
  { label: "마그네슘·칼슘", value: "magnesium" },
  { label: "콜라겐", value: "collagen" },
  { label: "없음·잘 모름", value: "none" },
];

// ─── 초기 상태 ────────────────────────────────────────────────────────────────

const initialAnswers = {
  basicInfo: {
    gender: "",
    ageGroup: "",
    height: "",
    weight: "",
    activityLevel: "",
  },
  healthConditions: {
    currentStatus: [],
    currentStatusEtc: "",
    diseases: [],
    diseasesEtc: "",
    medications: [],
    medicationsEtc: "",
    currentSupplements: [],
    currentSupplementsEtc: "",
    allergies: [],
    allergiesEtc: "",
  },
  requirements: {
    desiredEffects: [],
    desiredEffectsEtc: "",
    interestedSupplements: [],
    interestedSupplementsEtc: "",
  },
};

// ─── 유틸 ────────────────────────────────────────────────────────────────────

function calcBMI(height, weight) {
  const h = parseFloat(height);
  const w = parseFloat(weight);
  if (!h || !w || h <= 0) return null;
  return (w / ((h / 100) * (h / 100))).toFixed(1);
}

function toggleMulti(arr, value) {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

// ─── 서브 컴포넌트 ────────────────────────────────────────────────────────────

/** 진행 바 */
function ProgressBar({ step }) {
  return (
    <div className="sur-progress">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => {
        const num = i + 1;
        const isDone = num < step;
        const isCurrent = num === step;
        return (
          <div key={num} className="sur-progress__item">
            <div
              className={`sur-progress__circle ${isDone ? "done" : ""} ${
                isCurrent ? "current" : ""
              }`}
            >
              {isDone ? "✓" : num}
            </div>
            <span className="sur-progress__label">
              {num === 1 ? "기본정보" : num === 2 ? "건강특이사항" : "요구사항"}
            </span>
            {num < TOTAL_STEPS && (
              <div className={`sur-progress__line ${isDone ? "done" : ""}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/** 라디오 단일 선택 그룹 */
function RadioGroup({ options, value, onChange }) {
  return (
    <div className="sur-radio-group">
      {options.map((opt) => (
        <label
          key={opt.value}
          className={`sur-radio-btn ${value === opt.value ? "selected" : ""}`}
        >
          <input
            type="radio"
            name={opt.value}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}

/** 멀티 체크 그룹 + 기타 입력 */
function MultiCheck({ options, selected, etcValue, onChange, onEtcChange }) {
  return (
    <div className="sur-multi-group">
      {options.map((opt) => (
        <label
          key={opt.value}
          className={`sur-check-btn ${
            selected.includes(opt.value) ? "selected" : ""
          }`}
        >
          <input
            type="checkbox"
            value={opt.value}
            checked={selected.includes(opt.value)}
            onChange={() => onChange(opt.value)}
          />
          {opt.label}
        </label>
      ))}
      <label
        className={`sur-check-btn ${etcValue !== undefined && etcValue !== "" ? "selected" : ""}`}
      >
        <input
          type="checkbox"
          checked={etcValue !== undefined && etcValue !== ""}
          onChange={(e) => {
            if (!e.target.checked) onEtcChange("");
          }}
        />
        기타
      </label>
      {etcValue !== undefined && (
        <input
          className="sur-etc-input"
          type="text"
          placeholder="기타 내용을 입력해 주세요"
          value={etcValue}
          onChange={(e) => onEtcChange(e.target.value)}
        />
      )}
    </div>
  );
}

// ─── 메인 컴포넌트 ────────────────────────────────────────────────────────────

export default function Sur() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState(initialAnswers);
  const [surTitle, setSurTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // ── 상태 업데이트 헬퍼 ──────────────────────────────────────────────────────

  const setBasic = (key, value) => {
    setAnswers((prev) => ({
      ...prev,
      basicInfo: { ...prev.basicInfo, [key]: value },
    }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const setHealth = (key, value) => {
    setAnswers((prev) => ({
      ...prev,
      healthConditions: { ...prev.healthConditions, [key]: value },
    }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const toggleHealth = (key, value) => {
    setAnswers((prev) => ({
      ...prev,
      healthConditions: {
        ...prev.healthConditions,
        [key]: toggleMulti(prev.healthConditions[key], value),
      },
    }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const setReq = (key, value) => {
    setAnswers((prev) => ({
      ...prev,
      requirements: { ...prev.requirements, [key]: value },
    }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const toggleReq = (key, value) => {
    setAnswers((prev) => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        [key]: toggleMulti(prev.requirements[key], value),
      },
    }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  // ── 유효성 검사 ─────────────────────────────────────────────────────────────

  function validateStep(currentStep) {
    const newErrors = {};
    if (currentStep === 1) {
      const b = answers.basicInfo;
      if (!b.gender) newErrors.gender = "성별을 선택해 주세요.";
      if (!b.ageGroup) newErrors.ageGroup = "나이대를 선택해 주세요.";
      if (!b.height) newErrors.height = "키를 입력해 주세요.";
      else if (isNaN(b.height) || b.height <= 0)
        newErrors.height = "올바른 키를 입력해 주세요.";
      if (!b.weight) newErrors.weight = "몸무게를 입력해 주세요.";
      else if (isNaN(b.weight) || b.weight <= 0)
        newErrors.weight = "올바른 몸무게를 입력해 주세요.";
      if (!b.activityLevel) newErrors.activityLevel = "활동량을 선택해 주세요.";
    }
    if (currentStep === 2) {
      const h = answers.healthConditions;
      if (h.currentStatus.length === 0 && !h.currentStatusEtc)
        newErrors.currentStatus = "현재 건강상태를 하나 이상 선택해 주세요.";
      if (h.diseases.length === 0 && !h.diseasesEtc)
        newErrors.diseases = "지병을 하나 이상 선택해 주세요.";
      if (h.medications.length === 0 && !h.medicationsEtc)
        newErrors.medications = "복용 중인 약을 하나 이상 선택해 주세요.";
      if (h.currentSupplements.length === 0 && !h.currentSupplementsEtc)
        newErrors.currentSupplements =
          "복용 중인 영양제를 하나 이상 선택해 주세요.";
      if (h.allergies.length === 0 && !h.allergiesEtc)
        newErrors.allergies = "알러지를 하나 이상 선택해 주세요.";
    }
    if (currentStep === 3) {
      const r = answers.requirements;
      if (r.desiredEffects.length === 0 && !r.desiredEffectsEtc)
        newErrors.desiredEffects = "원하는 효과를 하나 이상 선택해 주세요.";
      if (r.interestedSupplements.length === 0 && !r.interestedSupplementsEtc)
        newErrors.interestedSupplements =
          "관심 영양제를 하나 이상 선택해 주세요.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // ── 네비게이션 ──────────────────────────────────────────────────────────────

  function handleNext() {
    if (!validateStep(step)) return;
    setStep((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handlePrev() {
    setStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ── 제출 ────────────────────────────────────────────────────────────────────

  async function handleSubmit() {
    if (!validateStep(3)) return;

    const userInfo = getLocalData("userinfo");
    const userNum = userInfo?.userNum;
    if (!userNum) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    // ansJson 에 BMI 포함
    const bmi = calcBMI(answers.basicInfo.height, answers.basicInfo.weight);
    const answerPayload = {
      ...answers,
      basicInfo: { ...answers.basicInfo, bmi: bmi ? parseFloat(bmi) : null },
    };

    const surDTO = {
      userNum,
      surTitle: surTitle.trim() || null, // null이면 백엔드에서 날짜로 생성
      ansJson: JSON.stringify(answerPayload),
    };

    try {
      setLoading(true);
      const token = getToken();
      const result = await apiCall("/v1/sur/save", "POST", surDTO, token);
      alert("설문이 저장되었습니다! AI 맞춤 추천을 확인해 보세요 🌿");
      navigate(`/sur/result/${result.surId}`);
    } catch (err) {
      console.error("설문 저장 실패", err);
      alert("설문 저장에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  }

  // ── BMI 표시 ────────────────────────────────────────────────────────────────

  const bmi = calcBMI(answers.basicInfo.height, answers.basicInfo.weight);
  const bmiLabel = (() => {
    if (!bmi) return null;
    const b = parseFloat(bmi);
    if (b < 18.5) return "저체중";
    if (b < 23) return "정상";
    if (b < 25) return "과체중";
    return "비만";
  })();

  // ── 렌더 ────────────────────────────────────────────────────────────────────

  return (
    <div className="sur-wrap">
      {/* 상단 타이틀 */}
      <div className="sur-header">
        <h1 className="sur-header__title">🌿 맞춤 영양제 추천 설문</h1>
        <p className="sur-header__sub">
          간단한 설문을 통해 나에게 딱 맞는 영양제를 추천해 드릴게요.
        </p>
      </div>

      {/* 진행 바 */}
      <ProgressBar step={step} />

      {/* 설문 카드 */}
      <div className="sur-card">
        {/* ══ STEP 1 : 기본정보 ══════════════════════════════════════════════ */}
        {step === 1 && (
          <section className="sur-section">
            <h2 className="sur-section__title">STEP 1 · 기본정보</h2>

            {/* 성별 */}
            <div className="sur-field">
              <label className="sur-label">
                성별 <span className="sur-required">*</span>
              </label>
              <RadioGroup
                options={GENDER_OPTIONS}
                value={answers.basicInfo.gender}
                onChange={(v) => setBasic("gender", v)}
              />
              {errors.gender && (
                <p className="sur-error">{errors.gender}</p>
              )}
            </div>

            {/* 나이대 */}
            <div className="sur-field">
              <label className="sur-label">
                나이대 <span className="sur-required">*</span>
              </label>
              <select
                className="sur-select"
                value={answers.basicInfo.ageGroup}
                onChange={(e) => setBasic("ageGroup", e.target.value)}
              >
                <option value="">선택해 주세요</option>
                {AGE_GROUP_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              {errors.ageGroup && (
                <p className="sur-error">{errors.ageGroup}</p>
              )}
            </div>

            {/* 키 / 몸무게 */}
            <div className="sur-field sur-field--row">
              <div className="sur-field__half">
                <label className="sur-label">
                  키 (cm) <span className="sur-required">*</span>
                </label>
                <input
                  className="sur-input"
                  type="number"
                  placeholder="예) 170"
                  value={answers.basicInfo.height}
                  onChange={(e) => setBasic("height", e.target.value)}
                />
                {errors.height && (
                  <p className="sur-error">{errors.height}</p>
                )}
              </div>
              <div className="sur-field__half">
                <label className="sur-label">
                  몸무게 (kg) <span className="sur-required">*</span>
                </label>
                <input
                  className="sur-input"
                  type="number"
                  placeholder="예) 65"
                  value={answers.basicInfo.weight}
                  onChange={(e) => setBasic("weight", e.target.value)}
                />
                {errors.weight && (
                  <p className="sur-error">{errors.weight}</p>
                )}
              </div>
            </div>

            {/* BMI 자동계산 */}
            {bmi && (
              <div className="sur-bmi">
                <span className="sur-bmi__value">BMI {bmi}</span>
                <span className="sur-bmi__label">{bmiLabel}</span>
              </div>
            )}

            {/* 활동량 */}
            <div className="sur-field">
              <label className="sur-label">
                활동량 <span className="sur-required">*</span>
              </label>
              <RadioGroup
                options={ACTIVITY_OPTIONS}
                value={answers.basicInfo.activityLevel}
                onChange={(v) => setBasic("activityLevel", v)}
              />
              {errors.activityLevel && (
                <p className="sur-error">{errors.activityLevel}</p>
              )}
            </div>
          </section>
        )}

        {/* ══ STEP 2 : 건강특이사항 ══════════════════════════════════════════ */}
        {step === 2 && (
          <section className="sur-section">
            <h2 className="sur-section__title">STEP 2 · 건강특이사항</h2>

            {/* 현재 건강상태 */}
            <div className="sur-field">
              <label className="sur-label">
                현재 건강상태 <span className="sur-required">*</span>
              </label>
              <p className="sur-hint">해당하는 항목을 모두 선택해 주세요.</p>
              <MultiCheck
                options={HEALTH_STATUS_OPTIONS}
                selected={answers.healthConditions.currentStatus}
                etcValue={answers.healthConditions.currentStatusEtc}
                onChange={(v) => toggleHealth("currentStatus", v)}
                onEtcChange={(v) => setHealth("currentStatusEtc", v)}
              />
              {errors.currentStatus && (
                <p className="sur-error">{errors.currentStatus}</p>
              )}
            </div>

            {/* 지병 */}
            <div className="sur-field">
              <label className="sur-label">
                지병 <span className="sur-required">*</span>
              </label>
              <p className="sur-hint">해당하는 항목을 모두 선택해 주세요.</p>
              <MultiCheck
                options={DISEASE_OPTIONS}
                selected={answers.healthConditions.diseases}
                etcValue={answers.healthConditions.diseasesEtc}
                onChange={(v) => toggleHealth("diseases", v)}
                onEtcChange={(v) => setHealth("diseasesEtc", v)}
              />
              {errors.diseases && (
                <p className="sur-error">{errors.diseases}</p>
              )}
            </div>

            {/* 복용 중인 약 */}
            <div className="sur-field">
              <label className="sur-label">
                복용 중인 약 <span className="sur-required">*</span>
              </label>
              <p className="sur-hint">
                복용 중인 약이 있으면 선택해 주세요. AI 상호작용 판단에
                활용됩니다.
              </p>
              <MultiCheck
                options={MEDICATION_OPTIONS}
                selected={answers.healthConditions.medications}
                etcValue={answers.healthConditions.medicationsEtc}
                onChange={(v) => toggleHealth("medications", v)}
                onEtcChange={(v) => setHealth("medicationsEtc", v)}
              />
              {errors.medications && (
                <p className="sur-error">{errors.medications}</p>
              )}
            </div>

            {/* 복용 중인 영양제 */}
            <div className="sur-field">
              <label className="sur-label">
                현재 복용 중인 영양제 <span className="sur-required">*</span>
              </label>
              <p className="sur-hint">중복 추천 방지에 활용됩니다.</p>
              <MultiCheck
                options={SUPPLEMENT_OPTIONS}
                selected={answers.healthConditions.currentSupplements}
                etcValue={answers.healthConditions.currentSupplementsEtc}
                onChange={(v) => toggleHealth("currentSupplements", v)}
                onEtcChange={(v) => setHealth("currentSupplementsEtc", v)}
              />
              {errors.currentSupplements && (
                <p className="sur-error">{errors.currentSupplements}</p>
              )}
            </div>

            {/* 알러지 */}
            <div className="sur-field">
              <label className="sur-label">
                알러지 <span className="sur-required">*</span>
              </label>
              <MultiCheck
                options={ALLERGY_OPTIONS}
                selected={answers.healthConditions.allergies}
                etcValue={answers.healthConditions.allergiesEtc}
                onChange={(v) => toggleHealth("allergies", v)}
                onEtcChange={(v) => setHealth("allergiesEtc", v)}
              />
              {errors.allergies && (
                <p className="sur-error">{errors.allergies}</p>
              )}
            </div>
          </section>
        )}

        {/* ══ STEP 3 : 요구사항 ══════════════════════════════════════════════ */}
        {step === 3 && (
          <section className="sur-section">
            <h2 className="sur-section__title">STEP 3 · 요구사항</h2>

            {/* 원하는 효과 */}
            <div className="sur-field">
              <label className="sur-label">
                원하는 효과 <span className="sur-required">*</span>
              </label>
              <p className="sur-hint">원하는 효과를 모두 선택해 주세요.</p>
              <MultiCheck
                options={DESIRED_EFFECT_OPTIONS}
                selected={answers.requirements.desiredEffects}
                etcValue={answers.requirements.desiredEffectsEtc}
                onChange={(v) => toggleReq("desiredEffects", v)}
                onEtcChange={(v) => setReq("desiredEffectsEtc", v)}
              />
              {errors.desiredEffects && (
                <p className="sur-error">{errors.desiredEffects}</p>
              )}
            </div>

            {/* 관심 영양제 군 */}
            <div className="sur-field">
              <label className="sur-label">
                관심 영양제 군 <span className="sur-required">*</span>
              </label>
              <p className="sur-hint">관심 있는 영양제를 모두 선택해 주세요.</p>
              <MultiCheck
                options={INTERESTED_SUPPLEMENT_OPTIONS}
                selected={answers.requirements.interestedSupplements}
                etcValue={answers.requirements.interestedSupplementsEtc}
                onChange={(v) => toggleReq("interestedSupplements", v)}
                onEtcChange={(v) => setReq("interestedSupplementsEtc", v)}
              />
              {errors.interestedSupplements && (
                <p className="sur-error">{errors.interestedSupplements}</p>
              )}
            </div>

            {/* 설문 제목 (선택) */}
            <div className="sur-field">
              <label className="sur-label">설문 제목 (선택)</label>
              <p className="sur-hint">
                비워두면 저장 날짜가 제목이 됩니다.
              </p>
              <input
                className="sur-input"
                type="text"
                placeholder="예) 봄 환절기 건강관리"
                value={surTitle}
                onChange={(e) => setSurTitle(e.target.value)}
                maxLength={50}
              />
            </div>
          </section>
        )}

        {/* ── 버튼 영역 ─────────────────────────────────────────────────────── */}
        <div className="sur-actions">
          {step > 1 && (
            <button className="sur-btn sur-btn--prev" onClick={handlePrev}>
              ← 이전
            </button>
          )}
          {step < TOTAL_STEPS && (
            <button className="sur-btn sur-btn--next" onClick={handleNext}>
              다음 →
            </button>
          )}
          {step === TOTAL_STEPS && (
            <button
              className="sur-btn sur-btn--submit"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "저장 중..." : "🌿 추천 받기"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}