import { type NextRequest, NextResponse } from "next/server"
import { secureDocumentManager } from "@/lib/document-sharing/secure-document-manager"
import { logger } from "@/lib/logger"

export async function PUT(request: NextRequest, { params }: { params: { documentId: string } }) {
  try {
    const { documentId } = params
    const { permissions, userId } = await request.json()

    if (!userId || !permissions) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await secureDocumentManager.updatePermissions(documentId, permissions, userId)

    if (result.success) {
      logger.info("Document permissions updated", {
        documentId,
        userId,
      })

      return NextResponse.json({
        success: true,
        message: "Permissions updated successfully",
      })
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
  } catch (error) {
    logger.error("Permission update failed", { error, documentId: params.documentId })
    return NextResponse.json({ error: "Permission update failed" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { documentId: string } }) {
  try {
    const { documentId } = params
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 })
    }

    const result = await secureDocumentManager.getDocument(documentId, userId, "view")

    if (result.success && result.document) {
      return NextResponse.json({
        success: true,
        permissions: result.document.permissions,
      })
    } else {
      return NextResponse.json({ error: result.error }, { status: 403 })
    }
  } catch (error) {
    logger.error("Failed to get document permissions", { error, documentId: params.documentId })
    return NextResponse.json({ error: "Failed to get permissions" }, { status: 500 })
  }
}
