import React from "react";
import ReactDom from "react-dom/client";
import Header from "./components/Header.jsx";
import Game from "./components/Game.jsx";
import Footer from "./components/Footer.jsx";

console.log("App.jsx is loaded");

function App() {return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <Game />
        <Footer />
    </div>
)}

export default App;

