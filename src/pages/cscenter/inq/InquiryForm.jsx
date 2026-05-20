import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
    createInq,
    updateInq,
    getMyInqDetail
} from '../../../service/cscenter/csCenterApi';

import './InquiryForm.css';

function InquiryForm() {

    const { inqId } = useParams();

    const navigate = useNavigate();

    const loginUser = JSON.parse(localStorage.getItem('userInfo'));

    const isEdit = inqId !== undefined;

    const [formData, setFormData] = useState({
        inqTpCd: 'PRODUCT',
        ttl: '',
        inqTxt: '',
        userNum: loginUser?.userNum
    });

    useEffect(() => {

        if (!loginUser) {

            alert('로그인 후 이용 가능합니다.');

            navigate('/v1/auth/login');

            return;
        }

        if (loginUser.roleCd === 'ADMIN') {

            alert('관리자는 1:1 문의를 등록/수정할 수 없습니다.');

            navigate('/cscenter/inquiries');

            return;
        }

        if (isEdit) {

            fetchInqDetail();
        }

    }, []);

    const fetchInqDetail = async () => {

        try {

            const result = await getMyInqDetail(
                inqId,
                loginUser.userNum
            );

            console.log('문의 수정 상세 = ', result);

            setFormData({
                inqTpCd: result.inqTpCd,
                ttl: result.ttl,
                inqTxt: result.inqTxt,
                userNum: result.userNum
            });

        } catch (err) {

            console.log(err);

            alert('문의 정보를 불러오지 못했습니다.');

            navigate('/cscenter/inquiries');
        }
    };

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!formData.ttl.trim()) {

            alert('제목을 입력해주세요.');

            return;
        }

        if (!formData.inqTxt.trim()) {

            alert('문의 내용을 입력해주세요.');

            return;
        }

        try {

            if (isEdit) {

                await updateInq(
                    inqId,
                    loginUser.userNum,
                    formData
                );

                alert('문의글이 수정되었습니다.');

            } else {

                await createInq(formData);

                alert('문의글이 등록되었습니다.');
            }

            navigate('/cscenter/inquiries');

        } catch (err) {

            console.log(err);

            alert(
                isEdit
                    ? '문의글 수정에 실패했습니다.'
                    : '문의글 등록에 실패했습니다.'
            );
        }
    };

    return (
        <div className="inq-form-wrap">

            <div className="inq-form-top">

                <h2 className="inq-form-title">

                    {isEdit
                        ? '1:1 문의 수정'
                        : '1:1 문의 등록'}

                </h2>

            </div>

            <form
                className="inq-form"
                onSubmit={handleSubmit}
            >

                <div className="inq-form-row">

                    <label className="inq-form-label">
                        문의유형
                    </label>

                    <select
                        className="inq-form-select"
                        name="inqTpCd"
                        value={formData.inqTpCd}
                        onChange={handleChange}
                    >
                        <option value="PRODUCT">상품</option>
                        <option value="ORDER">주문</option>
                        <option value="DELIVERY">배송</option>
                        <option value="MEMBER">회원</option>
                        <option value="ETC">기타</option>
                    </select>

                </div>

                <div className="inq-form-row">

                    <label className="inq-form-label">
                        제목
                    </label>

                    <input
                        className="inq-form-input"
                        type="text"
                        name="ttl"
                        value={formData.ttl}
                        onChange={handleChange}
                        placeholder="제목을 입력해주세요."
                    />

                </div>

                <div className="inq-form-text-row">

                    <label className="inq-form-label">
                        문의내용
                    </label>

                    <textarea
                        className="inq-form-textarea"
                        name="inqTxt"
                        value={formData.inqTxt}
                        onChange={handleChange}
                        placeholder="문의 내용을 입력해주세요."
                    />

                </div>

                <div className="inq-form-btn-wrap">

                    <button
                        type="button"
                        className="inq-cancel-btn"
                        onClick={() => navigate('/cscenter/inquiries')}
                    >
                        취소
                    </button>

                    <button
                        type="submit"
                        className="inq-submit-btn"
                    >

                        {isEdit
                            ? '수정'
                            : '등록'}

                    </button>

                </div>

            </form>

        </div>
    );
}

export default InquiryForm;