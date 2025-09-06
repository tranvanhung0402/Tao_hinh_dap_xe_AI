import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-5xl md:text-6xl font-extrabold">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-500">
          Tạo hình ảnh đạp xe của bạn
        </span>
      </h1>
      <p className="mt-4 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
        Làm sống động nhân vật của bạn! Tải lên hình ảnh của bạn và xe đạp, mô tả bối cảnh, và để AI tạo ra một khung cảnh mới tuyệt đẹp.
      </p>
    </div>
  );
};

export default Hero;