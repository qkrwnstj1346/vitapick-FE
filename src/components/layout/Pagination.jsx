import './Pagination.css';

function Pagination({
    currentPage,
    totalPage,
    onPageChange
}) {

    const pageGroupSize = 5;

    const currentGroup = Math.ceil(currentPage / pageGroupSize);

    const startPage = (currentGroup - 1) * pageGroupSize + 1;

    const endPage = Math.min(
        startPage + pageGroupSize - 1,
        totalPage
    );

    const pageNumbers = [];

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="pagination">

            {/* 이전 */}
            {currentPage > 1 && (
                <button
                    className="pageBtn"
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    이전
                </button>
            )}

            {/* 페이지 번호 */}
            {pageNumbers.map((page) => (
                <button
                    key={page}
                    className={
                        currentPage === page
                            ? 'pageBtn active'
                            : 'pageBtn'
                    }
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </button>
            ))}

            {/* 다음 */}
            {currentPage < totalPage && (
                <button
                    className="pageBtn"
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    다음
                </button>
            )}

        </div>
    );
}

export default Pagination;