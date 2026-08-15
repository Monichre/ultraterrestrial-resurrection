"use client"

import type React from "react"

import {useCallback, useRef, useState} from 'react'
import {
  Grid3X3,
  List,
  Download,
  Star,
  Eye,
  SlidersHorizontal,
  Upload,
  FileText,
  ImageIcon,
  Music,
  Video,
  Archive,
  CheckCircle
} from "lucide-react"
import {Input} from '@/components/ui/input'
import {Button} from '@/components/ui/button'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {Progress} from '@/components/ui/progress'
import {Alert, AlertDescription} from '@/components/ui/alert'
import {MagnifyingGlassIcon, Cross2Icon, ExclamationTriangleIcon, ReloadIcon} from '@radix-ui/react-icons'
import {useMindMapUiStore} from '@/features/mindmap/store/mindmap-ui-store'

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
  file?: File
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

export interface AssetLibraryPanelProps {
  onAssetAdded?: (asset: Asset) => void
}

export function AssetLibraryPanel({onAssetAdded}: AssetLibraryPanelProps) {
  const {
    assets: assetsState,
    setAssetCategory,
    setAssetQuery,
    setAssetViewMode,
  } = useMindMapUiStore()
  const {query: searchQuery, viewMode, category: activeCategory} = assetsState
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
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + "" + sizes[i]
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
                file: uploadFile.file,
              }

              setAssets((prev) =>
                prev.map((category) =>
                  category.id === activeCategory ? { ...category, assets: [newAsset, ...category.assets] } : category,
                ),
              )

              onAssetAdded?.(newAsset)

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
  }, [activeCategory, onAssetAdded])

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
      className={`w-[425px] h-auto flex flex-col bg-neutral-800/90 text-white shadow-lg backdrop-blur-md border rounded-2xl transition-colors ${
        isDragOver ? "border-blue-500 bg-blue-500/5" : "border-white/5"
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

      <header className="border-b border-b-[#292f35] p-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-white">Asset Library</h3>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="size-8 hover:bg-white/5">
              <SlidersHorizontal size={16} strokeWidth={2} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setAssetViewMode("grid")}
              className={`size-8 ${viewMode === "grid" ? "bg-white/10" : "hover:bg-white/5"}`}
            >
              <Grid3X3 size={16} strokeWidth={2} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setAssetViewMode("list")}
              className={`size-8 ${viewMode === "list" ? "bg-white/10" : "hover:bg-white/5"}`}
            >
              <List size={16} strokeWidth={2} />
            </Button>
          </div>
        </div>

        <div className="relative">
          <MagnifyingGlassIcon className="absolute top-1/2 left-3 -translate-y-1/2 size-4 text-neutral-400" strokeWidth={2} />
          <Input
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setAssetQuery(e.target.value)}
            className="w-full h-8 pl-8 pr-8 text-sm bg-neutral-900 border-[#292f35] rounded-xl focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
          />
          {searchQuery && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setAssetQuery("")}
              className="absolute top-1/2 right-2 -translate-y-1/2 size-5 hover:bg-white/10"
            >
              <Cross2Icon size={12} strokeWidth={2} />
            </Button>
          )}
        </div>
      </header>

      <Tabs value={activeCategory} onValueChange={setAssetCategory} className="flex-1">
        <TabsList className="w-full bg-transparent p-2 h-auto gap-1">
          {assets.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="text-sm font-medium h-8 px-3 data-[state=active]:bg-white/10 data-[state=active]:text-white text-[#8c8c8c] hover:bg-white/5 hover:text-white"
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="p-3 overflow-y-auto max-h-96">
          {/* Upload Error Alert */}
          {uploadError && (
            <Alert className="mb-4 border-red-500/20 bg-red-500/10">
              <ExclamationTriangleIcon className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-400">{uploadError}</AlertDescription>
            </Alert>
          )}

          {/* Upload Progress */}
          {uploadFiles.length > 0 && (
            <div className="mb-4 space-y-2">
              <h4 className="text-sm font-medium text-neutral-400">Uploading Files</h4>
              {uploadFiles.map((uploadFile) => (
                <div key={uploadFile.id} className="bg-neutral-700/30 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {uploadFile.status === "uploading" && (
                        <ReloadIcon size={14} className="animate-spin text-blue-400" />
                      )}
                      {uploadFile.status === "completed" && <CheckCircle size={14} className="text-green-400" />}
                      {uploadFile.status === "error" && <ExclamationTriangleIcon size={14} className="text-red-400" />}
                      <span className="text-sm font-medium truncate">{uploadFile.file.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-neutral-400">{formatFileSize(uploadFile.file.size)}</span>
                      {uploadFile.status !== "completed" && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeUploadFile(uploadFile.id)}
                          className="size-5 hover:bg-white/10"
                        >
                          <Cross2Icon size={10} strokeWidth={2} />
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
                        : "border-neutral-600 bg-neutral-700/30 hover:bg-neutral-700/50 hover:border-neutral-500"
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
                    className="group aspect-square bg-neutral-700/30 rounded-xl p-3 hover:bg-neutral-700/50 transition-colors cursor-pointer border border-white/5 flex flex-col"
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
                      isDragOver ? "border-blue-500 bg-blue-500/10" : "border-neutral-600 hover:bg-neutral-700/30"
                    }`}
                  >
                    <div className="w-8 h-8 bg-neutral-700/50 rounded flex items-center justify-center">
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
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-700/30 transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 bg-neutral-700/50 rounded flex items-center justify-center">
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
                      <Button size="icon" variant="ghost" className="size-7 hover:bg-white/10">
                        <Eye size={12} strokeWidth={2} />
                      </Button>
                      <Button size="icon" variant="ghost" className="size-7 hover:bg-white/10">
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
