import { type NextRequest, NextResponse } from "next/server"
import { secureDocumentManager } from "@/lib/document-sharing/secure-document-manager"
import { logger } from "@/lib/logger"

export async function POST(request: NextRequest, { params }: { params: { documentId: string } }) {
  try {
    const { documentId } = params
    const { content, position, parentCommentId, userId } = await request.json()

    if (!userId || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const comment = {
      authorId: userId,
      content,
      position,
      parentCommentId,
      resolved: false,
      mentions: [],
    }

    const result = await secureDocumentManager.addComment(documentId, comment, userId)

    if (result.success) {
      logger.info("Comment added successfully", {
        documentId,
        commentId: result.commentId,
        userId,
      })

      return NextResponse.json({
        success: true,
        commentId: result.commentId,
        message: "Comment added successfully",
      })
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
  } catch (error) {
    logger.error("Failed to add comment", { error, documentId: params.documentId })
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 })
  }
}
