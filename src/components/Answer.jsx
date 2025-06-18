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

const numberImages = [num0, num1, num2, num3, num4, num5, num6, num7, num8, num9];

function Answer({ onNumberClick }) {
    return (
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px", marginTop: "10px 0", maxWidth: "350px", backgroundColor: '#FFFFFF' }}>
        {numberImages.map((src, i) => (
          <React.Fragment key={i}>
            <img
              src={src}
              alt={`Number ${i}`}
              onClick={() => onNumberClick(i)}
              style={{ width: "50px", height: "75px", cursor: "pointer" }}
            />
            {i === 4 && <div style={{ flexBasis: "100%", height: "0" }} />} {/* line break after the 5th image */}
          </React.Fragment>
        ))}
      </div>
    );
  }
  
  
  export default Answer;