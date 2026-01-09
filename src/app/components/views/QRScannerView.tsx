'use client'

import { useEffect, useRef, useState } from 'react'
import { X, AlertCircle } from 'lucide-react'
import { Html5Qrcode } from 'html5-qrcode'
import type { ArtSpot, ArtItem } from '@/lib/types'

interface QRScannerViewProps {
  targetSpot: ArtSpot
  onSuccess: (art: ArtItem) => void
  onBack: () => void
  isNearTarget: boolean
}

export default function QRScannerView({
  targetSpot,
  onSuccess,
  onBack,
  isNearTarget
}: QRScannerViewProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)

  useEffect(() => {
    // 실제 QR 코드가 있는 spot이고 GPS 범위 내에 있는 경우만 카메라 실행
    if (!targetSpot?.isActive || !isNearTarget) {
      return
    }

    const startScanner = async () => {
      try {
        const scanner = new Html5Qrcode('qr-reader')
        scannerRef.current = scanner

        await scanner.start(
          { facingMode: 'environment' }, // 후면 카메라
          {
            fps: 10,
            qrbox: { width: 250, height: 250 }
          },
          (decodedText) => {
            // SwiftXR URL 패턴 확인
            if (decodedText.includes('swiftxr.site')) {
              scanner.stop().then(() => {
                scannerRef.current = null
                // AR 링크 새 창에서 열기
                window.open(decodedText, '_blank')
                // 컬렉션에 추가
                onSuccess(targetSpot)
              }).catch(console.error)
            }
          },
          (errorMessage) => {
            // QR 코드를 찾지 못한 경우는 무시 (계속 스캔)
          }
        )

        setScanning(true)
      } catch (err: any) {
        console.error('QR Scanner Error:', err)
        setError(err.message || '카메라를 시작할 수 없습니다')
      }
    }

    startScanner()

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current
          .stop()
          .then(() => {
            scannerRef.current = null
          })
          .catch((err) => {
            // 이미 중지된 경우 무시
            console.log('Scanner already stopped')
          })
      }
    }
  }, [targetSpot, isNearTarget, onSuccess])

  // 가상 작품인 경우 - 시뮬레이션 수집
  if (!targetSpot?.isActive) {
    useEffect(() => {
      const timer = setTimeout(() => {
        onSuccess(targetSpot)
      }, 3500)
      return () => clearTimeout(timer)
    }, [onSuccess, targetSpot])

    return (
      <div className="w-full h-full bg-black flex flex-col items-center justify-center relative">
        <button
          onClick={onBack}
          className="absolute top-6 left-6 z-10 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition"
        >
          <X size={20} />
        </button>

        <div className="relative w-80 h-80 border-4 border-white rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20" />
          <div
            className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent animate-scan-down"
            style={{ animationDuration: '3.5s' }}
          />
        </div>

        <p className="mt-6 text-white text-lg">가상 작품 수집 중...</p>
        <p className="text-white/60 text-sm mt-2">{targetSpot?.korTitle}</p>
      </div>
    )
  }

  // 실제 QR이지만 GPS 범위 밖인 경우
  if (!isNearTarget) {
    return (
      <div className="w-full h-full bg-black/90 flex flex-col items-center justify-center p-6 relative">
        <button
          onClick={onBack}
          className="absolute top-6 left-6 z-10 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
        >
          <X size={20} />
        </button>

        <AlertCircle className="w-16 h-16 text-yellow-400 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">위치 범위 밖</h3>
        <p className="text-white/80 text-center">
          작품 위치에서 100m 이내로 이동해주세요
        </p>
        <p className="text-white/60 text-sm mt-4">{targetSpot?.korTitle}</p>
      </div>
    )
  }

  // 실제 QR 스캔 모드
  return (
    <div className="w-full h-full bg-black flex flex-col relative">
      <button
        onClick={onBack}
        className="absolute top-6 left-6 z-10 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
      >
        <X size={20} />
      </button>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {error ? (
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mb-4 mx-auto" />
            <p className="text-white mb-2">카메라 오류</p>
            <p className="text-white/60 text-sm">{error}</p>
            <button
              onClick={onBack}
              className="mt-4 px-6 py-2 bg-white/20 rounded-full text-white"
            >
              닫기
            </button>
          </div>
        ) : (
          <>
            <div
              id="qr-reader"
              className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
            />
            {scanning && (
              <div className="mt-6 text-center">
                <p className="text-white text-lg">QR 코드를 스캔하세요</p>
                <p className="text-white/60 text-sm mt-2">{targetSpot?.korTitle}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
