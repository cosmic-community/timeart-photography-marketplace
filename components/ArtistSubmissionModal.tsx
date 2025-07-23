'use client'

import { useState, useEffect } from 'react'
import { X, Upload, Send, CheckCircle } from 'lucide-react'
import { submitArtistApplication } from '@/lib/cosmic'
import type { ArtistSubmissionProps } from '@/types'

// Utility function for email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export default function ArtistSubmissionModal({ guidelines, contactEmail, onClose }: ArtistSubmissionProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    artist_statement: '',
    social_links: '',
    agreed_to_terms: false
  })
  
  const [files, setFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [onClose])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    const imageFiles = selectedFiles.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length !== selectedFiles.length) {
      setError('Please select only image files')
      return
    }
    
    if (imageFiles.length > 5) {
      setError('Please select no more than 5 images')
      return
    }
    
    setFiles(imageFiles)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.name.trim()) {
      setError('Please enter your name')
      return
    }

    if (!formData.email.trim() || !isValidEmail(formData.email)) {
      setError('Please enter a valid email address')
      return
    }

    if (!formData.artist_statement.trim()) {
      setError('Please provide an artist statement')
      return
    }

    if (files.length === 0) {
      setError('Please upload at least one portfolio sample')
      return
    }

    if (files.length > 5) {
      setError('Please upload no more than 5 portfolio samples')
      return
    }

    if (!formData.agreed_to_terms) {
      setError('Please agree to the terms and conditions')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await submitArtistApplication({
        name: formData.name,
        email: formData.email,
        artist_statement: formData.artist_statement, // Use correct property name
        social_links: formData.social_links || undefined,
        agreed_to_terms: formData.agreed_to_terms
      })

      if (result.success) {
        setSubmitted(true)
      } else {
        setError(result.message || 'Failed to submit application. Please try again.')
      }
    } catch (err) {
      setError('Failed to submit application. Please try again.')
      console.error('Submission error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-content animate-slide-up" onClick={e => e.stopPropagation()}>
          <div className="p-8 text-center">
            <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Application Submitted!
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you for your submission. We'll review your portfolio and get back to you within 5-7 business days.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content animate-slide-up" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="border-b p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Submit Your Art</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 transition-colors"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Guidelines */}
        {guidelines && (
          <div className="p-6 bg-blue-50 border-b">
            <div 
              className="text-sm text-gray-700 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: guidelines }}
            />
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 max-h-96 overflow-y-auto custom-scrollbar">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>

            {/* Social Links */}
            <div>
              <label htmlFor="social_links" className="block text-sm font-medium text-gray-700 mb-1">
                Website/Instagram/Portfolio (Optional)
              </label>
              <input
                type="text"
                id="social_links"
                placeholder="Instagram: @yourhandle, Website: yoursite.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.social_links}
                onChange={(e) => setFormData(prev => ({ ...prev, social_links: e.target.value }))}
              />
            </div>

            {/* Artist Statement */}
            <div>
              <label htmlFor="artist_statement" className="block text-sm font-medium text-gray-700 mb-1">
                Artist Statement *
              </label>
              <textarea
                id="artist_statement"
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tell us about your artistic vision, style, and what makes your work unique..."
                value={formData.artist_statement}
                onChange={(e) => setFormData(prev => ({ ...prev, artist_statement: e.target.value }))}
              />
            </div>

            {/* Portfolio Upload */}
            <div>
              <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700 mb-1">
                Portfolio Samples * (3-5 images, max 10MB each)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                <input
                  type="file"
                  id="portfolio"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="portfolio"
                  className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
                >
                  Click to upload images
                </label>
                <p className="text-sm text-gray-500 mt-1">PNG, JPG, JPEG up to 10MB</p>
              </div>
              
              {files.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-2">Selected files:</p>
                  <ul className="text-sm space-y-1">
                    {files.map((file, index) => (
                      <li key={index} className="text-gray-700">
                        {file.name} ({(file.size / 1024 / 1024).toFixed(1)}MB)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={formData.agreed_to_terms}
                onChange={(e) => setFormData(prev => ({ ...prev, agreed_to_terms: e.target.checked }))}
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                I agree that my submitted work is original, I own full rights to it, and I agree to the commission structure and terms of service. *
              </label>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="border-t p-6 bg-gray-50 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send size={16} />
                Submit Application
              </>
            )}
          </button>
        </div>

        {contactEmail && (
          <div className="px-6 pb-4 text-center text-sm text-gray-500">
            Questions? Contact us at{' '}
            <a 
              href={`mailto:${contactEmail}`} 
              className="text-blue-600 hover:text-blue-700"
            >
              {contactEmail}
            </a>
          </div>
        )}
      </div>
    </div>
  )
}