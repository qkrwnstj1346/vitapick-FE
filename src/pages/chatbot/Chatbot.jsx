import { useState } from 'react';
import { apiCall, getToken } from '../../service/apiService';
import './Chatbot.css';

const ChatbotPopup = ({ onClose, userInfo }) => {

    // 메시지 목록 (처음에 AI 인사말 보여주기)
    const [messages, setMessages] = useState([
        { senderCd: 'AI', msgTxt: '안녕하세요! 💊 VitaPick AI입니다.\n증상이나 건강 고민을 말씀해 주시면 맞춤 영양제를 추천해 드릴게요!' }
    ]);

    // 입력창 텍스트
    const [inputText, setInputText] = useState('');

    // 로딩 상태 (AI 답변 중)
    const [loading, setLoading] = useState(false);

    // 전송 버튼 눌렀을 때
    const handleSend = async () => {

        // 입력창 비어있으면 아무것도 안 함
        if (!inputText.trim()) return;

        // 내 메시지 화면에 추가
        setMessages(prev => [...prev, { senderCd: 'USER', msgTxt: inputText }]);
        setInputText('');
        setLoading(true);

        try {
            // Spring 서버로 전송
            const token = getToken();
            const result = await apiCall(
                '/api/v1/chatbot/message',
                'POST',
                { userNum: userInfo.userNum, msgTxt: inputText },
                token,
                false
            );

            // AI 응답 화면에 추가
            setMessages(prev => [...prev, { senderCd: 'AI', msgTxt: result.msgTxt }]);

        } catch (err) {
            setMessages(prev => [...prev, { senderCd: 'AI', msgTxt: '오류가 발생했습니다. 다시 시도해 주세요.' }]);
        } finally {
            setLoading(false);
        }

    };

    // 엔터 키 눌렀을 때 전송
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className='chatpopup_container'>

            {/* 상단 헤더 */}
            <div className='chatpopup_header'>
                <img src='/images/VitaPick_ChatBot_Logo.png' alt='챗봇' className='chatpopup_logo' />
                <h3>VitaPick AI 챗봇</h3>
                <button className='chatpopup_close' onClick={onClose}>✕</button>
            </div>

            {/* 메시지 목록 */}
            <div className='chatpopup_messages'>
                {messages.map((msg, idx) => (
                    <div key={idx} className={msg.senderCd === 'USER' ? 'chatpopup_msg_user' : 'chatpopup_msg_ai'}>
                        <div className='chatpopup_bubble'>
                            {msg.msgTxt}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className='chatpopup_msg_ai'>
                        <div className='chatpopup_bubble'>
                            답변을 생성 중입니다...
                        </div>
                    </div>
                )}
            </div>

            {/* 입력창 */}
            <div className='chatpopup_input'>
                <textarea
                    className='chatpopup_textarea'
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder='증상을 입력하세요 (예: 요즘 너무 피곤해요)'
                    rows={2}
                />
                <button className='chatpopup_btn' onClick={handleSend} disabled={loading}>
                    전송
                </button>
            </div>

        </div>
    );

};

export default ChatbotPopup;