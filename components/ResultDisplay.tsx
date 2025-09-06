import React from 'react';
import Spinner from './Spinner';
import Button from './Button';

interface ResultDisplayProps {
  isLoading: boolean;
  error: string | null;
  generatedImage: string | null;
}

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, error, generatedImage }) => {
    if (isLoading) {
        return <Spinner />;
    }

    if (error) {
        return (
            <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2">Đã xảy ra lỗi</h3>
                <p>{error}</p>
            </div>
        );
    }
    
    if (generatedImage) {
        return (
            <div className="flex flex-col items-center gap-4">
                <div className="w-full aspect-square rounded-lg overflow-hidden shadow-lg border border-gray-700">
                    <img src={generatedImage} alt="Bối cảnh được tạo" className="w-full h-full object-contain" />
                </div>
                 <a
                    href={generatedImage}
                    download="hinh-anh-dap-xe.png"
                    className="inline-flex items-center px-6 py-2 bg-gray-600 text-white font-semibold rounded-full shadow-md hover:bg-gray-500 transform hover:scale-105 transition-all duration-300"
                >
                    <DownloadIcon />
                    Tải xuống hình ảnh
                </a>
            </div>
        );
    }

    return (
        <div className="text-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2">Hình ảnh của bạn sẽ xuất hiện ở đây.</p>
        </div>
    );
};

export default ResultDisplay;