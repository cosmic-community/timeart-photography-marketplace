import { NextRequest, NextResponse } from 'next/server'
import { updateCurrentFeaturedPhoto, shouldRotatePhoto } from '@/lib/artRotation'

export async function POST(request: NextRequest) {
  try {
    // Check if we should rotate the photo
    const needsRotation = await shouldRotatePhoto()
    
    if (needsRotation) {
      await updateCurrentFeaturedPhoto()
      return NextResponse.json({ 
        success: true, 
        message: 'Photo rotated successfully',
        rotated: true
      })
    } else {
      return NextResponse.json({ 
        success: true, 
        message: 'Photo is already current for today',
        rotated: false
      })
    }
  } catch (error) {
    console.error('Error in rotation API:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to rotate photo' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const needsRotation = await shouldRotatePhoto()
    
    return NextResponse.json({
      needsRotation,
      message: needsRotation ? 'Photo needs rotation' : 'Photo is current'
    })
  } catch (error) {
    console.error('Error checking rotation status:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to check rotation status' },
      { status: 500 }
    )
  }
}