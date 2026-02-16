"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import {
  Search,
  Grid3X3,
  List,
  Download,
  Star,
  Eye,
  SlidersHorizontal,
  X,
  Upload,
  FileText,
  ImageIcon,
  Music,
  Video,
  Archive,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Asset {
  id: string
  name: string
  type: string
  size: string
  modified: string
  popular?: boolean
  uploading?: boolean
  uploadProgress?: number
  uploadError?: string
}

interface UploadFile {
  id: string
  file: File
  progress: number
  status: "uploading" | "completed" | "error"
  error?: string
}

const ASSET_CATEGORIES = [
  {
    id: "my-files",
    name: "My Files",
    assets: [
      { id: "1", name: "Research Notes", type: "document", size: "2.4 MB", modified: "2 hours ago" },
      { id: "2", name: "Network Graph", type: "image", size: "1.8 MB", modified: "1 day ago" },
      { id: "3", name: "Timeline Data", type: "data", size: "856 KB", modified: "3 days ago" },
    ],
  },
  {
    id: "saved-blocks",
    name: "Saved Blocks",
    assets: [
      { id: "4", name: "UFO Sighting Block", type: "block", size: "1.2 MB", modified: "1 week ago" },
      { id: "5", name: "Government Agency", type: "block", size: "945 KB", modified: "2 weeks ago" },
    ],
  },
  {
    id: "library",
    name: "Asset Library",
    assets: [
      {
        id: "6",
        name: "Official Documents",
        type: "document",
        size: "15.2 MB",
        modified: "1 month ago",
        popular: true,
      },
      { id: "7", name: "Witness Photos", type: "image", size: "8.7 MB", modified: "2 months ago", popular: true },
      { id: "8", name: "Audio Recordings", type: "audio", size: "24.1 MB", modified: "3 months ago" },
    ],
  },
]

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
const ALLOWED_TYPES = {
  "image/*": ["jpg", "jpeg", "png", "gif", "webp", "svg"],
  "application/pdf": ["pdf"],
  "text/*": ["txt", "md", "csv", "json"],
  "audio/*": ["mp3", "wav", "ogg", "m4a"],
  "video/*": ["mp4", "webm", "mov", "avi"],
  "application/zip": ["zip"],
  "application/x-rar-compressed": ["rar"],
}

