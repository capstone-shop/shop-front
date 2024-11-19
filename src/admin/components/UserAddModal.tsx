import React, { useState } from 'react';
import { User } from './User';

interface UserAddModalProps {
    onClose: () => void;
    onAddUser: (newUser: User) => void;
}

const UserAddModal: React.FC<UserAddModalProps> = ({ onClose, onAddUser }) => {
    const [newUser, setNewUser] = useState<User>({
        id: 0,
        name: '',
        email: '',
        address: '',
        phone_number: '',
        dealing_count: 0,
        reputation: 0,
        role: '유저',
        auth_provider: '네이버',
        profile_image: null,  // 프로필 이미지 초기값
        created_at: '',
        modified_at: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewUser((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewUser((prev) => ({
                    ...prev,
                    profile_image: reader.result as string, // 이미지 데이터 URI로 저장
                }));
            };
            reader.readAsDataURL(file); // 파일을 Data URL 형식으로 읽기
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newUserWithTimestamp = {
            ...newUser,
            id: Date.now(),
            created_at: new Date().toISOString(),
            modified_at: new Date().toISOString(),
        };
        onAddUser(newUserWithTimestamp);
        onClose();
    };

    return (
        <div className="modal-container">
            <div className="modal">
                <div className="modal-content">
                    <h2>새 사용자 추가</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="label-div">
                            <label htmlFor="name">이름</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={newUser.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="label-div">
                            <label htmlFor="email">이메일</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={newUser.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="label-div">
                            <label htmlFor="phone_number">휴대폰 번호</label>
                            <input
                                type="text"
                                id="phone_number"
                                name="phone_number"
                                value={newUser.phone_number}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="label-div">
                            <label htmlFor="address">주소</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={newUser.address}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="label-div">
                            <label htmlFor="role">역할</label>
                            <select
                                id="role"
                                name="role"
                                value={newUser.role}
                                onChange={handleChange}
                            >
                                <option value="유저">유저</option>
                                <option value="관리자">관리자</option>
                            </select>
                        </div>
                        <div className="label-div">
                            <label htmlFor="profile_image">프로필 이미지</label>
                            <input
                                type="file"
                                id="profile_image"
                                name="profile_image"
                                onChange={handleImageChange}
                            />
                        </div>
                        <div className="modal-actions">
                            <button type="submit">추가하기</button>
                            <button type="button" onClick={onClose}>취소</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserAddModal;
