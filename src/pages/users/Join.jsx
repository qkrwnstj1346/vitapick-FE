import { useState } from "react";
import { useForm } from "react-hook-form";
import { apiCall } from "../../service/apiService"
import { useNavigate } from "react-router-dom";
 
// 유효성 검사 정규식 모음
const idRegex = /^[a-zA-Z0-9]{4,20}$/;
const pwdRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,20}$/; // 영문+숫자 8~20자
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const telRegex = /^[0-9]{10,11}$/;

// 안내 메시지 색상
const msgStyle = {
  red:   { color: "red"   },
  green: { color: "green" },
};

export default function JoinForm() {

  const navigate = useNavigate();

  // useForm 훅 설정
  const {
  register,
  handleSubmit,
  watch,
  setFocus,
  formState: {isSubmitting, errors},
  } = useForm({ mode: "onBlur", reValidateMode: "onBlur"}); // ✅ 포커스 아웃될 때마다 자동으로 유효성 검사
 
  // 아이디 관련 상태
  const [idCheckMsg, setIdCheckMsg] = useState(""); // 중복확인 결과 메시지
  const [idCheckOk, setIdCheckOk] = useState(false); // 중복확인 통과 여부
  const [idValid, setIdValid] = useState(false);     // 유효성 통과 여부
  const [idValidMsg, setIdValidMsg] = useState("");   // 유효성 메시지

  //아이디 인풋박스 포커스 아웃 시
  const handleIdBlur = (e) => {
    const value = e.target.value;
    if(!value){
      setIdValidMsg("아이디를 입력해주세요");
      setIdValid(false);
    }
    else if(!idRegex.test(value)){
      setIdValidMsg("영문/숫자 4~20자로 입력해주세요");
      setIdValid(false);
    } else {
      setIdValidMsg("중복확인을 해주세요");
      setIdValid(true);
    }
    setIdCheckMsg("");
    setIdCheckOk(false);
  };

  //중복확인 버튼클릭
  const handleCheckId = async () => {
    const value = watch("loginId");
    if(!value || !idRegex.test(value)){
      setIdValidMsg("영문/숫자 4~20자로 입력해주세요");
      setIdValid(false);
      setIdCheckMsg("");
      return;
    }
    try{
      const data = await apiCall(`/v1/checkid/${value}`, "GET", null, null, false);
      if(data.idUse === "T"){
        setIdCheckMsg(data.message);
        setIdCheckOk(true);
      }else{
        setIdCheckMsg(data.message);
        setIdCheckOk(false);
      }
    }catch(err){
      setIdCheckMsg("중복확인 중 오류가 발생했습니다");
      setIdCheckOk(false);
    }
  }

  //useForm에 isSubmitting에 들어갈 콜백함수, 즉 join 서브밋 하면 실행될 함수
  const onSubmit = async (data) => {
    if(!idCheckOk){
      alert("아이디 중복확인을 해주세요");
      return;
    }
    const requestData = {
      loginId: data.loginId, pwd: data.pwd, userNm: data.userNm, tel: data.tel,
      email: data.email, genderCd: data.genderCd, birthYmd: data.birthYmd,
    };
    try{
      const result = await apiCall("/v1/auth/join", "POST", requestData, null, false);
      alert(result);
      navigate("/")
    } catch(err){
      alert("회원가입에 실패했습니다. 다시 시도해주세요.("+err+")");
    }
  };

  //제출 시 유효성 실패=>가장 위 에러필드로 포커스
  const onError = (errors) => {
    const fieldOrder = ["loginId", "pwd", "pwdConfirm", "userNm", "tel", "email", "genderCd", "birthYmd"];
    for(const field of fieldOrder){
      if(errors[field]){
        setFocus(field);
        break;
      }};
  };

  return(
    <div>
      <h2>회원가입</h2>
 
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
 
        {/* 아이디 */}
        <div>
          <label>아이디</label>
          <div>
            <input
              type="text"
              placeholder="예)abc123"
              {...register("loginId", {
                required: "아이디를 입력해주세요",
                pattern:{value: idRegex, message:"영문/숫자 4~20자로 입력해주세요"},
                onChange: () => {
                  setIdCheckOk(false);
                  setIdCheckMsg("");
                },
              })}
              onBlur={handleIdBlur}
            />
            <button type="button" onClick={handleCheckId}>
              중복확인
            </button>
          </div>
 
          {/* 유효성 메시지 (중복확인 결과가 없을 때만 표시) */}
          {!idCheckMsg && idValidMsg && (
            <p style={idValid ? msgStyle.green : msgStyle.red}>{idValidMsg}</p>
          )}
          {/* 중복확인 결과 메시지 */}
          {idCheckMsg && (
            <p style={idCheckOk ? msgStyle.green : msgStyle.red}>{idCheckMsg}</p>
          )}
          {/* 제출 시 훅폼 에러 (포커스 아웃을 한 번도 안 했을 때) */}
          {errors.loginId && !idCheckMsg && !idValidMsg && (
            <p style={msgStyle.red}>{errors.loginId.message}</p>
          )}
        </div>
 
        {/* 비밀번호 */}
        <div>
          <label>비밀번호</label>
          <input
            type="password"
            placeholder="영문+숫자 8~20자"
            {...register("pwd", {
              required: "비밀번호를 입력해주세요",
              pattern:{value: pwdRegex, message: "영문+숫자 조합 8~20자로 입력해주세요"},
            })}
          />
          {errors.pwd && <p style={msgStyle.red}>{errors.pwd.message}</p>}
        </div>
 
        {/* 비밀번호 확인 */}
        <div>
          <label>비밀번호 확인</label>
          <input
            type="password"
            placeholder="비밀번호를 다시 입력해주세요"
            {...register("pwdConfirm", {
              required: "비밀번호 확인을 입력해주세요",
              validate: (v) => v === watch("pwd") || "비밀번호가 일치하지 않습니다",
            })}
          />
          {errors.pwdConfirm && <p style={msgStyle.red}>{errors.pwdConfirm.message}</p>}
        </div>
 
        {/* 이름 */}
        <div>
          <label>이름</label>
          <input
            type="text"
            placeholder="홍길동"
            {...register("userNm", { required: "이름을 입력해주세요" })}
          />
          {errors.userNm && <p style={msgStyle.red}>{errors.userNm.message}</p>}
        </div>
 
        {/* 전화번호 */}
        <div>
          <label>전화번호</label>
          <input
            type="tel"
            placeholder="숫자만 입력 예)01012345678"
            {...register("tel", {
              required: "전화번호를 입력해주세요",
              validate: (v) => telRegex.test(v) || "숫자만 10~11자리로 입력해주세요",
            })}
          />
          {errors.tel && <p style={msgStyle.red}>{errors.tel.message}</p>}
        </div>
 
        {/* 이메일 */}
        <div>
          <label>이메일</label>
          <input
            type="email"
            placeholder="example@email.com"
            {...register("email", {
              required: "이메일을 입력해주세요",
              validate: (v) => emailRegex.test(v) || "이메일 형식이 올바르지 않습니다",
            })}
          />
          {errors.email && <p style={msgStyle.red}>{errors.email.message}</p>}
        </div>
 
        {/* 성별 */}
        <div>
          <label>성별</label>
          <select {...register("genderCd", { required: "성별을 선택해주세요" })}>
            <option value="">선택해주세요</option>
            <option value="M">남성</option>
            <option value="F">여성</option>
          </select>
          {errors.genderCd && <p style={msgStyle.red}>{errors.genderCd.message}</p>}
        </div>
 
        {/* 생년월일 */}
        <div>
          <label>생년월일</label>
          <input
            type="date"
            {...register("birthYmd", { required: "생년월일을 입력해주세요" })}
          />
          {errors.birthYmd && <p style={msgStyle.red}>{errors.birthYmd.message}</p>}
        </div>
 
        {/* 제출 버튼 */}
        {/* isSubmitting: API 응답 오기 전까지 true → 버튼 비활성화로 중복 제출 방지 */}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "처리 중..." : "회원가입"}
        </button>
 
      </form>
    </div>
  )
}