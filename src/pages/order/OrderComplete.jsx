import { useNavigate, useParams } from 'react-router-dom';

import './OrderComplete.css';

function OrderComplete() {

    const navigate = useNavigate();
    const { ordNo } = useParams();

    return (
        <div className="orderCompletePage">

            <div className="orderCompleteBox">

                <div className="completeIcon">
                    ✅
                </div>

                <h2 className="completeTitle">
                    주문이 완료되었습니다.
                </h2>

                <p className="completeText">
                    주문번호 : {ordNo}
                </p>

                <div className="completeBtnBox">

                    <button
                        type="button"
                        className="homeBtn"
                        onClick={() => navigate('/')}
                    >
                        홈으로
                    </button>

                    <button
                        type="button"
                        className="orderBtn"
                        onClick={() => navigate('/mypage')}
                    >
                        주문내역 보기
                    </button>

                </div>

            </div>

        </div>
    );
}

export default OrderComplete;