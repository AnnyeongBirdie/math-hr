import React from "react";

function Footer() {
    console.log("Footer.jsx component is loaded");
    const year = new Date().getFullYear();
    return (
        <footer style={{fontSize: "12px", color: "gray"}}>
            <p>Copyright ⓒ {year} YourMom</p>
        </footer>
    );
}

export default Footer;