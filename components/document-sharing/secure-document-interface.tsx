"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  FileText,
  Upload,
  Share2,
  Download,
  Eye,
  MessageSquare,
  Shield,
  Users,
  MoreVertical,
  Trash2,
  FileSignature,
  Search,
  Filter,
  Grid,
  List,
} from "lucide-react"
import {
  secureDocumentManager,
  type SecureDocument,
  type PermissionSet,
} from "@/lib/document-sharing/secure-document-manager"

interface SecureDocumentInterfaceProps {
  userId: string
  userRole: string
  vertical: "healthcare" | "legal" | "defense" | "enterprise"
}

export function SecureDocumentInterface({ userId, userRole, vertical }: SecureDocumentInterfaceProps) {
  const [documents, setDocuments] = useState<SecureDocument[]>([])
  const [selectedDocument, setSelectedDocument] = useState<SecureDocument | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filterBy, setFilterBy] = useState<"all" | "owned" | "shared" | "recent">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false)
  const [shareConfig, setShareConfig] = useState({
    emails: "",
    message: "",
    permissions: getDefaultPermissions(),
    expiresAt: "",
  })

  // Load documents
  useEffect(() => {
    loadDocuments()
  }, [userId, filterBy])

  const loadDocuments = useCallback(() => {
    let docs: SecureDocument[] = []

    switch (filterBy) {
      case "owned":
        docs = secureDocumentManager.getAllDocuments(userId).filter((doc) => doc.ownerId === userId)
        break
      case "shared":
        docs = secureDocumentManager.getSharedDocuments(userId)
        break
      case "recent":
        docs = secureDocumentManager
          .getAllDocuments(userId)
          .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
          .slice(0, 10)
        break
      default:
        docs = secureDocumentManager.getAllDocuments(userId)
    }

    if (searchQuery) {
      docs = docs.filter(
        (doc) =>
          doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    setDocuments(docs)
  }, [userId, filterBy, searchQuery])

  const handleFileUpload = useCallback(
    async (files: FileList) => {
      if (!files.length) return

      setIsUploading(true)
      setUploadProgress(0)

      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        try {
          // Simulate upload progress
          for (let progress = 0; progress <= 100; progress += 20) {
            setUploadProgress(progress)
            await new Promise((resolve) => setTimeout(resolve, 200))
          }

          const result = await secureDocumentManager.uploadDocument(
            file,
            {
              classification: getDefaultClassification(vertical),
              tags: [vertical],
              complianceLabels: getComplianceLabels(vertical),
            },
            userId,
            {
              isPublic: false,
              requiresApproval: false,
              allowAnonymousAccess: false,
              users: new Map(),
              groups: new Map(),
              roles: new Map(),
            },
          )

          if (result.success) {
            loadDocuments()
          }
        } catch (error) {
          console.error("Upload failed:", error)
        }
      }

      setIsUploading(false)
      setUploadProgress(0)
    },
    [userId, vertical],
  )

  const handleShare = useCallback(async () => {
    if (!selectedDocument) return

    const emails = shareConfig.emails
      .split(",")
      .map((email) => email.trim())
      .filter(Boolean)

    const result = await secureDocumentManager.shareDocument(
      selectedDocument.id,
      {
        emails,
        permissions: shareConfig.permissions,
        expiresAt: shareConfig.expiresAt ? new Date(shareConfig.expiresAt) : undefined,
        message: shareConfig.message,
      },
      userId,
    )

    if (result.success) {
      setShowShareDialog(false)
      setShareConfig({
        emails: "",
        message: "",
        permissions: getDefaultPermissions(),
        expiresAt: "",
      })
    }
  }, [selectedDocument, shareConfig, userId])

  const handleDownload = useCallback(
    async (document: SecureDocument) => {
      const result = await secureDocumentManager.getDocument(document.id, userId, "download")
      if (result.success) {
        // Simulate download
        console.log(`Downloading ${document.filename}`)
      }
    },
    [userId],
  )

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case "public":
        return "bg-green-100 text-green-800"
      case "internal":
        return "bg-blue-100 text-blue-800"
      case "confidential":
        return "bg-yellow-100 text-yellow-800"
      case "restricted":
        return "bg-red-100 text-red-800"
      case "top_secret":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "review":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "archived":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getVerticalColor = () => {
    switch (vertical) {
      case "healthcare":
        return "border-blue-500"
      case "legal":
        return "border-purple-500"
      case "defense":
        return "border-red-500"
      default:
        return "border-green-500"
    }
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className={`bg-white border-b-2 ${getVerticalColor()} px-6 py-4 shadow-sm`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Secure Document Sharing</h1>
            <Badge variant="outline" className="capitalize">
              {vertical}
            </Badge>
            <Badge variant="secondary">{documents.length} documents</Badge>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            {/* Upload */}
            <div className="relative">
              <input
                type="file"
                multiple
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept=".pdf,.doc,.docx,.txt,.jpg,.png,.xls,.xlsx"
              />
              <Button className="flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Upload</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4 mt-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-500">Filter:</span>
          </div>
          {["all", "owned", "shared", "recent"].map((filter) => (
            <Button
              key={filter}
              variant={filterBy === filter ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterBy(filter as any)}
              className="capitalize"
            >
              {filter}
            </Button>
          ))}
        </div>
      </header>

      {/* Upload Progress */}
      {isUploading && (
        <div className="px-6 py-2 bg-blue-50 border-b">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-blue-600">Uploading...</span>
            <Progress value={uploadProgress} className="flex-1" />
            <span className="text-sm text-blue-600">{uploadProgress}%</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {documents.map((document) => (
              <Card key={document.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <FileText className="w-8 h-8 text-blue-500" />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedDocument(document)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownload(document)}>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedDocument(document)
                            setShowShareDialog(true)
                          }}
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm truncate" title={document.title}>
                      {document.title}
                    </h3>
                    <p className="text-xs text-gray-500 truncate" title={document.filename}>
                      {document.filename}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">{formatFileSize(document.size)}</span>
                      <span className="text-gray-500">v{document.version}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge className={getClassificationColor(document.classification)} variant="secondary">
                        {document.classification}
                      </Badge>
                      <Badge className={getStatusColor(document.status)} variant="secondary">
                        {document.status}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{document.updatedAt.toLocaleDateString()}</span>
                      <div className="flex items-center space-x-1">
                        {document.digitalSignatures.length > 0 && <FileSignature className="w-3 h-3 text-green-500" />}
                        {document.comments.length > 0 && <MessageSquare className="w-3 h-3 text-blue-500" />}
                        {document.collaborators.length > 1 && <Users className="w-3 h-3 text-purple-500" />}
                      </div>
                    </div>

                    {document.complianceLabels.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {document.complianceLabels.map((label) => (
                          <Badge key={label} variant="outline" className="text-xs">
                            <Shield className="w-2 h-2 mr-1" />
                            {label}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {documents.map((document) => (
                  <div key={document.id} className="p-4 hover:bg-gray-50 flex items-center space-x-4">
                    <FileText className="w-8 h-8 text-blue-500 flex-shrink-0" />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium truncate">{document.title}</h3>
                        <Badge className={getClassificationColor(document.classification)} variant="secondary">
                          {document.classification}
                        </Badge>
                        <Badge className={getStatusColor(document.status)} variant="secondary">
                          {document.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{document.filename}</span>
                        <span>{formatFileSize(document.size)}</span>
                        <span>v{document.version}</span>
                        <span>{document.updatedAt.toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {document.complianceLabels.map((label) => (
                        <Badge key={label} variant="outline" className="text-xs">
                          <Shield className="w-2 h-2 mr-1" />
                          {label}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center space-x-1">
                      {document.digitalSignatures.length > 0 && <FileSignature className="w-4 h-4 text-green-500" />}
                      {document.comments.length > 0 && <MessageSquare className="w-4 h-4 text-blue-500" />}
                      {document.collaborators.length > 1 && <Users className="w-4 h-4 text-purple-500" />}
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedDocument(document)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownload(document)}>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedDocument(document)
                            setShowShareDialog(true)
                          }}
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {documents.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery ? "Try adjusting your search terms" : "Upload your first document to get started"}
              </p>
              {!searchQuery && (
                <div className="relative inline-block">
                  <input
                    type="file"
                    multiple
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.png,.xls,.xlsx"
                  />
                  <Button>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Documents
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Share Document</DialogTitle>
            <DialogDescription>Share "{selectedDocument?.title}" with others</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="emails">Email addresses (comma-separated)</Label>
              <Textarea
                id="emails"
                placeholder="user1@example.com, user2@example.com"
                value={shareConfig.emails}
                onChange={(e) => setShareConfig((prev) => ({ ...prev, emails: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="message">Message (optional)</Label>
              <Textarea
                id="message"
                placeholder="Add a message..."
                value={shareConfig.message}
                onChange={(e) => setShareConfig((prev) => ({ ...prev, message: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="expires">Expires (optional)</Label>
              <Input
                id="expires"
                type="datetime-local"
                value={shareConfig.expiresAt}
                onChange={(e) => setShareConfig((prev) => ({ ...prev, expiresAt: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={shareConfig.permissions.canView}
                    onCheckedChange={(checked) =>
                      setShareConfig((prev) => ({
                        ...prev,
                        permissions: { ...prev.permissions, canView: checked },
                      }))
                    }
                  />
                  <Label className="text-sm">View</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={shareConfig.permissions.canEdit}
                    onCheckedChange={(checked) =>
                      setShareConfig((prev) => ({
                        ...prev,
                        permissions: { ...prev.permissions, canEdit: checked },
                      }))
                    }
                  />
                  <Label className="text-sm">Edit</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={shareConfig.permissions.canComment}
                    onCheckedChange={(checked) =>
                      setShareConfig((prev) => ({
                        ...prev,
                        permissions: { ...prev.permissions, canComment: checked },
                      }))
                    }
                  />
                  <Label className="text-sm">Comment</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={shareConfig.permissions.canDownload}
                    onCheckedChange={(checked) =>
                      setShareConfig((prev) => ({
                        ...prev,
                        permissions: { ...prev.permissions, canDownload: checked },
                      }))
                    }
                  />
                  <Label className="text-sm">Download</Label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowShareDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleShare}>Share Document</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function getDefaultPermissions(): PermissionSet {
  return {
    canView: true,
    canEdit: false,
    canComment: true,
    canAnnotate: false,
    canDownload: false,
    canPrint: false,
    canShare: false,
    canDelete: false,
    canChangePermissions: false,
    canApprove: false,
    canSign: false,
    canExport: false,
    canViewMetadata: false,
    canViewHistory: false,
    canViewComments: true,
    canViewSignatures: false,
    canCreateVersions: false,
    canRestoreVersions: false,
    canSetRetention: false,
    canAuditAccess: false,
  }
}

function getDefaultClassification(vertical: string): "public" | "internal" | "confidential" | "restricted" {
  switch (vertical) {
    case "healthcare":
      return "confidential"
    case "legal":
      return "confidential"
    case "defense":
      return "restricted"
    default:
      return "internal"
  }
}

function getComplianceLabels(vertical: string): string[] {
  switch (vertical) {
    case "healthcare":
      return ["HIPAA"]
    case "legal":
      return ["SOC2"]
    case "defense":
      return ["ITAR"]
    default:
      return ["GDPR"]
  }
}
