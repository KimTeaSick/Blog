import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ project: string; image: string }> }
) {
  try {
    const { project, image } = await params
    const imagePath = path.join(
      process.cwd(),
      'contents',
      'portfolio',
      project,
      image
    )

    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      return new NextResponse('Image not found', { status: 404 })
    }

    // Read file
    const imageBuffer = fs.readFileSync(imagePath)

    // Determine content type based on extension
    const ext = path.extname(image).toLowerCase()
    const contentTypeMap: { [key: string]: string } = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
    }

    const contentType = contentTypeMap[ext] || 'application/octet-stream'

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error serving portfolio image:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
