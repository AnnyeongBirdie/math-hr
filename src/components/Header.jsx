import React from "react";

function Header({ score, correct, total, feedback }) {
    console.log("Header.jsx component is loaded");
    return (
        <div style={{fontSize: "18px", color: '#636363'}}>
             <h2>{'YOUR SCORE:'} {score}% ({correct}/{total})</h2>
        </div>
    )
}

export default Header;