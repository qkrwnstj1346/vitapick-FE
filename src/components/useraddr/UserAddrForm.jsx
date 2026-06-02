import { useState } from 'react';

import {
    createAddr,
    updateAddr
} from '../../../service/address/addressApi';

import './UserAddrForm.css';

function UserAddrForm({
    mode = 'create',
    addrData = null,
    onSuccess,
    onCancel
}) {

    const [formData, setFormData] = useState({
        addrNm: addrData?.addrNm || '',
        rcvNm: addrData?.rcvNm || '',
        rcvTel: addrData?.rcvTel || '',
        zipCd: addrData?.zipCd || '',
        addr1: addrData?.addr1 || '',
        addr2: addrData?.addr2 || '',
        baseYn: addrData?.baseYn || 'N'
    });

    /* 입력값 변경 */
    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    /* 저장 */
    const handleSubmit = () => {

        if (!formData.addrNm.trim()) {
            alert('배송지명을 입력해주세요.');
            return;
        }

        if (!formData.rcvNm.trim()) {
            alert('받는 사람을 입력해주세요.');
            return;
        }

        if (!formData.rcvTel.trim()) {
            alert('연락처를 입력해주세요.');
            return;
        }

        if (!formData.addr1.trim()) {
            alert('주소를 입력해주세요.');
            return;
        }

        const request =
            mode === 'create'
                ? createAddr(formData)
                : updateAddr(addrData.addrId, formData);

        request
            .then(() => {

                alert(
                    mode === 'create'
                        ? '배송지가 등록되었습니다.'
                        : '배송지가 수정되었습니다.'
                );

                onSuccess?.();

            })
            .catch(err => {

                console.log(err);

                alert(
                    mode === 'create'
                        ? '배송지 등록에 실패했습니다.'
                        : '배송지 수정에 실패했습니다.'
                );
            });
    };

    return (
        <div className="userAddrFormWrap">

            <div className="userAddrForm">

                <h2 className="userAddrFormTitle">
                    {
                        mode === 'create'
                            ? '배송지 추가'
                            : '배송지 수정'
                    }
                </h2>

                {/* 배송지명 */}
                <div className="userAddrFormGroup">
                    <label>배송지명</label>

                    <input
                        type="text"
                        name="addrNm"
                        value={formData.addrNm}
                        onChange={handleChange}
                        placeholder="예) 집, 회사"
                    />
                </div>

                {/* 받는 사람 */}
                <div className="userAddrFormGroup">
                    <label>받는 사람</label>

                    <input
                        type="text"
                        name="rcvNm"
                        value={formData.rcvNm}
                        onChange={handleChange}
                    />
                </div>

                {/* 연락처 */}
                <div className="userAddrFormGroup">
                    <label>연락처</label>

                    <input
                        type="text"
                        name="rcvTel"
                        value={formData.rcvTel}
                        onChange={handleChange}
                    />
                </div>

                {/* 우편번호 */}
                <div className="userAddrFormGroup">
                    <label>우편번호</label>

                    <input
                        type="text"
                        name="zipCd"
                        value={formData.zipCd}
                        onChange={handleChange}
                    />
                </div>

                {/* 주소 */}
                <div className="userAddrFormGroup">
                    <label>주소</label>

                    <input
                        type="text"
                        name="addr1"
                        value={formData.addr1}
                        onChange={handleChange}
                    />
                </div>

                {/* 상세주소 */}
                <div className="userAddrFormGroup">
                    <label>상세주소</label>

                    <input
                        type="text"
                        name="addr2"
                        value={formData.addr2}
                        onChange={handleChange}
                    />
                </div>

                {/* 기본 배송지 */}
                <div className="userAddrCheckBox">

                    <input
                        type="checkbox"
                        checked={formData.baseYn === 'Y'}
                        onChange={(e) =>
                            setFormData(prev => ({
                                ...prev,
                                baseYn: e.target.checked ? 'Y' : 'N'
                            }))
                        }
                    />

                    <span>
                        기본 배송지로 설정
                    </span>

                </div>

                {/* 버튼 */}
                <div className="userAddrBtnBox">

                    <button
                        className="userAddrCancelBtn"
                        onClick={onCancel}
                    >
                        취소
                    </button>

                    <button
                        className="userAddrSaveBtn"
                        onClick={handleSubmit}
                    >
                        저장
                    </button>

                </div>

            </div>

        </div>
    );
}

export default UserAddrForm;