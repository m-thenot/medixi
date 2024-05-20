import React from "react";

interface ILoaderProps {
  color?: string;
}

const Loader: React.FC<ILoaderProps> = ({ color = "#fff" }) => {
  return (
    <>
      <div className="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <style jsx>
        {`
          .lds-ring {
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
          }
          .lds-ring div {
            box-sizing: border-box;
            display: block;
            position: absolute;
            width: 16px;
            height: 16px;
            border: 2px solid ${color};
            border-radius: 50%;
            animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
            border-color: ${color} transparent transparent transparent;
          }
          .lds-ring div:nth-child(1) {
            animation-delay: -0.3s;
          }
          .lds-ring div:nth-child(2) {
            animation-delay: -0.15s;
          }
          .lds-ring div:nth-child(3) {
            animation-delay: 0s;
          }
          @keyframes lds-ring {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </>
  );
};

export default Loader;
