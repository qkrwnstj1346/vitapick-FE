import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiCall } from "../../../service/apiService";
import "./MyChatbotList.css";

function MyChatbotList() {
    const [roomList, setRoomList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        callMyChatbotList();
    }, []);

    async function callMyChatbotList() {
        try {
            const data = await apiCall.get("/api/v1/chatbot/rooms");
            setRoomList(data);
        } catch (err) {
            console.error("AI 챗봇 상담 목록 불러오기 오류", err);
        }
    }

    function goDetail(chatId) {
        navigate(`/mypage/mychatbot/${chatId}`);
    }

    return (
        <div className="mychat-wrap">
            <h2>AI 챗봇 상담 내역</h2>

            {roomList.length === 0 ? (
                <p className="mychat-empty">상담 내역이 없습니다.</p>
            ) : (
                roomList.map((room) => (
                    <div
                        className="mychat-item"
                        key={room.chatId}
                        onClick={() => goDetail(room.chatId)}
                    >
                        <div>
                            <h3>{room.title}</h3>
                            <p>생성일시: {room.crtAt}</p>
                        </div>

                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                goDetail(room.chatId);
                            }}
                        >
                            상세보기
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}

export default MyChatbotList;