export function AssetLibraryPanel() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [activeCategory, setActiveCategory] = useState("my-files")
  const [assets, setAssets] = useState(ASSET_CATEGORIES)
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const currentAssets = assets.find((cat) => cat.id === activeCategory)?.assets || []
  const filteredAssets = currentAssets.filter((asset) => asset.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const getAssetIcon = (type: string, size = 16) => {
    const iconProps = { size, strokeWidth: 2, className: "text-neutral-400" }

    switch (type) {
      case "document":
      case "pdf":
        return <FileText {...iconProps} />
      case "image":
        return <ImageIcon {...iconProps} />
      case "audio":
        return <Music {...iconProps} />
      case "video":
        return <Video {...iconProps} />
      case "archive":
        return <Archive {...iconProps} />
      case "data":
      case "block":
        return <FileText {...iconProps} />
      default:
        return <FileText {...iconProps} />
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileType = (file: File): string => {
    const extension = file.name.split(".").pop()?.toLowerCase()

    if (file.type.startsWith("image/")) return "image"
    if (file.type.startsWith("audio/")) return "audio"
    if (file.type.startsWith("video/")) return "video"
    if (file.type === "application/pdf") return "pdf"
    if (["zip", "rar", "7z"].includes(extension || "")) return "archive"
    if (["json", "csv", "xml"].includes(extension || "")) return "data"
    return "document"
  }

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds ${formatFileSize(MAX_FILE_SIZE)} limit`
    }

    const isValidType = Object.keys(ALLOWED_TYPES).some((type) => {
      if (type.endsWith("/*")) {
        return file.type.startsWith(type.slice(0, -1))
      }
      return file.type === type
    })

    if (!isValidType) {
      return "File type not supported"
    }

    return null
  }

  const simulateUpload = (uploadFile: UploadFile): Promise<void> => {
    return new Promise((resolve, reject) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 15

        if (progress >= 100) {
          progress = 100
          clearInterval(interval)

          // Simulate occasional upload failures
          if (Math.random() < 0.1) {
            setUploadFiles((prev) =>
              prev.map((f) =>
                f.id === uploadFile.id ? { ...f, status: "error", error: "Upload failed. Please try again." } : f,
              ),
            )
            reject(new Error("Upload failed"))
          } else {
            setUploadFiles((prev) =>
              prev.map((f) => (f.id === uploadFile.id ? { ...f, progress: 100, status: "completed" } : f)),
            )

            // Add to assets after successful upload
            setTimeout(() => {
              const newAsset: Asset = {
                id: Date.now().toString(),
                name: uploadFile.file.name,
                type: getFileType(uploadFile.file),
                size: formatFileSize(uploadFile.file.size),
                modified: "Just now",
              }

              setAssets((prev) =>
                prev.map((category) =>
                  category.id === activeCategory ? { ...category, assets: [newAsset, ...category.assets] } : category,
                ),
              )

              // Remove from upload list after a delay
              setTimeout(() => {
                setUploadFiles((prev) => prev.filter((f) => f.id !== uploadFile.id))
              }, 2000)
            }, 500)

            resolve()
          }
        } else {
          setUploadFiles((prev) => prev.map((f) => (f.id === uploadFile.id ? { ...f, progress } : f)))
        }
      }, 200)
    })
  }

  const handleFileUpload = useCallback(async (files: FileList | File[]) => {
    setUploadError(null)
    const fileArray = Array.from(files)

    for (const file of fileArray) {
      const validationError = validateFile(file)

      if (validationError) {
        setUploadError(validationError)
        continue
      }

      const uploadFile: UploadFile = {
        id: `${Date.now()}-${Math.random()}`,
        file,
        progress: 0,
        status: "uploading",
      }

      setUploadFiles((prev) => [...prev, uploadFile])

      try {
        await simulateUpload(uploadFile)
      } catch (error) {
        console.error("Upload failed:", error)
      }
    }
  }, [])

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      handleFileUpload(files)
    }
    // Reset input value to allow uploading the same file again
    event.target.value = ""
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragOver(false)

      const files = e.dataTransfer.files
      if (files && files.length > 0) {
        handleFileUpload(files)
      }
    },
    [handleFileUpload],
  )

  const removeUploadFile = (id: string) => {
    setUploadFiles((prev) => prev.filter((f) => f.id !== id))
  }

  return (
    <div
      className={`w-[420px] h-auto flex flex-col bg-neutral-900 text-white shadow-xl border rounded-2xl overflow-hidden transition-colors ${
        isDragOver ? "border-blue-500 bg-blue-500/5" : "border-neutral-800"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileInputChange}
        accept={Object.keys(ALLOWED_TYPES).join(",")}
      />

      <header className="border-b border-neutral-800 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-medium text-white">Asset Library</h3>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="size-8 hover:bg-neutral-800">
              <SlidersHorizontal size={16} strokeWidth={2} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("grid")}
              className={`size-8 ${viewMode === "grid" ? "bg-neutral-700" : "hover:bg-neutral-800"}`}
            >
              <Grid3X3 size={16} strokeWidth={2} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("list")}
              className={`size-8 ${viewMode === "list" ? "bg-neutral-700" : "hover:bg-neutral-800"}`}
            >
              <List size={16} strokeWidth={2} />
            </Button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute top-1/2 left-3 -translate-y-1/2 size-4 text-neutral-400" strokeWidth={2} />
          <Input
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-9 text-sm bg-neutral-800 border-neutral-700 rounded-lg focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0 placeholder:text-neutral-500"
          />
          {searchQuery && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setSearchQuery("")}
              className="absolute top-1/2 right-2 -translate-y-1/2 size-5 hover:bg-neutral-700"
            >
              <X size={12} strokeWidth={2} />
            </Button>
          )}
        </div>
      </header>

      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="flex-1">
        <TabsList className="w-full bg-transparent p-3 h-auto gap-1 justify-start">
          {assets.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="text-sm font-medium h-8 px-4 data-[state=active]:bg-neutral-700 data-[state=active]:text-white text-neutral-400 hover:bg-neutral-800 hover:text-white rounded-md"
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="p-4 overflow-y-auto max-h-96">
          {/* Upload Error Alert */}
          {uploadError && (
            <Alert className="mb-4 border-red-500/20 bg-red-500/10">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-400">{uploadError}</AlertDescription>
            </Alert>
          )}

          {/* Upload Progress */}
          {uploadFiles.length > 0 && (
            <div className="mb-4 space-y-2">
              <h4 className="text-sm font-medium text-neutral-300">Uploading Files</h4>
              {uploadFiles.map((uploadFile) => (
                <div key={uploadFile.id} className="bg-neutral-800 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {uploadFile.status === "uploading" && (
                        <Loader2 size={14} className="animate-spin text-blue-400" />
                      )}
                      {uploadFile.status === "completed" && <CheckCircle size={14} className="text-green-400" />}
                      {uploadFile.status === "error" && <AlertCircle size={14} className="text-red-400" />}
                      <span className="text-sm font-medium truncate">{uploadFile.file.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-neutral-400">{formatFileSize(uploadFile.file.size)}</span>
                      {uploadFile.status !== "completed" && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeUploadFile(uploadFile.id)}
                          className="size-5 hover:bg-neutral-700"
                        >
                          <X size={10} strokeWidth={2} />
                        </Button>
                      )}
                    </div>
                  </div>
                  {uploadFile.status === "uploading" && <Progress value={uploadFile.progress} className="h-1" />}
                  {uploadFile.status === "error" && uploadFile.error && (
                    <p className="text-xs text-red-400 mt-1">{uploadFile.error}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          <TabsContent value={activeCategory} className="mt-0">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-3 gap-3">
                {activeCategory === "my-files" && (
                  <div
                    onClick={handleFileSelect}
                    className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-colors cursor-pointer ${
                      isDragOver
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-neutral-600 bg-neutral-800 hover:bg-neutral-750 hover:border-neutral-500"
                    }`}
                  >
                    <Upload size={20} className="text-neutral-400 mb-2" strokeWidth={2} />
                    <span className="text-xs text-neutral-400 font-medium text-center px-2">
                      {isDragOver ? "Drop files here" : "Upload"}
                    </span>
                  </div>
                )}
                {filteredAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="group aspect-square bg-neutral-800 rounded-xl p-3 hover:bg-neutral-750 transition-colors cursor-pointer border border-neutral-700 flex flex-col"
                  >
                    <div className="flex-1 flex items-center justify-center mb-2">{getAssetIcon(asset.type, 24)}</div>
                    <div className="space-y-1">
                      <div className="flex items-start justify-between">
                        <h4 className="text-xs font-medium text-white truncate">{asset.name}</h4>
                        {asset.popular && (
                          <Star size={10} className="text-yellow-400 fill-yellow-400 ml-1" strokeWidth={2} />
                        )}
                      </div>
                      <p className="text-xs text-neutral-400">{asset.size}</p>
                      <p className="text-xs text-neutral-500">{asset.modified}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {activeCategory === "my-files" && (
                  <div
                    onClick={handleFileSelect}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer border border-dashed ${
                      isDragOver ? "border-blue-500 bg-blue-500/10" : "border-neutral-600 hover:bg-neutral-800"
                    }`}
                  >
                    <div className="w-8 h-8 bg-neutral-700 rounded flex items-center justify-center">
                      <Upload size={14} className="text-neutral-400" strokeWidth={2} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-neutral-400">
                        {isDragOver ? "Drop files to upload" : "Upload new asset"}
                      </h4>
                      <p className="text-xs text-neutral-500">
                        {isDragOver ? "Release to upload files" : "Drag & drop or click to browse"}
                      </p>
                    </div>
                  </div>
                )}
                {filteredAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 bg-neutral-700 rounded flex items-center justify-center">
                      {getAssetIcon(asset.type, 16)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium text-white truncate">{asset.name}</h4>
                        {asset.popular && (
                          <Star size={12} className="text-yellow-400 fill-yellow-400" strokeWidth={2} />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-neutral-400">
                        <span>{asset.size}</span>
                        <span>•</span>
                        <span>{asset.modified}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="ghost" className="size-7 hover:bg-neutral-700">
                        <Eye size={12} strokeWidth={2} />
                      </Button>
                      <Button size="icon" variant="ghost" className="size-7 hover:bg-neutral-700">
                        <Download size={12} strokeWidth={2} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>

      {/* Drag Overlay */}
      {isDragOver && (
        <div className="absolute inset-0 bg-blue-500/10 border-2 border-dashed border-blue-500 rounded-2xl flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <Upload size={32} className="text-blue-400 mx-auto mb-2" strokeWidth={2} />
            <p className="text-blue-400 font-medium">Drop files to upload</p>
            <p className="text-blue-400/70 text-sm">Supports images, documents, audio, and more</p>
          </div>
        </div>
      )}
    </div>
  )
}
