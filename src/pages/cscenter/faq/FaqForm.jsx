import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
    getFaqDetail,
    createFaq,
    updateFaq
} from '../../../service/cscenter/csCenterApi';

import './FaqForm.css';

function FaqForm() {

    const { faqId } = useParams();
    const navigate = useNavigate();

    const isEdit = faqId !== undefined;

    const loginUser = JSON.parse(localStorage.getItem('userInfo'));
    const isAdmin = loginUser?.roleCd === 'ADMIN';

    const [formData, setFormData] = useState({
        faqCtgCd: 'ORDER',
        ttl: '',
        faqTxt: '',
        useYn: 'Y'
    });

    useEffect(() => {

        if (!isAdmin) {
            alert('관리자만 접근할 수 있습니다.');
            navigate('/cscenter/faqs');
            return;
        }

        if (isEdit) {

            getFaqDetail(faqId)
                .then((data) => {

                    setFormData({
                        faqCtgCd: data.faqCtgCd || 'ORDER',
                        ttl: data.ttl || '',
                        faqTxt: data.faqTxt || '',
                        useYn: data.useYn || 'Y'
                    });

                })
                .catch((err) => {

                    console.log(err);

                    alert('FAQ 정보를 불러오지 못했습니다.');

                    navigate('/cscenter/faqs');

                });

        }

    }, [faqId, isEdit, isAdmin, navigate]);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        if (!formData.ttl.trim()) {
            alert('제목을 입력해주세요.');
            return;
        }

        if (!formData.faqTxt.trim()) {
            alert('내용을 입력해주세요.');
            return;
        }

        const api = isEdit
            ? updateFaq(faqId, formData)
            : createFaq(formData);

        api
            .then(() => {

                alert(isEdit ? 'FAQ가 수정되었습니다.' : 'FAQ가 등록되었습니다.');

                navigate('/cscenter/faqs');

            })
            .catch((err) => {

                console.log(err);

                alert(isEdit ? 'FAQ 수정에 실패했습니다.' : 'FAQ 등록에 실패했습니다.');

            });

    };

    const moveList = () => {
        navigate('/cscenter/faqs');
    };

    return (
        <div className="cs-faq-form-container">

            <h1 className="cs-faq-form-title">
                {isEdit ? 'FAQ 수정' : 'FAQ 등록'}
            </h1>

            <form onSubmit={handleSubmit} className="cs-faq-form">

                <div className="cs-faq-form-group">

                    <label>
                        카테고리
                    </label>

                    <select
                        name="faqCtgCd"
                        value={formData.faqCtgCd}
                        onChange={handleChange}
                        className="cs-faq-form-select"
                    >
                        <option value="ORDER">ORDER</option>
                        <option value="DELIVERY">DELIVERY</option>
                        <option value="PRODUCT">PRODUCT</option>
                        <option value="MEMBER">MEMBER</option>
                        <option value="PAYMENT">PAYMENT</option>
                        <option value="CUSTOM">CUSTOM</option>
                        <option value="INGREDIENT">INGREDIENT</option>
                        <option value="ETC">ETC</option>
                    </select>

                </div>

                <div className="cs-faq-form-group">

                    <label>
                        제목
                    </label>

                    <input
                        type="text"
                        name="ttl"
                        value={formData.ttl}
                        onChange={handleChange}
                        className="cs-faq-form-input"
                        placeholder="FAQ 제목을 입력하세요."
                    />

                </div>

                <div className="cs-faq-form-group">

                    <label>
                        내용
                    </label>

                    <textarea
                        name="faqTxt"
                        value={formData.faqTxt}
                        onChange={handleChange}
                        className="cs-faq-form-textarea"
                        placeholder="FAQ 내용을 입력하세요."
                    />

                </div>

                <div className="cs-faq-form-group">

                    <label>
                        사용여부
                    </label>

                    <select
                        name="useYn"
                        value={formData.useYn}
                        onChange={handleChange}
                        className="cs-faq-form-select"
                    >
                        <option value="Y">Y</option>
                        <option value="N">N</option>
                    </select>

                </div>

                <div className="cs-faq-form-btn-wrap">

                    <button
                        type="submit"
                        className="cs-faq-submit-btn"
                    >
                        {isEdit ? '수정' : '등록'}
                    </button>

                    <button
                        type="button"
                        className="cs-faq-cancel-btn"
                        onClick={moveList}
                    >
                        취소
                    </button>

                </div>

            </form>

        </div>
    );
}

export default FaqForm;