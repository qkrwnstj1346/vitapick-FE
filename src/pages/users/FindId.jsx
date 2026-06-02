// import { useState } from 'react';
// import { findId } from './service/usersApi';

// function FindId(){
//     const [userNm, setUserNm] = useState("");
//     const [email, setEmail] = useState("");
    
// //     return (
// //         <div className='body_container'>
// //             <hr />
// //             <h2 style={{ color: '#7FAF8B' }}>아이디찾기</h2>
// //             <div>
// //                 <form
// //                     autoComplete='off'
// //                     onSubmit={(e) => {
// //                         e.preventDefault();
// //                         findId(userNm, email)}}>
// //                     <input type="text" name="loginId" placeholder="아이디"
// //                         autoComplete='off'
// //                         size={20} value={userNm}
// //                         onChange={(e) => setUserNm(e.target.value)}
// //                         required
// //                         pattern="^[a-z0-9_]{4,10}$"
// //                     /><br />
// //                     <input type="password" name="Pwd"
// //                         autoComplete='new-password' placeholder="비밀번호"
// //                         size={20} value={email}
// //                         onChange={(e) => setEmail(e.target.value)}
// //                         required
// //                         minLength="4"
// //                     /><br /><br />
// //                     <input type="submit" className="loginBtn" value="아이디찾기" style={{ width: 175 }} /><br /><br />
// //                 </form>

// //             </div>
// //         </div>


// //     ); //return
// // }

// export default FindId;