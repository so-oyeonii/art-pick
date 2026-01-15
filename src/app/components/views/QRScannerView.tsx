'use client'

import { useEffect, useRef, useState } from 'react'
import { X, AlertCircle, Sparkles, Camera, Move } from 'lucide-react'
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
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)
  const [collectPhase, setCollectPhase] = useState<'camera' | 'placing' | 'collected'>('camera')
  const [artPosition, setArtPosition] = useState({ x: 50, y: 50 })
  const [artScale, setArtScale] = useState(1)
  const [cameraReady, setCameraReady] = useState(false)

  // 가상 작품용 카메라 시작
  useEffect(() => {
    if (targetSpot?.isActive) return // 실제 QR 작품이면 패스

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setCameraReady(true)
        }
      } catch (err) {
        console.error('카메라 오류:', err)
        setError('카메라를 시작할 수 없습니다')
      }
    }

    startCamera()

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach(track => track.stop())
      }
    }
  }, [targetSpot?.isActive])

  // 가상 작품 배치 후 수집 처리
  useEffect(() => {
    if (collectPhase === 'placing') {
      const timer = setTimeout(() => {
        setCollectPhase('collected')
      }, 2500)
      return () => clearTimeout(timer)
    }

    if (collectPhase === 'collected') {
      const timer = setTimeout(() => {
        onSuccess(targetSpot)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [collectPhase, onSuccess, targetSpot])

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
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 }
          },
          (decodedText) => {
            if (decodedText.includes('swiftxr.site')) {
              scanner.stop().then(() => {
                scannerRef.current = null
                window.open(decodedText, '_blank')
                onSuccess(targetSpot)
              }).catch(console.error)
            }
          },
          () => {}
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
        scannerRef.current.stop().catch(() => {})
      }
    }
  }, [targetSpot, isNearTarget, onSuccess])

  // 가상 작품인 경우 - AR 카메라 모드
  if (!targetSpot?.isActive) {
    // 수집 완료 화면
    if (collectPhase === 'collected') {
      return (
        <div className="w-full h-full bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 flex flex-col items-center justify-center relative overflow-hidden">
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

          <div className="relative z-10 flex flex-col items-center animate-scaleIn px-6">
            <div className="relative">
              <div className="absolute -inset-4 bg-white/20 rounded-3xl blur-xl animate-pulse" />
              <div className={`w-40 h-40 sm:w-48 sm:h-48 ${targetSpot.color} rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden border-4 border-white/50`}>
                <img src={targetSpot.icon} alt={targetSpot.korTitle} className="w-full h-full object-cover" />
              </div>
              <Sparkles className="absolute -top-3 -right-3 w-8 h-8 text-yellow-300 animate-pulse" />
              <Sparkles className="absolute -bottom-2 -left-2 w-6 h-6 text-yellow-300 animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>

            <div className="mt-6 text-center">
              <p className="text-yellow-300 text-sm font-bold tracking-widest mb-2 animate-pulse">✨ 수집 완료! ✨</p>
              <h2 className="text-white text-2xl sm:text-3xl font-serif font-bold mb-2">{targetSpot.korTitle}</h2>
              <p className="text-white/70">{targetSpot.artist}</p>
            </div>

            <div className="mt-6 text-white/60 text-sm animate-pulse">
              컬렉션으로 이동 중...
            </div>
          </div>
        </div>
      )
    }

    // AR 카메라 모드 (배치 중)
    return (
      <div className="w-full h-full bg-black flex flex-col relative overflow-hidden">
        {/* 카메라 피드 */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* 카메라 오버레이 UI */}
        <div className="absolute inset-0 pointer-events-none">
          {/* 상단 그라디언트 */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/50 to-transparent" />
          {/* 하단 그라디언트 */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/70 to-transparent" />
        </div>

        {/* 닫기 버튼 */}
        <button
          onClick={onBack}
          className="absolute top-4 left-4 z-20 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 transition"
        >
          <X size={20} />
        </button>

        {/* 카메라 상태 표시 */}
        {!cameraReady && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
            <div className="text-center">
              <Camera className="w-12 h-12 text-white/60 mx-auto mb-3 animate-pulse" />
              <p className="text-white/80">카메라 시작 중...</p>
            </div>
          </div>
        )}

        {/* 에러 표시 */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
            <div className="text-center px-6">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
              <p className="text-white mb-2">카메라 오류</p>
              <p className="text-white/60 text-sm">{error}</p>
              <button onClick={onBack} className="mt-4 px-6 py-2 bg-white/20 rounded-full text-white">
                닫기
              </button>
            </div>
          </div>
        )}

        {/* AR 작품 오버레이 */}
        {cameraReady && (
          <div
            className="absolute z-10 transition-all duration-300"
            style={{
              left: `${artPosition.x}%`,
              top: `${artPosition.y}%`,
              transform: `translate(-50%, -50%) scale(${artScale})`,
            }}
          >
            {/* 작품 이미지 */}
            <div className={`relative ${collectPhase === 'placing' ? 'animate-pulse' : ''}`}>
              {/* 그림자 */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-4 bg-black/30 rounded-full blur-md" />

              {/* 작품 */}
              <div className={`w-36 h-36 sm:w-44 sm:h-44 ${targetSpot.color} rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden border-4 border-white/80 ${
                collectPhase === 'placing' ? 'ring-4 ring-green-400 ring-opacity-75' : ''
              }`}>
                <img
                  src={targetSpot.icon}
                  alt={targetSpot.korTitle}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 배치 중 표시 */}
              {collectPhase === 'placing' && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap animate-bounce">
                  배치 완료!
                </div>
              )}
            </div>
          </div>
        )}

        {/* 하단 UI */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 pb-8">
          <div className="bg-black/60 backdrop-blur-md rounded-2xl p-4">
            {collectPhase === 'camera' ? (
              <>
                <div className="text-center mb-4">
                  <h3 className="text-white font-bold text-lg">{targetSpot.korTitle}</h3>
                  <p className="text-white/60 text-sm flex items-center justify-center gap-1 mt-1">
                    <Move size={14} />
                    작품을 원하는 위치에 배치하세요
                  </p>
                </div>

                {/* 배치 버튼 */}
                <button
                  onClick={() => setCollectPhase('placing')}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  <Sparkles size={18} />
                  여기에 배치하기
                </button>
              </>
            ) : (
              <div className="text-center py-2">
                <p className="text-green-400 font-bold animate-pulse">✨ 작품을 수집하는 중...</p>
              </div>
            )}
          </div>
        </div>

        {/* 조준점 (배치 전) */}
        {collectPhase === 'camera' && cameraReady && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-5">
            <div className="w-20 h-20 border-2 border-white/30 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white/50 rounded-full" />
            </div>
          </div>
        )}
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
