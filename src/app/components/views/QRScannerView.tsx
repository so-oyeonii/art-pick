'use client'

import { useState, useEffect } from 'react'
import { X, Check } from 'lucide-react'
import type { ArtSpot, ArtItem } from '@/lib/types'

interface QRScannerViewProps {
  targetSpot: ArtSpot
  onSuccess: (art: ArtItem) => void
  onBack: () => void
}

export default function QRScannerView({
  targetSpot,
  onSuccess,
  onBack
}: QRScannerViewProps) {
  const [scanning, setScanning] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Progress 업데이트
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 2
      })
    }, 70)

    // 3.5초 후 스캔 완료
    const timeout = setTimeout(() => {
      setScanning(false)
      onSuccess(targetSpot)
    }, 3500)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [targetSpot, onSuccess])

  return (
    <div className="w-full h-full bg-black relative overflow-hidden">
      {/* 카메라 피드 시뮬레이션 */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.1) 0px, transparent 2px, transparent 4px, rgba(255,255,255,0.1) 4px)',
        animation: 'grain 0.3s steps(1) infinite'
      }} />

      {/* 종료 버튼 */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 z-20 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
      >
        <X className="text-white" size={20} />
      </button>

      {/* QR 코드 영역 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* QR 코드 (시뮬레이션) */}
          <div className="bg-white p-8 rounded-2xl shadow-2xl">
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`}
                />
              ))}
            </div>
          </div>

          {/* 스캔 프레임 */}
          {scanning && (
            <>
              <div className="absolute -inset-4 border-4 border-green-400 rounded-3xl">
                {/* 모서리 강조 */}
                <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-green-400" />
                <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-green-400" />
                <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-green-400" />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-green-400" />
              </div>

              {/* 스캔 레이저 라인 */}
              <div className="absolute left-0 right-0 h-1 bg-green-400 shadow-lg shadow-green-400/50 animate-scan-down" />
            </>
          )}

          {/* 완료 체크마크 */}
          {!scanning && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center animate-fade-in-up">
                <Check className="text-white" size={48} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 진행 상황 */}
      <div className="absolute bottom-12 left-0 right-0 px-8">
        <div className="bg-white/10 backdrop-blur-md rounded-full p-4 text-center">
          <p className="text-white font-bold mb-2">
            {scanning ? 'QR 코드 인식 중...' : '스캔 완료!'}
          </p>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-green-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
