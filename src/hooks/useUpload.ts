// hooks/useUpload.ts
import { useState } from 'react';

export const useUpload = () => {
    const [isUploading, setIsUploading] = useState(false);

    const uploadImage = async (file: File): Promise<string> => {
        if (!file) throw new Error('No file provided');

        setIsUploading(true);

        const formData = new FormData();
        formData.append('file', file); // ← Tên field có thể là 'file' hoặc 'image', check với BE

        try {
            const response = await fetch('http://localhost:8080/api/upload', {
                method: 'POST',
                body: formData,
                // Nếu cần authorization
                // headers: {
                //   'Authorization': `Bearer ${token}`
                // }
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();

            // Check cấu trúc response của BE
            // Có thể là: { url: "...", imageUrl: "...", data: "...", etc }
            return data.url || data.imageUrl || data.data || data;

        } catch (error) {
            console.error('Upload error:', error);
            throw new Error('Không thể upload ảnh');
        } finally {
            setIsUploading(false);
        }
    };

    return { uploadImage, isUploading };
};