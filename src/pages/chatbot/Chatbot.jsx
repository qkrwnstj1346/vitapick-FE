import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../../service/apiService';
import './Chatbot.css';

const Chatbot = ({ onClose, userInfo }) => {

    // 페이지 이동 함수
    const navigate = useNavigate();

    // 메시지 목록
    const [messages, setMessages] = useState([
        { senderCd: 'AI', msgTxt: '안녕하세요! 💊 VitaPick AI입니다.\n증상이나 건강 고민을 말씀해 주시면 맞춤 영양제를 추천해 드릴게요!' }
    ]);

    // 입력창 텍스트
    const [inputText, setInputText] = useState('');

    // 로딩 상태
    const [loading, setLoading] = useState(false);

    // GPT 응답에서 상품ID 뽑아서 상품 정보 가져오기
    const findPrdImages = async (msgTxt) => {

    // 텍스트를 줄 단위로 쪼개서 상품ID 찾기
    const prdIds = [];
    const lines = msgTxt.split('\n');
    for (const line of lines) {
        if (line.includes('상품ID:')) {
            const id = line.split('상품ID:')[1].split('/')[0].trim();
            if (id) prdIds.push(id);
        }
    }

    // 상품ID마다 상품 정보 가져오기
    const results = [];
        for (const id of prdIds) {
            const data = await apiCall.get(`/api/v1/product/detail/${id}`);
            if (data !== null) results.push(data);
    }
    return results;
    };

    // 전송 버튼 눌렀을 때
    const handleSend = async () => {

        if (!inputText.trim()) return;

        setMessages(prev => [...prev, { senderCd: 'USER', msgTxt: inputText }]);
        setInputText('');
        setLoading(true);

        try {
            const result = await apiCall.post(
                '/api/v1/chatbot/message',
                { msgTxt: inputText }
            );

            // GPT 응답에서 상품ID로 이미지 가져오기
            const matchedPrds = await findPrdImages(result.msgTxt);

            setMessages(prev => [...prev, {
                senderCd: 'AI',
                msgTxt: result.msgTxt,
                products: matchedPrds
            }]);

        } catch (err) {
            console.error('챗봇 요청 실패:', err);
            console.error('상태코드:', err.response?.status);
            console.error('응답데이터:', err.response?.data);

            setMessages(prev => [
                ...prev,
                { senderCd: 'AI', msgTxt: '오류가 발생했습니다. 다시 시도해 주세요.' }
            ]);

        } finally {
            setLoading(false);
        }
    };

    // 상품 상세페이지로 이동
    const goProductDetail = (prdId) => {
        navigate(`/products/detail/${prdId}`);
    };

    // 엔터 키 전송
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className='chatPopup_container'>

            {/* 헤더 */}
            <div className='chatPopup_header'>
                <img src='/images/VitaPick_ChatBot_Logo.png' alt='챗봇' className='chatPopup_logo' />
                <h3>VitaPick AI 챗봇</h3>
                <button className='chatPopup_close' onClick={onClose}>✕</button>
            </div>

            {/* 메시지 목록 */}
            <div className='chatPopup_messages'>
                {messages.map((msg, idx) => (
                    <div key={idx} className={msg.senderCd === 'USER' ? 'chatPopup_msg_user' : 'chatPopup_msg_ai'}>

                        {/* 텍스트 말풍선 */}
                        <div className='chatPopup_bubble'>
                            {msg.msgTxt.replace(/상품ID:\s*\d+\s*\/\s*/g, '')}
                        </div>

                        {/* 추천 상품 이미지 카드, 클릭 시 상세페이지로 이동 */}
                        {msg.products && msg.products.length > 0 && (
                            <div className='chatPopup_prd_list'>
                                {msg.products.map((prd, pIdx) => (
                                    <div
                                        key={pIdx} 
                                        className='chatPopup_prd_card' 
                                        onClick={() => goProductDetail(prd.prdId)}
                                    >
                                        <img src={prd.thumbImgUrl} alt={prd.prdNm} />
                                        <p>{prd.prdNm}</p>
                                        <strong>{prd.price.toLocaleString()}원</strong>
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>
                ))}
                {loading && (
                    <div className='chatPopup_msg_ai'>
                        <div className='chatPopup_bubble'>
                            답변을 생성 중입니다...
                        </div>
                    </div>
                )}
            </div>

            {/* 입력창 */}
            <div className='chatPopup_input'>
                <textarea
                    className='chatPopup_textarea'
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder='증상을 입력하세요 (예: 요즘 너무 피곤해요)'
                    rows={2}
                />
                <button className='chatPopup_btn' onClick={handleSend} disabled={loading}>
                    전송
                </button>
            </div>

        </div>
    );
};

export default Chatbot;