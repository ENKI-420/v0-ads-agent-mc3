import { type NextRequest, NextResponse } from "next/server"
import { secureDocumentManager } from "@/lib/document-sharing/secure-document-manager"
import { logger } from "@/lib/logger"

export async function POST(request: NextRequest, { params }: { params: { documentId: string } }) {
  try {
    const { documentId } = params
    const { emails, permissions, expiresAt, message, userId } = await request.json()

    if (!userId || !emails || !permissions) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const shareConfig = {
      emails: Array.isArray(emails) ? emails : [emails],
      permissions,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      message,
    }

    const result = await secureDocumentManager.shareDocument(documentId, shareConfig, userId)

    if (result.success) {
      logger.info("Document shared successfully", {
        documentId,
        shareId: result.shareId,
        userId,
        recipients: shareConfig.emails,
      })

      return NextResponse.json({
        success: true,
        shareId: result.shareId,
        message: "Document shared successfully",
      })
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
  } catch (error) {
    logger.error("Document sharing failed", { error, documentId: params.documentId })
    return NextResponse.json({ error: "Sharing failed" }, { status: 500 })
  }
}
