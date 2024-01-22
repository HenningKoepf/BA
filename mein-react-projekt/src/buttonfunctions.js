// In buttonFunctions.js

// MyButton.js
import React from 'react';


const MyButton = () => {
    return (
        <button onClick={myButtonClickHandler}>
            I'm a button for future use!
        </button>
    );
};

export default MyButton;



export const myButtonClickHandler = () => {
    alert("Der Button wurde geklickt!");
};
