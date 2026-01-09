'use client'

import { useState, useEffect } from 'react'
import { MapPin, Box, Home, ArrowRight, X, Scan, Check } from 'lucide-react'
import { ART_SPOTS } from '@/lib/data'
import { saveCollection, loadCollection } from '@/lib/storage'
import type { ArtItem, ArtSpot, ViewType, ToastNotification } from '@/lib/types'

export default function App() {
  // State Management
  const [currentView, setCurrentView] = useState<ViewType>('home')
  const [inventory, setInventory] = useState<ArtItem[]>([])
  const [targetSpot, setTargetSpot] = useState<ArtSpot | null>(null)
  const [isNearTarget, setIsNearTarget] = useState(false)
  const [notification, setNotification] = useState<ToastNotification | null>(null)

  // localStorage 동기화 - 불러오기
  useEffect(() => {
    const saved = loadCollection()
    if (saved) setInventory(saved)
  }, [])

  // localStorage 동기화 - 저장
  useEffect(() => {
    if (inventory.length > 0) {
      saveCollection(inventory)
    }
  }, [inventory])

  // Handlers
  const showToast = (title: string, msg: string) => {
    setNotification({ title, msg })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleStartNavigation = (spot: ArtSpot) => {
    setTargetSpot(spot)
    setIsNearTarget(false)
    setCurrentView('map')
    
    // 이동 시뮬레이션 (4초)
    setTimeout(() => {
      setIsNearTarget(true)
      showToast('목적지 도착', `${spot.korTitle}에 도착했습니다!`)
    }, 4000)
  }

  const handleScanSuccess = (art: ArtItem) => {
    // 이미 수집된 작품인지 확인
    const alreadyCollected = inventory.some(item => item.id === art.id)
    
    if (!alreadyCollected) {
      const newItem = {
        ...art,
        collectedAt: new Date().toISOString()
      }
      setInventory([...inventory, newItem])
      showToast('수집 완료', `${art.korTitle}이(가) 컬렉션에 추가되었습니다!`)
    } else {
      showToast('이미 수집함', '이 작품은 이미 컬렉션에 있습니다.')
    }
    
    // 1.5초 후 Collection으로 이동
    setTimeout(() => {
      setCurrentView('collection')
    }, 1500)
  }

  return (
    <div className="w-full h-screen bg-neutral-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-white/80 backdrop-blur-md border-b border-neutral-200 flex items-center justify-between z-10">
        <div 
          className="font-serif text-2xl font-bold cursor-pointer"
          onClick={() => setCurrentView('home')}
        >
          ARt-Pick
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setCurrentView('map')}
            className={`p-2 rounded-lg transition-colors ${
              currentView === 'map' ? 'bg-neutral-900 text-white' : 'hover:bg-neutral-100'
            }`}
          >
            <MapPin size={20} />
          </button>
          <button
            onClick={() => setCurrentView('collection')}
            className={`p-2 rounded-lg transition-colors ${
              currentView === 'collection' ? 'bg-neutral-900 text-white' : 'hover:bg-neutral-100'
            }`}
          >
            <Box size={20} />
          </button>
          <button
            onClick={() => setCurrentView('myroom')}
            className={`p-2 rounded-lg transition-colors ${
              currentView === 'myroom' ? 'bg-neutral-900 text-white' : 'hover:bg-neutral-100'
            }`}
          >
            <Home size={20} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {currentView === 'home' && (
          <HomeView onStart={() => handleStartNavigation(ART_SPOTS[0])} />
        )}
        {currentView === 'map' && (
          <MapView
            spots={ART_SPOTS}
            targetSpot={targetSpot}
            isNearTarget={isNearTarget}
            onSelectSpot={handleStartNavigation}
            onScanClick={() => setCurrentView('qr_scan')}
          />
        )}
        {currentView === 'qr_scan' && targetSpot && (
          <QRScannerView
            targetSpot={targetSpot}
            onSuccess={handleScanSuccess}
            onBack={() => setCurrentView('map')}
          />
        )}
        {currentView === 'collection' && (
          <CollectionView inventory={inventory} />
        )}
        {currentView === 'myroom' && (
          <MyRoomView inventory={inventory} />
        )}
      </div>

      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
          <div className="bg-white rounded-xl shadow-2xl px-6 py-4 flex items-center gap-3 max-w-sm">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
              <Check className="text-white" size={20} />
            </div>
            <div>
              <div className="font-bold text-neutral-900">{notification.title}</div>
              <div className="text-sm text-neutral-600">{notification.msg}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// === Sub Components ===

function HomeView({ onStart }: { onStart: () => void }) {
  return (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
      {/* 배경 그라디언트 */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-white to-rose-100 animate-pulse-slow" />
      
      {/* 콘텐츠 */}
      <div className="relative z-10 text-center px-8 max-w-2xl">
        <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 text-neutral-900">
          Walk, Collect, Curate
        </h1>
        <p className="text-lg md:text-xl text-neutral-600 mb-12 leading-relaxed">
          지도를 따라 숨겨진 예술 작품을 찾고,<br />
          AR로 감상하며, 나만의 갤러리를 만드세요.
        </p>
        <button
          onClick={onStart}
          className="bg-neutral-900 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 mx-auto hover:bg-neutral-800 transition-all hover:scale-105"
        >
          탐험 시작하기
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  )
}

function MapView({
  spots,
  targetSpot,
  isNearTarget,
  onSelectSpot,
  onScanClick
}: {
  spots: ArtSpot[]
  targetSpot: ArtSpot | null
  isNearTarget: boolean
  onSelectSpot: (spot: ArtSpot) => void
  onScanClick: () => void
}) {
  return (
    <div className="w-full h-full bg-slate-100 relative overflow-hidden">
      {/* 지도 배경 */}
      <div className="absolute inset-0">
        {/* 그리드 패턴 */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
        
        {/* 가짜 도로 */}
        <svg className="absolute inset-0 w-full h-full opacity-40">
          <path d="M 0 50 Q 200 100 400 50 T 800 50" stroke="#9CA3AF" strokeWidth="4" fill="none" />
          <path d="M 100 150 Q 300 200 500 150 T 900 150" stroke="#9CA3AF" strokeWidth="4" fill="none" />
        </svg>
      </div>

      {/* 사용자 위치 마커 (파란 점) */}
      <div className="absolute" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
        <div className="relative">
          <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg" />
          <div className="absolute inset-0 w-4 h-4 bg-blue-400 rounded-full animate-ping" />
        </div>
      </div>

      {/* 아트스팟 마커들 */}
      {spots.map((spot, index) => (
        <button
          key={spot.id}
          onClick={() => onSelectSpot(spot)}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-all duration-300"
          style={{
            left: `${30 + index * 25}%`,
            top: `${30 + index * 15}%`
          }}
        >
          <div className={`w-16 h-16 ${spot.color} rounded-2xl shadow-lg flex items-center justify-center text-3xl border-2 ${
            targetSpot?.id === spot.id ? 'border-neutral-900 ring-4 ring-neutral-900/20' : 'border-white'
          }`}>
            {spot.icon}
          </div>
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
            <div className="text-xs font-bold bg-white px-2 py-1 rounded-full shadow">
              {spot.distance}
            </div>
          </div>
        </button>
      ))}

      {/* 하단 시트 */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl p-6">
        {targetSpot ? (
          <div>
            <div className="flex items-start gap-4">
              <div className={`w-16 h-16 ${targetSpot.color} rounded-xl flex items-center justify-center text-3xl flex-shrink-0`}>
                {targetSpot.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-2xl font-bold mb-1">{targetSpot.korTitle}</h3>
                <p className="text-neutral-600 mb-1">{targetSpot.artist}</p>
                <p className="text-sm text-neutral-500">{targetSpot.description}</p>
              </div>
            </div>
            
            {isNearTarget && (
              <button
                onClick={onScanClick}
                className="w-full mt-4 bg-neutral-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors"
              >
                <Scan size={20} />
                QR 스캔하기
              </button>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <MapPin className="mx-auto mb-3 text-neutral-400" size={32} />
            <p className="text-neutral-600">지도 위의 핀을 눌러주세요</p>
          </div>
        )}
      </div>
    </div>
  )
}

function QRScannerView({
  targetSpot,
  onSuccess,
  onBack
}: {
  targetSpot: ArtSpot
  onSuccess: (art: ArtItem) => void
  onBack: () => void
}) {
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

function CollectionView({ inventory }: { inventory: ArtItem[] }) {
  return (
    <div className="w-full h-full overflow-y-auto bg-neutral-50">
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="font-serif text-3xl font-bold mb-6">My Collection</h2>
        
        {inventory.length === 0 ? (
          <div className="text-center py-20">
            <Box className="mx-auto mb-4 text-neutral-400" size={48} />
            <p className="text-neutral-600 text-lg">아직 수집된 작품이 없습니다</p>
            <p className="text-neutral-500 text-sm mt-2">지도에서 아트스팟을 찾아보세요!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inventory.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-20 h-20 ${item.color} rounded-xl flex items-center justify-center text-4xl flex-shrink-0`}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-serif text-xl font-bold mb-1">{item.korTitle}</h3>
                      <p className="text-neutral-600 text-sm mb-2">{item.artist}</p>
                      <p className="text-neutral-500 text-sm line-clamp-2">{item.description}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full">
                      <MapPin size={12} />
                      LBS GET
                    </span>
                    {item.collectedAt && (
                      <span className="text-xs text-neutral-400">
                        {new Date(item.collectedAt).toLocaleDateString('ko-KR')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function MyRoomView({ inventory }: { inventory: ArtItem[] }) {
  const [activeTab, setActiveTab] = useState<'virtual' | 'ar'>('virtual')
  const [placedItems, setPlacedItems] = useState<(ArtItem & { uid: string; x: number; y: number })[]>([])
  const [arPlaneDetected, setArPlaneDetected] = useState(false)

  // AR 모드일 때 바닥 감지 시뮬레이션
  useEffect(() => {
    if (activeTab === 'ar') {
      setArPlaneDetected(false)
      const timeout = setTimeout(() => setArPlaneDetected(true), 2000)
      return () => clearTimeout(timeout)
    }
  }, [activeTab])

  const handlePlace = (item: ArtItem) => {
    const newItem = {
      ...item,
      uid: `${item.id}-${Date.now()}`,
      x: Math.random() * 60 + 20, // 20-80%
      y: Math.random() * 50 + 25  // 25-75%
    }
    setPlacedItems([...placedItems, newItem])
  }

  const handleRemove = (uid: string) => {
    setPlacedItems(placedItems.filter(item => item.uid !== uid))
  }

  return (
    <div className="w-full h-full flex flex-col bg-neutral-50">
      {/* 탭 */}
      <div className="flex border-b border-neutral-200 bg-white">
        <button
          onClick={() => setActiveTab('virtual')}
          className={`flex-1 py-4 font-bold transition-colors ${
            activeTab === 'virtual' ? 'text-neutral-900 border-b-2 border-neutral-900' : 'text-neutral-400'
          }`}
        >
          🏛 가상 갤러리
        </button>
        <button
          onClick={() => setActiveTab('ar')}
          className={`flex-1 py-4 font-bold transition-colors ${
            activeTab === 'ar' ? 'text-neutral-900 border-b-2 border-neutral-900' : 'text-neutral-400'
          }`}
        >
          📱 실제 방 AR
        </button>
      </div>

      {/* 캔버스 */}
      <div className="flex-1 relative overflow-hidden">
        {activeTab === 'virtual' ? (
          <div className="w-full h-full bg-gradient-to-b from-neutral-100 to-neutral-200 relative" style={{ perspective: '1000px' }}>
            {/* 가상 방 벽 */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent" />
            
            {/* 배치된 아이템들 */}
            {placedItems.map((item) => (
              <button
                key={item.uid}
                onClick={() => handleRemove(item.uid)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-all group"
                style={{ left: `${item.x}%`, top: `${item.y}%` }}
              >
                <div className="relative">
                  {/* 프레임 */}
                  <div className={`w-24 h-32 ${item.color} rounded-lg shadow-2xl flex items-center justify-center text-4xl border-4 border-white`}>
                    {item.icon}
                  </div>
                  {/* 바닥 그림자 */}
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-2 bg-black/10 rounded-full blur-sm" />
                  {/* 삭제 힌트 */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <X className="text-white" size={12} />
                  </div>
                </div>
              </button>
            ))}

            {placedItems.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-neutral-400">
                  <Home size={48} className="mx-auto mb-2" />
                  <p>하단에서 작품을 선택하여 배치하세요</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-full bg-black relative">
            {/* AR 카메라 피드 시뮬레이션 */}
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.1) 0px, transparent 2px)',
            }} />

            {!arPlaneDetected ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-white font-bold">바닥을 인식 중...</p>
                </div>
              </div>
            ) : (
              <>
                {/* 바닥 그리드 */}
                <div className="absolute bottom-0 left-0 right-0 h-1/2 opacity-30" style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.2) 0px, transparent 1px, transparent 40px, rgba(255,255,255,0.2) 40px), repeating-linear-gradient(90deg, rgba(255,255,255,0.2) 0px, transparent 1px, transparent 40px, rgba(255,255,255,0.2) 40px)',
                  transform: 'perspective(500px) rotateX(60deg)',
                  transformOrigin: 'bottom'
                }} />

                {/* 배치된 아이템들 */}
                {placedItems.map((item) => (
                  <button
                    key={item.uid}
                    onClick={() => handleRemove(item.uid)}
                    className="absolute transform -translate-x-1/2 hover:scale-110 transition-all group animate-float"
                    style={{ left: `${item.x}%`, bottom: `${item.y}%` }}
                  >
                    <div className="relative">
                      <div className={`w-32 h-40 ${item.color} rounded-lg shadow-2xl flex items-center justify-center text-5xl border-4 border-white`}>
                        {item.icon}
                      </div>
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                        {item.korTitle}
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <X className="text-white" size={16} />
                      </div>
                    </div>
                  </button>
                ))}

                {placedItems.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <p className="font-bold mb-2">바닥이 감지되었습니다</p>
                      <p className="text-sm opacity-70">하단에서 작품을 선택하여 배치하세요</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* 인벤토리 드로어 */}
      <div className="bg-white border-t border-neutral-200 p-4">
        {inventory.length === 0 ? (
          <div className="text-center py-4 text-neutral-400 text-sm">
            먼저 작품을 수집하세요
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {inventory.map((item) => (
              <button
                key={item.id}
                onClick={() => (activeTab === 'ar' && !arPlaneDetected) ? null : handlePlace(item)}
                disabled={activeTab === 'ar' && !arPlaneDetected}
                className={`flex-shrink-0 ${item.color} w-20 h-20 rounded-xl flex items-center justify-center text-3xl border-2 border-white shadow-lg hover:scale-110 transition-all ${
                  activeTab === 'ar' && !arPlaneDetected ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {item.icon}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
