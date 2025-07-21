'use client'

import { useState } from 'react'
import { Info } from 'lucide-react'
import PhotoInfoModal from '@/components/PhotoInfoModal'
import type { FeaturedPhoto } from '@/types'

interface PhotoInfoButtonProps {
  photo: FeaturedPhoto
}

export default function PhotoInfoButton({ photo }: PhotoInfoButtonProps) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="info-button group"
        aria-label="Photo information"
      >
        <Info size={20} className="group-hover:scale-110 transition-transform" />
      </button>

      {showModal && (
        <PhotoInfoModal 
          photo={photo} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </>
  )
}