import { Routes, Route } from 'react-router-dom';

import Login from '../../pages/users/Login';
import Home from '../../pages/home/Home';
import Join from '../../pages/users/Join';
import FindId from '../../pages/users/FindId';
import FindPwd from '../../pages/users/FindPwd';
import Sur from '../../pages/custom/Sur';

import MyPage from './Mypage';
import MyMain from '../../pages/mypage/mymain/MyMain';

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

import CusResult from '../../pages/custom/CusResult';
import CusList from '../../pages/custom/CusList';

import ProductList from '../../pages/products/ProductList';
import ProductDetail from '../../pages/products/ProductDetail';

import Cart from '../../pages/cart/Cart';

import Order from '../../pages/order/Order';
import OrderComplete from '../../pages/order/OrderComplete';


import UserAddrList from '../useraddr/UserAddrList';

function Main({ onLoginSubmit, isLoggedIn }) {

    return (
        <main>
            <Routes>
                <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />

                <Route
                    path="/v1/auth/login"
                    element={<Login onLoginSubmit={onLoginSubmit} />}
                />

                <Route path="/v1/auth/findid" element={<FindId />} />
                <Route path="/v1/auth/sendotpcode" element={<FindPwd />} />

                <Route
                    path="/v1/auth/join"
                    element={<Join />}
                />


                {/* 마이페이지 */}
                <Route path="/mypage" element={<MyPage />}>
                    <Route index element={<MyMain />} />
                </Route>

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

                {/* 상품 상세 */}
                <Route path="/products/detail/:prdId" element={<ProductDetail />} />

                {/* 상품 검색 결과 */}
                <Route path="/products/search/:keyword" element={<ProductList />} />

                {/* 상품 목록 */}
                <Route path="/products/:catCd" element={<ProductList />} />

                {/* 챗봇 */}
                <Route path="/chatbot" element={<Chatbot />} />

                {/* 설문 작성 */}
                <Route path="/v1/sur/save" element={<Sur />} />

                {/* AI 추천 결과 */}
                <Route path="/v1/cus/result/:cusId" element={<CusResult />} />

                {/* 내 추천 목록 */}
                <Route path="/v1/cus/list" element={<CusList />} />

                {/* 장바구니 */}
                <Route path="/cart" element={<Cart />} />

                {/* 주문서 /}
                <Route path="/order" element={<Order />} />

                {/ 주문 완료 */}
                <Route path="/order/complete/:ordNo" element={<OrderComplete />} />

                {/* 배송지 */}
                <Route path="/address" element={<UserAddrList />} />



            </Routes>
        </main>
    );
}

export default Main;