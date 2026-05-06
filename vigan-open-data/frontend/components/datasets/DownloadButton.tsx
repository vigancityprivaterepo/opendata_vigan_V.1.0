'use client'
import { useState } from 'react'
import { Download, ExternalLink, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  url: string
  name: string
  size?: number | null
}

export default function DownloadButton({ url, name, size }: Props) {
  const [downloading, setDownloading] = useState(false)

  // Direct link download instead of blob to handle CORS gracefully
  const handleDownload = () => {
    setDownloading(true)
    setTimeout(() => setDownloading(false), 2000) // Reset UI after launch
  }

  return (
    <a 
      href={url}
      download={name}
      onClick={handleDownload}
      className={cn(
        "btn-primary inline-flex gap-2 w-full sm:w-auto justify-center", 
        downloading ? "opacity-80 pointer-events-none" : ""
      )}
    >
      <Download size={16} className={downloading ? "animate-bounce" : ""} />
      {downloading ? 'Downloading...' : 'Download File'}
    </a>
  )
}
