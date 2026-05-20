import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    getNoticeDetail,
    createNotice,
    updateNotice
} from '../../../service/cscenter/csCenterApi';
import './NoticeForm.css';

function NoticeForm() {

    const { ntcId } = useParams();
    const navigate = useNavigate();

    const isEdit = ntcId !== undefined;

    const loginUser = JSON.parse(localStorage.getItem('userInfo'));

    const isAdmin = loginUser?.roleCd === 'ADMIN';

    const [formData, setFormData] = useState({
        ttl: '',
        ntcTxt: '',
        useYn: 'Y'
    });

    useEffect(() => {

        if (!isAdmin) {
            alert('관리자만 접근 가능합니다.');
            navigate('/cscenter/notices');
            return;
        }

        if (isEdit) {

            getNoticeDetail(ntcId)
                .then((data) => {

                    setFormData({
                        ttl: data.ttl || '',
                        ntcTxt: data.ntcTxt || '',
                        useYn: data.useYn || 'Y'
                    });

                })
                .catch((err) => {
                    console.log(err);
                    alert('공지사항 조회 실패');
                });
        }

    }, [isEdit, ntcId, isAdmin, navigate]);

    const changeHandler = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const submitHandler = async (e) => {

        e.preventDefault();

        if (!formData.ttl.trim()) {
            alert('제목을 입력해주세요.');
            return;
        }

        if (!formData.ntcTxt.trim()) {
            alert('내용을 입력해주세요.');
            return;
        }

        try {

            if (isEdit) {

                await updateNotice(ntcId, formData);

                alert('공지사항 수정 완료!');

            } else {

                await createNotice(formData);

                alert('공지사항 등록 완료!');
            }

            navigate('/cscenter/notices');

        } catch (err) {

            console.log(err);

            alert(isEdit ? '수정 실패' : '등록 실패');
        }
    };

    const cancelHandler = () => {
        navigate('/cscenter/notices');
    };

    return (
        <div className="notice-form-wrap">

            <h2 className="notice-form-title">
                {isEdit ? '공지사항 수정' : '공지사항 등록'}
            </h2>

            <form
                className="notice-form"
                onSubmit={submitHandler}
            >

                <div className="notice-form-group">

                    <label>제목</label>

                    <input
                        type="text"
                        name="ttl"
                        value={formData.ttl}
                        onChange={changeHandler}
                        placeholder="공지사항 제목 입력"
                    />

                </div>

                <div className="notice-form-group">

                    <label>내용</label>

                    <textarea
                        name="ntcTxt"
                        value={formData.ntcTxt}
                        onChange={changeHandler}
                        placeholder="공지사항 내용 입력"
                    />

                </div>

                <div className="notice-form-group">

                    <label>사용 여부</label>

                    <select
                        name="useYn"
                        value={formData.useYn}
                        onChange={changeHandler}
                    >
                        <option value="Y">사용</option>
                        <option value="N">미사용</option>
                    </select>

                </div>

                <div className="notice-form-btn-wrap">

                    <button
                        type="button"
                        className="notice-form-cancel-btn"
                        onClick={cancelHandler}
                    >
                        취소
                    </button>

                    <button
                        type="submit"
                        className="notice-form-submit-btn"
                    >
                        {isEdit ? '수정하기' : '등록하기'}
                    </button>

                </div>

            </form>

        </div>
    );
}

export default NoticeForm;