"use client"

import type React from "react"

import { useState } from "react"
import { Upload, FileText, File, Download, Trash2, Eye, Search, MoreVertical, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface FileItem {
  id: string
  name: string
  type: string
  size: string
  uploadDate: string
  lastModified: string
  status: "processing" | "ready" | "error"
}

const initialFiles: FileItem[] = [
  {
    id: "1",
    name: "Product Requirements.pdf",
    type: "PDF",
    size: "2.4 MB",
    uploadDate: "2024-01-15",
    lastModified: "Jan 15, 2024",
    status: "ready",
  },
  {
    id: "2",
    name: "Meeting Notes.txt",
    type: "TXT",
    size: "45 KB",
    uploadDate: "2024-01-14",
    lastModified: "Jan 14, 2024",
    status: "ready",
  },
  {
    id: "3",
    name: "Research Article.pdf",
    type: "PDF",
    size: "1.8 MB",
    uploadDate: "2024-01-13",
    lastModified: "Jan 13, 2024",
    status: "processing",
  },
  {
    id: "4",
    name: "Team Handbook.docx",
    type: "DOCX",
    size: "892 KB",
    uploadDate: "2024-01-12",
    lastModified: "Jan 12, 2024",
    status: "ready",
  },
  {
    id: "5",
    name: "Budget Spreadsheet.xlsx",
    type: "XLSX",
    size: "156 KB",
    uploadDate: "2024-01-11",
    lastModified: "Jan 11, 2024",
    status: "ready",
  },
]

export default function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>(initialFiles)
  const [searchQuery, setSearchQuery] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const { toast } = useToast()

  const filteredFiles = files.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFiles = (fileList: FileList) => {
    Array.from(fileList).forEach((file) => {
      const newFile: FileItem = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: file.name.split(".").pop()?.toUpperCase() || "UNKNOWN",
        size: formatFileSize(file.size),
        uploadDate: new Date().toISOString().split("T")[0],
        lastModified: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        status: "processing",
      }

      setFiles((prev) => [newFile, ...prev])

      // Simulate processing
      setTimeout(() => {
        setFiles((prev) => prev.map((f) => (f.id === newFile.id ? { ...f, status: "ready" as const } : f)))
      }, 3000)
    })

    toast({
      title: "Files Uploaded",
      description: `${fileList.length} file(s) are being processed.`,
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type === "PDF") return FileText
    return File
  }

  const deleteFile = (fileId: string) => {
    setFiles(files.filter((f) => f.id !== fileId))
    toast({
      title: "File Deleted",
      description: "File has been removed from your vault.",
      variant: "destructive",
    })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-medium text-gray-900">Files</h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search files"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-80 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <input
              type="file"
              multiple
              accept=".pdf,.txt,.doc,.docx,.xlsx,.xls"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                <span>
                  <Plus className="h-4 w-4 mr-2" />
                  Upload
                </span>
              </Button>
            </label>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      {files.length === 0 && !searchQuery && (
        <div
          className={`m-6 border-2 border-dashed rounded-lg p-16 text-center transition-colors ${
            dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Drop files here to upload</h3>
          <p className="text-gray-600 mb-4">or click the Upload button above</p>
          <p className="text-sm text-gray-500">Supports PDF, TXT, DOC, DOCX, XLS, XLSX</p>
        </div>
      )}

      {/* Files List */}
      {filteredFiles.length > 0 && (
        <div className="px-6 py-4">
          <div className="space-y-1">
            {filteredFiles.map((file) => {
              const FileIcon = getFileIcon(file.type)

              return (
                <div
                  key={file.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 group cursor-pointer"
                >
                  <FileIcon className="h-6 w-6 text-blue-600 flex-shrink-0" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{file.name}</h3>
                      {file.status === "processing" && (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                          <span className="text-xs text-yellow-600">Processing</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                      <span>Modified {file.lastModified}</span>
                      <span>{file.size}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Download className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          Open
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem>Rename</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => deleteFile(file.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* No Results */}
      {searchQuery && filteredFiles.length === 0 && (
        <div className="text-center py-16">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
          <p className="text-gray-600">Try adjusting your search terms</p>
        </div>
      )}

      {/* Drag Overlay */}
      {dragActive && (
        <div
          className="fixed inset-0 bg-blue-50 bg-opacity-90 flex items-center justify-center z-50"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <Upload className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-blue-900 mb-2">Drop files to upload</h3>
            <p className="text-blue-700">Release to add files to your vault</p>
          </div>
        </div>
      )}
    </div>
  )
}
