import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiCall } from "../../../service/apiService";
import "./MyChatbotDetail.css";

function MyChatbotDetail() {
    const { chatId } = useParams();
    const navigate = useNavigate();

    const [msgList, setMsgList] = useState([]);
    const [prdMap, setPrdMap] = useState({});

    useEffect(() => {
        callChatDetail();
    }, []);

    async function callChatDetail() {
        try {
            const data = await apiCall.get(`/api/v1/chatbot/messages/${chatId}`);
            setMsgList(data);

            for (const msg of data) {
                if (msg.senderCd === "AI") {
                    callRecommendProducts(msg.msgId);
                }
            }
        } catch (err) {
            console.error("챗봇 상세 조회 오류", err);
        }
    }

    async function callRecommendProducts(msgId) {
        try {
            const data = await apiCall.get(`/api/v1/chatbot/messages/${msgId}/products`);

            setPrdMap((prev) => ({
                ...prev,
                [msgId]: data
            }));
        } catch (err) {
            console.error("추천상품 조회 오류", err);
        }
    }

    function goProductDetail(prdId) {
        navigate(`/products/detail/${prdId}`);
    }

    return (
        <div className="mychat-detail-wrap">
            <h2>AI 챗봇 상담 상세</h2>

            {msgList.map((msg) => (
                <div
                    className={msg.senderCd === "USER" ? "chat-msg user" : "chat-msg ai"}
                    key={msg.msgId}
                >
                    <h4>{msg.senderCd === "USER" ? "나" : "AI"}</h4>

                    <p>{msg.msgTxt}</p>

                    {msg.senderCd === "AI" && prdMap[msg.msgId] && (
                        <div className="chat-prd-box">
                            <h3>추천 상품</h3>

                            {prdMap[msg.msgId].map((prd) => (
                                <div className="chat-prd-item" key={prd.prdId}>
                                    <img
                                        src={prd.thumbImgUrl || "/images/no-image.png"}
                                        alt={prd.prdNm}
                                    />

                                    <div className="chat-prd-info">
                                        <p className="chat-prd-brand">{prd.brand}</p>
                                        <h4>{prd.prdNm}</h4>
                                        <p className="chat-prd-price">
                                            {prd.price?.toLocaleString()}원
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => goProductDetail(prd.prdId)}
                                    >
                                        상품 보기
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default MyChatbotDetail;