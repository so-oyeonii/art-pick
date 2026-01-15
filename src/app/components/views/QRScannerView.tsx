'use client'

import { useEffect, useRef, useState } from 'react'
import { X, AlertCircle, Sparkles } from 'lucide-react'
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
  const [collectPhase, setCollectPhase] = useState<'scanning' | 'collected'>('scanning')

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
      // 2초 후 수집 완료 화면으로 전환
      const scanTimer = setTimeout(() => {
        setCollectPhase('collected')
      }, 2000)

      // 4초 후 실제 수집 처리
      const collectTimer = setTimeout(() => {
        onSuccess(targetSpot)
      }, 4000)

      return () => {
        clearTimeout(scanTimer)
        clearTimeout(collectTimer)
      }
    }, [onSuccess, targetSpot])

    // 수집 완료 화면
    if (collectPhase === 'collected') {
      return (
        <div className="w-full h-full bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 flex flex-col items-center justify-center relative overflow-hidden">
          {/* 배경 파티클 효과 */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/30 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>

          {/* 메인 컨텐츠 */}
          <div className="relative z-10 flex flex-col items-center animate-scaleIn">
            {/* 작품 이미지 */}
            <div className="relative">
              <div className="absolute -inset-4 bg-white/20 rounded-3xl blur-xl animate-pulse" />
              <div className={`w-48 h-48 ${targetSpot.color} rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden border-4 border-white/50 relative`}>
                <img
                  src={targetSpot.icon}
                  alt={targetSpot.korTitle}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* 반짝이 효과 */}
              <Sparkles className="absolute -top-3 -right-3 w-8 h-8 text-yellow-300 animate-pulse" />
              <Sparkles className="absolute -bottom-2 -left-2 w-6 h-6 text-yellow-300 animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>

            {/* 텍스트 */}
            <div className="mt-8 text-center">
              <p className="text-yellow-300 text-sm font-bold tracking-widest mb-2 animate-pulse">✨ 수집 완료! ✨</p>
              <h2 className="text-white text-3xl font-serif font-bold mb-2">{targetSpot.korTitle}</h2>
              <p className="text-white/70">{targetSpot.artist}</p>
            </div>

            {/* 컬렉션 이동 안내 */}
            <div className="mt-8 text-white/60 text-sm animate-pulse">
              컬렉션으로 이동 중...
            </div>
          </div>
        </div>
      )
    }

    // 스캔 중 화면
    return (
      <div className="w-full h-full bg-black flex flex-col items-center justify-center relative">
        <button
          onClick={onBack}
          className="absolute top-6 left-6 z-10 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition"
        >
          <X size={20} />
        </button>

        {/* 스캔 프레임 */}
        <div className="relative w-72 h-72 rounded-3xl overflow-hidden">
          {/* 작품 이미지 미리보기 (흐릿하게) */}
          <div className={`absolute inset-0 ${targetSpot.color} flex items-center justify-center`}>
            <img
              src={targetSpot.icon}
              alt={targetSpot.korTitle}
              className="w-full h-full object-cover opacity-30 blur-sm"
            />
          </div>

          {/* 스캔 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-500/30" />

          {/* 스캔 라인 */}
          <div
            className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent"
            style={{
              animation: 'scanDown 2s ease-in-out infinite',
            }}
          />

          {/* 코너 프레임 */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-white rounded-tl-3xl" />
          <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-white rounded-tr-3xl" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-white rounded-bl-3xl" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-white rounded-br-3xl" />
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
