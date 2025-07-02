import React from "react";

import num0 from "../assets/images/num_card_0.png";
import num1 from "../assets/images/num_card_1.png";
import num2 from "../assets/images/num_card_2.png";
import num3 from "../assets/images/num_card_3.png";
import num4 from "../assets/images/num_card_4.png";
import num5 from "../assets/images/num_card_5.png";
import num6 from "../assets/images/num_card_6.png";
import num7 from "../assets/images/num_card_7.png";
import num8 from "../assets/images/num_card_8.png";
import num9 from "../assets/images/num_card_9.png";
import decimalCard from "../assets/images/decimal_card.png";
import negativeCard from "../assets/images/negative_card.png";

const numberImages = [num0, num1, num2, num3, num4, num5, num6, num7, num8, num9];
const specialCards = [
  { src: decimalCard, alt: "Decimal", value: "." },
  { src: negativeCard, alt: "Negative", value: "-" }
];

function Answer({ onNumberClick }) {
    const handleSpecialClick = (value) => {
        // Handle decimal point
        if (value === ".") {
            onNumberClick(".");
        }
        // Handle negative sign
        else if (value === "-") {
            onNumberClick("-");
        }
    };

    return (
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px", marginTop: "10px 0", maxWidth: "350px", backgroundColor: '#FFFFFF' }}>
        {/* Render number cards 0-9 */}
        {numberImages.map((src, i) => (
          <React.Fragment key={`num-${i}`}>
            <img
              src={src}
              alt={`Number ${i}`}
              onClick={() => onNumberClick(i)}
              style={{ width: "50px", height: "75px", cursor: "pointer" }}
            />
            {i === 5 && <div style={{ flexBasis: "100%", height: "0" }} />} {/* line break after the 6th image (index 5) */}
          </React.Fragment>
        ))}
        
        {/* Render special cards (decimal and negative) */}
        {specialCards.map((card, i) => (
          <img
            key={`special-${i}`}
            src={card.src}
            alt={card.alt}
            onClick={() => handleSpecialClick(card.value)}
            style={{ width: "50px", height: "75px", cursor: "pointer" }}
          />
        ))}
      </div>
    );
}

export default Answer;