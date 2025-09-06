import React, { useState, useEffect } from 'react';
import { ImageFile, ImageData } from './types';
import { generateScene } from './services/geminiService';
import Hero from './components/Hero';
import ImageUploader from './components/ImageUploader';
import Button from './components/Button';
import ResultDisplay from './components/ResultDisplay';
import ApiKeyManager from './components/ApiKeyManager';

const addWatermark = (base64Image: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error("Không thể lấy context canvas."));
      }

      // Draw the original image
      ctx.drawImage(img, 0, 0);

      // Configure watermark text
      const watermarkText = "Hội xe đạp thể thao Biên Hòa";
      const fontSize = Math.max(16, Math.floor(img.width / 45));
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      ctx.shadowBlur = 5;

      const padding = fontSize;
      ctx.fillText(watermarkText, canvas.width - padding, canvas.height - padding);
      
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => reject(new Error("Không thể tải hình ảnh để thêm watermark."));
    img.src = `data:image/png;base64,${base64Image}`;
  });
};


const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [characterImage, setCharacterImage] = useState<ImageFile | null>(null);
  const [bikeImage, setBikeImage] = useState<ImageFile | null>(null);
  const [sceneImage, setSceneImage] = useState<ImageFile | null>(null);
  const [scenePrompt, setScenePrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini-api-key');
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleApiKeySave = (key: string) => {
    localStorage.setItem('gemini-api-key', key);
    setApiKey(key);
  };

  const fileToImageData = (file: File): Promise<ImageData> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        if (base64String) {
          resolve({ base64: base64String, mimeType: file.type });
        } else {
          reject(new Error("Không thể chuyển đổi tệp thành base64."));
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = (setter: React.Dispatch<React.SetStateAction<ImageFile | null>>) => (file: File | null) => {
    if (file) {
      setter({ file, previewUrl: URL.createObjectURL(file) });
    } else {
      setter(null);
    }
  };

  const handleGenerate = async () => {
    if (!apiKey) {
      setError('Vui lòng nhập Google AI API Key của bạn để tiếp tục.');
      return;
    }
    if (!characterImage) {
      setError('Vui lòng tải lên ảnh nhân vật.');
      return;
    }
    if (!scenePrompt.trim() && !sceneImage) {
        setError('Vui lòng mô tả bối cảnh hoặc tải lên ảnh nền.');
        return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const characterImageData = await fileToImageData(characterImage.file);
      const bikeImageData = bikeImage ? await fileToImageData(bikeImage.file) : undefined;
      const sceneImageData = sceneImage ? await fileToImageData(sceneImage.file) : undefined;
      
      const resultBase64 = await generateScene(apiKey, characterImageData, scenePrompt, bikeImageData, sceneImageData);
      
      if (resultBase64) {
        const watermarkedImage = await addWatermark(resultBase64);
        setGeneratedImage(watermarkedImage);
      } else {
        setError('AI không thể tạo hình ảnh. Vui lòng thử lại với một lời nhắc hoặc hình ảnh khác.');
      }
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi không xác định trong quá trình tạo ảnh.');
    } finally {
      setIsLoading(false);
    }
  };

  const isGenerateDisabled = !characterImage || (!scenePrompt.trim() && !sceneImage) || isLoading || !apiKey;

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center">
      <main className="w-full max-w-5xl mx-auto">
        <Hero />
        
        <div className="my-8">
            <ApiKeyManager initialKey={apiKey} onSave={handleApiKeySave} />
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Input Section */}
          <div className="space-y-6 bg-gray-800/50 p-6 rounded-2xl shadow-lg">
            <ImageUploader 
              id="character-upload"
              label="1. Tải lên ảnh nhân vật (có hoặc không có xe đạp)"
              onFileSelect={handleFileSelect(setCharacterImage)}
              previewUrl={characterImage?.previewUrl}
            />
            
            <div>
              <ImageUploader
                id="bike-upload"
                label="2. Tải lên ảnh xe đạp (Tùy chọn)"
                onFileSelect={handleFileSelect(setBikeImage)}
                previewUrl={bikeImage?.previewUrl}
              />
              <p className="text-xs text-gray-500 mt-1">Chỉ tải lên ảnh này nếu ảnh đầu tiên của bạn KHÔNG có xe đạp.</p>
            </div>

            <div>
              <label htmlFor="scene-prompt" className="block text-sm font-medium text-gray-300 mb-2">3. Cung cấp bối cảnh</label>
              <textarea
                id="scene-prompt"
                rows={3}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                placeholder="Mô tả bối cảnh bằng văn bản..."
                value={scenePrompt}
                onChange={(e) => setScenePrompt(e.target.value)}
              />
               <p className="text-center my-2 text-sm text-gray-500">- HOẶC -</p>
               <ImageUploader 
                id="scene-upload"
                label="Tải lên ảnh bối cảnh"
                onFileSelect={handleFileSelect(setSceneImage)}
                previewUrl={sceneImage?.previewUrl}
              />
               <p className="text-xs text-gray-500 mt-1">Cung cấp mô tả hoặc tải lên hình ảnh. Nếu có cả hai, hình ảnh sẽ được ưu tiên.</p>
            </div>

            <div className="text-center">
              <Button onClick={handleGenerate} disabled={isGenerateDisabled}>
                {isLoading ? 'Đang tạo...' : 'Tạo bối cảnh của tôi'}
              </Button>
            </div>
          </div>

          {/* Output Section */}
          <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg flex items-center justify-center h-full min-h-[400px] md:min-h-0">
             <ResultDisplay 
                isLoading={isLoading} 
                error={error} 
                generatedImage={generatedImage}
             />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
