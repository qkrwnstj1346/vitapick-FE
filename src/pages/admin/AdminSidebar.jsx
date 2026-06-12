import './Admin.css';

function AdminSidebar({ activeTab, onChangeTab }) {
    const menuItems = [
        { id: 'dashboard', label: '대시보드', mark: 'H' },
        { id: 'members', label: '회원 관리', mark: 'M' },
        { id: 'products', label: '상품 관리', mark: 'P' },
        { id: 'orders', label: '주문 관리', mark: 'O' },
        { id: 'reviews', label: '리뷰 관리', mark: 'R' },
        { id: 'cscenter', label: '고객센터 관리', mark: 'C' }
    ];

    return (
        <aside className="adminSidebar">
            <div className="adminBrand">
                <div className="adminBrandIcon">V</div>
                <div>
                    <h2>Vita Pick</h2>
                    <p>Admin Center</p>
                </div>
            </div>

            <nav className="adminMenu">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        className={
                            activeTab === item.id
                                ? 'adminMenuBtn active'
                                : 'adminMenuBtn'
                        }
                        onClick={() => onChangeTab(item.id)}
                    >
                        <span className="adminMenuMark">{item.mark}</span>
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="adminProfileCard">
                <div className="adminProfileAvatar">VP</div>
                <div>
                    <strong>VitaPick 관리자</strong>
                    <p>admin</p>
                </div>
            </div>
        </aside>
    );
}

export default AdminSidebar;
