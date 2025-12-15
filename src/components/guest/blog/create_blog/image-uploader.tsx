"use client"

import type React from "react"
import { useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Upload, X } from "lucide-react"
import { toast } from "sonner"

interface ImageUploaderProps {
    coverImage: string | null
    onImageChange: (image: string | null) => void
}

export default function ImageUploader({ coverImage, onImageChange }: ImageUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isDragging, setIsDragging] = useState(false)

    const handleFileSelect = (file: File) => {
        if (!file.type.startsWith("image/")) {
            toast.error("Vui lòng chọn file ảnh")
            return
        }

        // Kiểm tra kích thước (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Ảnh không được vượt quá 5MB")
            return
        }

        // CHỈ tạo preview base64, KHÔNG upload ngay
        const reader = new FileReader()
        reader.onload = (e) => {
            onImageChange(e.target?.result as string)
        }
        reader.readAsDataURL(file)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files[0]
        if (file) {
            handleFileSelect(file)
        }
    }

    return (
        <Card className="bg-white shadow-sm overflow-hidden">
            {coverImage ? (
                <div className="relative">
                    <img
                        src={coverImage}
                        alt="Cover"
                        className="w-full h-80 object-cover"
                    />
                    <button
                        onClick={() => onImageChange(null)}
                        className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/70 rounded-lg text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-3 right-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium transition-colors gap-2 flex items-center"
                    >
                        <Upload className="w-4 h-4" />
                        Thay đổi
                    </button>
                </div>
            ) : (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-12 text-center cursor-pointer transition-all ${isDragging
                        ? "bg-blue-50 border-2 border-blue-400"
                        : "border-2 border-dashed border-slate-200 hover:border-slate-300"
                        }`}
                >
                    <div className="flex justify-center mb-3">
                        <div className="p-3 bg-slate-100 rounded-lg">
                            <Upload className="w-6 h-6 text-slate-600" />
                        </div>
                    </div>
                    <p className="text-sm text-slate-500">
                        Kéo thả ảnh vào đây, hoặc nhấp để chọn
                    </p>
                    <p className="text-xs text-slate-400 mt-2">PNG, JPG tối đa 5MB</p>
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileSelect(file)
                }}
                className="hidden"
            />
        </Card>
    )
}