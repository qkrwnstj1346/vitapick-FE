import { Routes, Route } from 'react-router-dom';

import Login from '../../pages/users/Login';
import Home from '../../pages/home/Home';
import Join from '../../pages/users/Join';
// import MyPage from '../../pages/users/MyPage';

import CsMain from '../../pages/cscenter/csmain/CsMain';
import NoticeList from '../../pages/cscenter/ntc/NoticeList';
import NoticeDetail from '../../pages/cscenter/ntc/NoticeDetail';
import NoticeForm from '../../pages/cscenter/ntc/NoticeForm';

import FaqList from '../../pages/cscenter/faq/FaqList';
import FaqDetail from '../../pages/cscenter/faq/FaqDetail';
import FaqForm from '../../pages/cscenter/faq/FaqForm';

import InquiryList from '../../pages/cscenter/inq/InquiryList';


function Main({ token, onLogin }) {

    return (
        <main>
            <Routes>
                <Route path="/" element={<Home />} />

                <Route path="/v1/auth/login"
                    element={<Login onLogin={onLogin} />} />
                <Route path="/v1/auth/join" element={<Join />} />

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
                <Route path="/cscenter/inq" element={<InquiryList />} />

            </Routes>
        </main>
    );
}

export default Main;