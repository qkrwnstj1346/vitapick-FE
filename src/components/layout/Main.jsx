import { Routes, Route } from 'react-router-dom';

import Login from '../../pages/users/Login';
import Home from '../../pages/home/Home';
import Join from '../../pages/users/Join';
import Sur from '../../pages/custom/Sur';
// import MyPage from '../../pages/users/MyPage';

import CsMain from '../../pages/cscenter/csmain/CsMain';
import NoticeList from '../../pages/cscenter/ntc/NoticeList';
import NoticeDetail from '../../pages/cscenter/ntc/NoticeDetail';
import NoticeForm from '../../pages/cscenter/ntc/NoticeForm';

import FaqList from '../../pages/cscenter/faq/FaqList';
import FaqDetail from '../../pages/cscenter/faq/FaqDetail';
import FaqForm from '../../pages/cscenter/faq/FaqForm';

import InquiryList from '../../pages/cscenter/inq/InquiryList';
import InquiryDetail from '../../pages/cscenter/inq/InquiryDetail';
import InquiryForm from '../../pages/cscenter/inq/InquiryForm';

import Chatbot from '../../pages/chatbot/Chatbot';
import ProductList from '../../pages/products/ProductList';

function Main({ token, onLogin, isLoggedIn  }) {

    return (
        <main>
            <Routes>
                <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />

                <Route
                    path="/v1/auth/login"
                    element={<Login onLogin={onLogin} />}
                />

                <Route
                    path="/v1/auth/join"
                    element={<Join />}
                />

                {/* <Route
                    path="/mypage"
                    element={<MyPage token={token} />}
                /> */}

                {/* 고객센터 메인 */}
                <Route path="/cscenter" element={<CsMain />} />

                {/* 공지사항 */}
                <Route path="/cscenter/notices" element={<NoticeList />} />
                <Route path="/cscenter/notices/:ntcId" element={<NoticeDetail />} />
                <Route path="/cscenter/notices/new" element={<NoticeForm />} />
                <Route path="/cscenter/notices/:ntcId/edit" element={<NoticeForm />} />

                {/* FAQ */}
                <Route path="/cscenter/faqs" element={<FaqList />} />
                <Route path="/cscenter/faqs/:faqId" element={<FaqDetail />} />
                <Route path="/cscenter/faqs/new" element={<FaqForm />} />
                <Route path="/cscenter/faqs/:faqId/edit" element={<FaqForm />} />

                {/* 1:1 문의 */}
                <Route path="/cscenter/inquiries" element={<InquiryList />} />
                <Route path="/cscenter/inquiries/:inqId" element={<InquiryDetail />} />
                <Route path="/cscenter/inquiries/new" element={<InquiryForm />} />
                <Route path="/cscenter/inquiries/:inqId/edit" element={<InquiryForm />} />
                
                {/* 상품 목록 */}
                <Route path="/products/:catCd" element={<ProductList />} />
                
                {/* 챗봇 */}
                <Route path="/chatbot" element={<Chatbot />} />
                
                {/*설문 작성*/}
                <Route path="/v1/sur/save" element={<Sur />} />
            </Routes>
        </main>
    );
}

export default Main;