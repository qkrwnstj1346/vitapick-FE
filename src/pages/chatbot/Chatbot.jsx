import { useState, useEffect } from 'react';
import { apiCall, getToken } from '../../service/apiService';
import './Chatbot.css';

const Chatbot = ({ onClose, userInfo }) => {

    // 메시지 목록
    const [messages, setMessages] = useState([
        { senderCd: 'AI', msgTxt: '안녕하세요! 💊 VitaPick AI입니다.\n증상이나 건강 고민을 말씀해 주시면 맞춤 영양제를 추천해 드릴게요!' }
    ]);

    // 입력창 텍스트
    const [inputText, setInputText] = useState('');

    // 로딩 상태
    const [loading, setLoading] = useState(false);

    // 상품 목록 (이미지 찾기용)
    const [prdList, setPrdList] = useState([]);

    // 페이지 열릴 때 상품 목록 가져오기
    useEffect(() => {
        const token = getToken();
        apiCall('/api/v1/product/list/img', 'GET', null, token, false)
            .then(data => setPrdList(data))
            .catch(err => console.error('상품 목록 오류:', err));
    }, []);

    // GPT 응답에서 상품명 추출해서 이미지 찾기
    const findPrdImages = (msgTxt) => {
        return prdList.filter(prd => msgTxt.includes(prd.prdNm));
    };

    // 전송 버튼 눌렀을 때
    const handleSend = async () => {

        if (!inputText.trim()) return;

        setMessages(prev => [...prev, { senderCd: 'USER', msgTxt: inputText }]);
        setInputText('');
        setLoading(true);

        try {
            const token = getToken();
            const result = await apiCall(
                '/api/v1/chatbot/message',
                'POST',
                { userNum: userInfo.userNum, msgTxt: inputText },
                token,
                false
            );

            // GPT 응답에서 상품 이미지 찾기
            const matchedPrds = findPrdImages(result.msgTxt);

            setMessages(prev => [...prev, {
                senderCd: 'AI',
                msgTxt: result.msgTxt,
                products: matchedPrds
            }]);

        } catch (err) {
            setMessages(prev => [...prev, { senderCd: 'AI', msgTxt: '오류가 발생했습니다. 다시 시도해 주세요.' }]);
        } finally {
            setLoading(false);
        }

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
                            {msg.msgTxt}
                        </div>

                        {/* 추천 상품 이미지 카드 */}
                        {msg.products && msg.products.length > 0 && (
                            <div className='chatPopup_prd_list'>
                                {msg.products.map((prd, pIdx) => (
                                    <div key={pIdx} className='chatPopup_prd_card'>
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