"use client"

import { useState } from "react"
import { FileText, Download, Share, Eye, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface DocViewerProps {
  sessionId: string
}

const mockDocuments = [
  {
    id: "1",
    name: "Patient_Chart_2024.pdf",
    type: "Medical Record",
    size: "2.4 MB",
    uploadedBy: "Dr. Smith",
    uploadedAt: "2024-01-15T10:30:00Z",
    isSecure: true,
    compliance: ["HIPAA"],
  },
  {
    id: "2",
    name: "Lab_Results_Latest.pdf",
    type: "Lab Report",
    size: "1.2 MB",
    uploadedBy: "Lab Tech",
    uploadedAt: "2024-01-15T09:15:00Z",
    isSecure: true,
    compliance: ["HIPAA"],
  },
  {
    id: "3",
    name: "Treatment_Plan.docx",
    type: "Treatment Plan",
    size: "856 KB",
    uploadedBy: "Dr. Smith",
    uploadedAt: "2024-01-15T08:45:00Z",
    isSecure: true,
    compliance: ["HIPAA"],
  },
]

export function DocViewer({ sessionId }: DocViewerProps) {
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null)

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm flex items-center space-x-2">
          <FileText className="w-4 h-4" />
          <span>Session Documents</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[500px]">
          <div className="p-4 space-y-3">
            {mockDocuments.map((doc) => (
              <div
                key={doc.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedDoc === doc.id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
                onClick={() => setSelectedDoc(doc.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <span className="text-sm font-medium truncate">{doc.name}</span>
                      {doc.isSecure && <Lock className="w-3 h-3 text-green-500 flex-shrink-0" />}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-slate-500">
                      <span>{doc.type}</span>
                      <span>•</span>
                      <span>{doc.size}</span>
                      <span>•</span>
                      <span>by {doc.uploadedBy}</span>
                    </div>
                    <div className="flex items-center space-x-1 mt-2">
                      {doc.compliance.map((comp) => (
                        <Badge key={comp} variant="outline" className="text-xs">
                          {comp}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 ml-2">
                    <Button variant="ghost" size="icon" className="w-6 h-6">
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-6 h-6">
                      <Download className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-6 h-6">
                      <Share className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Upload Area */}
        <div className="p-4 border-t">
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-4 text-center">
            <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-500 mb-2">Drag and drop files here or click to upload</p>
            <Button variant="outline" size="sm">
              Choose Files
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
