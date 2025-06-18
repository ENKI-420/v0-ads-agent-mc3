"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileText, Shield, CheckCircle, AlertTriangle, X, Lock, Eye, Download } from "lucide-react"
import { useDropzone } from "react-dropzone"

interface SecureUploadProps {
  role: string
  compliance: string[]
  onUploadComplete?: (documentId: string) => void
}

export function SecureUpload({ role, compliance, onUploadComplete }: SecureUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{
      id: string
      file: File
      status: "uploading" | "processing" | "completed" | "failed"
      progress: number
      documentId?: string
      error?: string
    }>
  >([])

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        status: "uploading" as const,
        progress: 0,
      }))

      setUploadedFiles((prev) => [...prev, ...newFiles])

      // Process each file
      for (const fileData of newFiles) {
        try {
          // Simulate upload progress
          for (let progress = 0; progress <= 100; progress += 20) {
            await new Promise((resolve) => setTimeout(resolve, 200))
            setUploadedFiles((prev) => prev.map((f) => (f.id === fileData.id ? { ...f, progress } : f)))
          }

          // Upload to server
          const formData = new FormData()
          formData.append("file", fileData.file)
          formData.append("role", role)
          formData.append("compliance", compliance.join(","))

          const response = await fetch("/api/ingest", {
            method: "POST",
            body: formData,
          })

          const result = await response.json()

          if (result.success) {
            setUploadedFiles((prev) =>
              prev.map((f) =>
                f.id === fileData.id
                  ? {
                      ...f,
                      status: "processing",
                      documentId: result.documentId,
                    }
                  : f,
              ),
            )

            // Monitor processing status
            monitorProcessing(fileData.id, result.documentId)
          } else {
            setUploadedFiles((prev) =>
              prev.map((f) =>
                f.id === fileData.id
                  ? {
                      ...f,
                      status: "failed",
                      error: result.error,
                    }
                  : f,
              ),
            )
          }
        } catch (error) {
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === fileData.id
                ? {
                    ...f,
                    status: "failed",
                    error: "Upload failed",
                  }
                : f,
            ),
          )
        }
      }
    },
    [role, compliance],
  )

  const monitorProcessing = async (fileId: string, documentId: string) => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/documents/status?id=${documentId}`)
        const status = await response.json()

        if (status.processingStatus === "completed") {
          setUploadedFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: "completed" } : f)))
          onUploadComplete?.(documentId)
        } else if (status.processingStatus === "failed") {
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === fileId
                ? {
                    ...f,
                    status: "failed",
                    error: "Processing failed",
                  }
                : f,
            ),
          )
        } else {
          // Still processing, check again
          setTimeout(checkStatus, 2000)
        }
      } catch (error) {
        console.error("Status check failed:", error)
      }
    }

    setTimeout(checkStatus, 1000)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    maxSize: getMaxFileSize(role),
    multiple: true,
  })

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  return (
    <div className="space-y-6">
      {/* Security Notice */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          All documents are processed with {compliance.join(", ")} compliance and encrypted at rest. Role-based access
          controls ensure only authorized personnel can access your documents.
        </AlertDescription>
      </Alert>

      {/* Upload Zone */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Secure Document Upload
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            {isDragActive ? (
              <p className="text-primary">Drop files here...</p>
            ) : (
              <div>
                <p className="text-muted-foreground mb-2">Drag & drop files here, or click to select</p>
                <p className="text-xs text-muted-foreground">
                  Supports PDF, DOC, TXT, JPG, PNG • Max {getMaxFileSize(role) / 1024 / 1024}MB per file
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Processing Queue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {uploadedFiles.map((fileData) => (
              <div key={fileData.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <FileText className="h-8 w-8 text-blue-500 flex-shrink-0" />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium truncate">{fileData.file.name}</p>
                    <StatusBadge status={fileData.status} />
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{formatFileSize(fileData.file.size)}</span>
                    <span className="flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      {compliance.join(", ")}
                    </span>
                  </div>

                  {fileData.status === "uploading" && <Progress value={fileData.progress} className="mt-2 h-1" />}

                  {fileData.status === "processing" && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-blue-600">
                      <div className="animate-spin h-3 w-3 border border-blue-600 border-t-transparent rounded-full" />
                      AI analysis in progress...
                    </div>
                  )}

                  {fileData.error && <p className="mt-1 text-sm text-red-600">{fileData.error}</p>}
                </div>

                <div className="flex items-center gap-2">
                  {fileData.status === "completed" && (
                    <>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </>
                  )}

                  <Button size="sm" variant="ghost" onClick={() => removeFile(fileData.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const variants = {
    uploading: { variant: "secondary" as const, icon: Upload, text: "Uploading" },
    processing: { variant: "default" as const, icon: FileText, text: "Processing" },
    completed: { variant: "secondary" as const, icon: CheckCircle, text: "Complete" },
    failed: { variant: "destructive" as const, icon: AlertTriangle, text: "Failed" },
  }

  const config = variants[status as keyof typeof variants]
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {config.text}
    </Badge>
  )
}

function getMaxFileSize(role: string): number {
  const sizes = {
    clinician: 50 * 1024 * 1024, // 50MB
    attorney: 100 * 1024 * 1024, // 100MB
    analyst: 25 * 1024 * 1024, // 25MB
    patient: 10 * 1024 * 1024, // 10MB
    enterprise: 100 * 1024 * 1024, // 100MB
  }
  return sizes[role as keyof typeof sizes] || sizes.enterprise
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}
