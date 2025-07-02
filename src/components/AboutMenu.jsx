import React, { useState } from "react";

function AboutMenu({ aboutIcon }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    return (
        <>
            {/* About Button */}
            <div style={{
                position: 'fixed',
                top: '20px',
                left: '20px',
                zIndex: 1000
            }}>
                <button
                    onClick={toggleMenu}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0'
                    }}
                >
                    <img 
                        src={aboutIcon} 
                        alt="About" 
                        style={{ 
                            width: '40px', 
                            height: '40px',
                            transition: 'transform 0.2s',
                            transform: isOpen ? 'scale(1.1)' : 'scale(1)'
                        }} 
                    />
                </button>
            </div>

            {/* Modal Overlay */}
            {isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1001
                    }}
                    onClick={closeMenu}
                >
                    {/* Modal Content */}
                    <div
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '15px',
                            padding: '30px',
                            maxWidth: '500px',
                            width: '90%',
                            maxHeight: '80%',
                            overflowY: 'auto',
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                            fontFamily: 'Arial, sans-serif',
                            position: 'relative',
                            animation: 'slideIn 0.3s ease-out'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeMenu}
                            style={{
                                position: 'absolute',
                                top: '15px',
                                right: '20px',
                                background: 'none',
                                border: 'none',
                                fontSize: '24px',
                                cursor: 'pointer',
                                color: '#666',
                                fontWeight: 'bold'
                            }}
                        >
                            ×
                        </button>

                        {/* Content */}
                        <div>
                            <h2 style={{ 
                                color: '#2c3e50', 
                                marginBottom: '20px',
                                textAlign: 'center',
                                fontSize: '24px'
                            }}>
                                🧮 게임 방법
                            </h2>

                            <div style={{ lineHeight: '1.6', color: '#333' }}>
                                <h3 style={{ color: '#3498db', marginBottom: '10px' }}>📚 기본 규칙:</h3>
                                <ul style={{ marginBottom: '20px', paddingLeft: '20px' }}>
                                    <li>화면에 나타나는 수학 문제를 풀어보세요</li>
                                    <li>숫자 버튼을 눌러 답을 입력하세요</li>
                                    <li>입력 버튼(Enter)을 눌러 답을 제출하세요</li>
                                    <li>틀렸다면 다시 시도할 수 있어요!</li>
                                </ul>

                                <h3 style={{ color: '#e74c3c', marginBottom: '10px' }}>🎯 연산 종류:</h3>
                                <ul style={{ marginBottom: '20px', paddingLeft: '20px' }}>
                                    <li><strong>➕ 덧셈:</strong> 두 숫자를 더해보세요</li>
                                    <li><strong>➖ 뺄셈:</strong> 첫 번째에서 두 번째 숫자를 빼보세요</li>
                                    <li><strong>✖️ 곱셈:</strong> 두 숫자를 곱해보세요</li>
                                    <li><strong>➗ 나눗셈:</strong> 첫 번째를 두 번째로 나누세요</li>
                                </ul>

                                <h3 style={{ color: '#27ae60', marginBottom: '10px' }}>🎮 버튼 설명:</h3>
                                <ul style={{ marginBottom: '20px', paddingLeft: '20px' }}>
                                    <li><strong>Delete:</strong> 마지막 입력 숫자 지우기</li>
                                    <li><strong>Enter:</strong> 답 제출하기</li>
                                    <li><strong>Settings (⚙️):</strong> 새 문제 생성 및 점수 초기화</li>
                                </ul>

                                <h3 style={{ color: '#f39c12', marginBottom: '10px' }}>🏆 점수 시스템:</h3>
                                <ul style={{ paddingLeft: '20px' }}>
                                    <li>정답을 맞히면 점수가 올라가요</li>
                                    <li>틀려도 괜찮아요 - 다시 도전하세요!</li>
                                    <li>정답률이 화면 상단에 표시됩니다</li>
                                </ul>
                            </div>

                            <div style={{ 
                                textAlign: 'center', 
                                marginTop: '25px',
                                padding: '15px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '8px'
                            }}>
                                <p style={{ 
                                    margin: 0, 
                                    color: '#666',
                                    fontStyle: 'italic'
                                }}>
                                    🌟 즐겁게 수학을 배워보세요! 🌟
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>
                {`
                    @keyframes slideIn {
                        from {
                            opacity: 0;
                            transform: translateY(-20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `}
            </style>
        </>
    );
}

export default AboutMenu;