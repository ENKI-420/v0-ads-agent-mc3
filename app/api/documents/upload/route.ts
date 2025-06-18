import { type NextRequest, NextResponse } from "next/server"
import { secureDocumentManager } from "@/lib/document-sharing/secure-document-manager"
import { logger } from "@/lib/logger"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const userId = formData.get("userId") as string
    const classification = formData.get("classification") as string
    const tags = formData.get("tags") as string

    if (!file || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create document metadata
    const metadata = {
      classification: (classification as any) || "internal",
      tags: tags ? tags.split(",") : [],
      complianceLabels: [],
    }

    // Create permissions
    const permissions = {
      isPublic: false,
      requiresApproval: false,
      allowAnonymousAccess: false,
      users: new Map(),
      groups: new Map(),
      roles: new Map(),
    }

    const result = await secureDocumentManager.uploadDocument(file, metadata, userId, permissions)

    if (result.success) {
      logger.info("Document uploaded successfully", {
        documentId: result.documentId,
        userId,
        filename: file.name,
        size: file.size,
      })

      return NextResponse.json({
        success: true,
        documentId: result.documentId,
        message: "Document uploaded successfully",
      })
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
  } catch (error) {
    logger.error("Document upload failed", { error })
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
