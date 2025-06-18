import { type NextRequest, NextResponse } from "next/server"
import { secureDocumentManager } from "@/lib/document-sharing/secure-document-manager"
import { logger } from "@/lib/logger"

export async function POST(request: NextRequest, { params }: { params: { documentId: string } }) {
  try {
    const { documentId } = params
    const { signatureType, signatureData, certificateId, userId } = await request.json()

    if (!userId || !signatureType || !signatureData) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const signature = {
      signatureType,
      signatureData,
      certificateId,
    }

    const result = await secureDocumentManager.signDocument(documentId, signature, userId)

    if (result.success) {
      logger.info("Document signed successfully", {
        documentId,
        signatureId: result.signatureId,
        userId,
        signatureType,
      })

      return NextResponse.json({
        success: true,
        signatureId: result.signatureId,
        message: "Document signed successfully",
      })
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
  } catch (error) {
    logger.error("Failed to sign document", { error, documentId: params.documentId })
    return NextResponse.json({ error: "Failed to sign document" }, { status: 500 })
  }
}
