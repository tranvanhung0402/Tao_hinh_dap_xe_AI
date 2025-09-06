import { GoogleGenAI, Modality } from "@google/genai";
import { ImageData } from '../types';

export async function generateScene(
  apiKey: string,
  characterImage: ImageData,
  scenePrompt: string,
  bikeImage?: ImageData,
  sceneImage?: ImageData
): Promise<string | null> {
  if (!apiKey) {
    throw new Error("API Key là bắt buộc.");
  }
  const ai = new GoogleGenAI({ apiKey });

  const model = 'gemini-2.5-flash-image-preview';

  let prompt: string;
  const parts: any[] = [{
    inlineData: {
      data: characterImage.base64,
      mimeType: characterImage.mimeType,
    },
  }];

  if (bikeImage) {
    parts.push({
      inlineData: {
        data: bikeImage.base64,
        mimeType: bikeImage.mimeType,
      },
    });
  }

  if (sceneImage) {
    parts.push({
        inlineData: {
            data: sceneImage.base64,
            mimeType: sceneImage.mimeType,
        },
    });

    const subject = bikeImage ? 'người và xe đạp' : 'người';
    const subjectImages = bikeImage ? 'hình ảnh đầu tiên và thứ hai' : 'hình ảnh đầu tiên';

    prompt = `Bạn là một chuyên gia ghép ảnh AI. Nhiệm vụ của bạn là lấy ${subject} từ ${subjectImages} và ghép họ một cách chân thực vào bối cảnh được cung cấp trong hình ảnh cuối cùng.

    Yêu cầu bổ sung từ người dùng (sử dụng để điều chỉnh ánh sáng, không khí): "${scenePrompt}".
    
    QUY TẮC BẮT BUỘC:
    1. QUAN TRỌNG NHẤT: Giữ nguyên tuyệt đối ${subject} từ ảnh gốc của họ. Coi chúng như một lớp hình ảnh riêng biệt và không được thay đổi, vẽ lại, hay chỉnh sửa bất kỳ chi tiết nào.
    2. Bối cảnh từ hình ảnh cuối cùng cũng phải được giữ nguyên. Chỉ thêm ${subject} vào đó một cách liền mạch.
    3. Sự tích hợp phải trông thật tự nhiên, từ ánh sáng, bóng đổ cho đến phối cảnh. Hãy điều chỉnh ánh sáng trên ${subject} để phù hợp với bối cảnh mới.
    4. Chất lượng đầu ra phải là ưu tiên hàng đầu: sắc nét, chân thực, không có lỗi ghép ảnh.
    5. Chỉ xuất ra hình ảnh cuối cùng. KHÔNG được thêm bất kỳ văn bản nào.`;

  } else {
    if (bikeImage) {
        // Kịch bản với hai hình ảnh riêng biệt và mô tả văn bản
        prompt = `Bạn là một chuyên gia chỉnh sửa ảnh AI. Nhiệm vụ của bạn là tách người từ hình ảnh đầu tiên và chiếc xe đạp từ hình ảnh thứ hai, sau đó ghép chúng một cách liền mạch vào một bối cảnh hoàn toàn mới.
    
        Bối cảnh mới được yêu cầu là: "${scenePrompt}".
        
        QUY TẮC BẮT BUỘC:
        1. QUAN TRỌNG NHẤT: Giữ nguyên tuyệt đối người và xe đạp từ ảnh gốc. Coi chúng như một lớp hình ảnh riêng biệt và không được thay đổi, vẽ lại, hay chỉnh sửa bất kỳ chi tiết nào của chúng. Mọi thay đổi chỉ được áp dụng cho bối cảnh.
        2. Sự tích hợp phải trông thật tự nhiên, từ ánh sáng, bóng đổ cho đến phối cảnh.
        3. Chất lượng đầu ra phải là ưu tiên hàng đầu: siêu thực, sắc nét đến từng chi tiết, không bị nhiễu hay vỡ nét, với chất lượng tương đương ảnh chụp từ máy ảnh chuyên nghiệp.
        4. Chỉ xuất ra hình ảnh cuối cùng. KHÔNG được thêm bất kỳ văn bản nào.`;
    } else {
        // Kịch bản với một hình ảnh duy nhất và mô tả văn bản
        prompt = `Bạn là một chuyên gia chỉnh sửa ảnh AI. Nhiệm vụ của bạn là tách người và xe đạp trong ảnh được cung cấp ra khỏi nền hiện tại và đặt họ vào một bối cảnh hoàn toàn mới.
    
        Bối cảnh mới được yêu cầu là: "${scenePrompt}".
    
        QUY TẮC BẮT BUỘC:
        1. QUAN TRỌNG NHẤT: Giữ nguyên tuyệt đối người và xe đạp từ ảnh gốc. Coi chúng như một lớp hình ảnh riêng biệt và không được thay đổi, vẽ lại, hay chỉnh sửa bất kỳ chi tiết nào của chúng. Mọi thay đổi chỉ được áp dụng cho bối cảnh.
        2. Chỉ thay đổi nền/bối cảnh xung quanh họ.
        3. Sự tích hợp phải trông thật tự nhiên, từ ánh sáng, bóng đổ cho đến phối cảnh.
        4. Chất lượng đầu ra phải là ưu tiên hàng đầu: siêu thực, sắc nét đến từng chi tiết, không bị nhiễu hay vỡ nét, với chất lượng tương đương ảnh chụp từ máy ảnh chuyên nghiệp.
        5. Chỉ xuất ra hình ảnh cuối cùng. KHÔNG được thêm bất kỳ văn bản nào.`;
    }
  }
  
  parts.push({ text: prompt });

  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            return part.inlineData.data;
        }
    }

    return null; // Không tìm thấy hình ảnh nào trong phản hồi

  } catch (error) {
    console.error("Error generating scene with Gemini:", error);
    // Cung cấp thông báo lỗi rõ ràng hơn cho người dùng
    if (error instanceof Error && error.message.includes('API key not valid')) {
        throw new Error("API Key không hợp lệ. Vui lòng kiểm tra lại.");
    }
    throw new Error("Không thể tạo bối cảnh. API đã trả về lỗi.");
  }
}
