'use client'

import { useState } from 'react'
import { Palette } from 'lucide-react'
import ArtistSubmissionModal from '@/components/ArtistSubmissionModal'

interface ArtistSubmissionButtonProps {
  guidelines?: string
  contactEmail?: string
}

export default function ArtistSubmissionButton({ guidelines, contactEmail }: ArtistSubmissionButtonProps) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="artist-button group"
        aria-label="Artist submissions"
      >
        <Palette size={16} className="inline mr-2 group-hover:scale-110 transition-transform" />
        Submit Your Art
      </button>

      {showModal && (
        <ArtistSubmissionModal
          guidelines={guidelines}
          contactEmail={contactEmail}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}