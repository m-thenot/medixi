import React from "react";

interface IPageLoaderProps {
  fullScreen?: boolean;
  customHeight?: string;
}

const PageLoader: React.FC<IPageLoaderProps> = ({
  fullScreen = false,
  customHeight
}) => {
  const dnaCount = 16;
  const dnaItems = Array.from({ length: dnaCount }, (_, i) => i + 1);

  return (
    <div
      className={`flex justify-center items-center ${
        fullScreen ? "h-screen" : "h-full"
      } bg-black`}
      {...(customHeight ? { style: { height: customHeight } } : {})}
    >
      <div className="relative flex justify-center items-center transform rotate-z-[-20deg]">
        {dnaItems.map((_, index) => (
          <div
            key={index}
            className="relative mx-2 w-px h-24 border border-dotted border-[#e7e7e7] bg-transparent shadow-[0_0_15px_#e7e7e7]"
            style={{
              animation: `rotate 3s linear infinite`,
              animationDelay: `${-0.15 * index}s`
            }}
          >
            <div className="absolute top-[-2px] left-[-5px] w-2.5 h-2.5 bg-[#1cffb3] rounded-full shadow-[0_0_15px_#1cffb3]"></div>
            <div className="absolute bottom-[-2px] left-[-5px] w-2.5 h-2.5 bg-[#0ff] rounded-full shadow-[0_0_12px_#0ff]"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageLoader;
