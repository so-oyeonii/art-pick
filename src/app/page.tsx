'use client'

import { useState, useEffect } from 'react'
import { MapPin, Box, Home } from 'lucide-react'
import { ART_SPOTS } from '@/lib/data'
import { saveCollection, loadCollection } from '@/lib/storage'
import { calculateDistance, formatDistance, isWithinRange } from '@/lib/geo'
import { useGeolocation } from '@/hooks/useGeolocation'
import type { ArtItem, ArtSpot, ViewType, ToastNotification as ToastNotificationType } from '@/lib/types'

// View Components
import HomeView from './components/views/HomeView'
import MapView from './components/views/MapView'
import QRScannerView from './components/views/QRScannerView'
import CollectionView from './components/views/CollectionView'
import MyRoomView from './components/views/MyRoomView'
import ToastNotification from './components/shared/ToastNotification'

export default function App() {
  // GPS 위치 추적
  const { latitude, longitude, loading: gpsLoading, error: gpsError } = useGeolocation()

  // State Management
  const [currentView, setCurrentView] = useState<ViewType>('home')
  const [inventory, setInventory] = useState<ArtItem[]>([])
  const [targetSpot, setTargetSpot] = useState<ArtSpot | null>(null)
  const [notification, setNotification] = useState<ToastNotificationType | null>(null)
  const [spotsWithDistance, setSpotsWithDistance] = useState<ArtSpot[]>(ART_SPOTS)

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

  // GPS 위치 업데이트 시 거리 계산
  useEffect(() => {
    if (latitude && longitude) {
      const updated = ART_SPOTS.map(spot => {
        const distance = calculateDistance(latitude, longitude, spot.lat, spot.lng)
        return {
          ...spot,
          distance: formatDistance(distance)
        }
      })
      setSpotsWithDistance(updated)
    }
  }, [latitude, longitude])

  // 타겟 스팟과의 거리 확인
  const isNearTarget = targetSpot && latitude && longitude
    ? isWithinRange(latitude, longitude, targetSpot.lat, targetSpot.lng, 100)
    : false

  // Handlers
  const showToast = (title: string, msg: string) => {
    setNotification({ title, msg })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleSelectSpot = (spot: ArtSpot) => {
    setTargetSpot(spot)
    if (currentView !== 'map') {
      setCurrentView('map')
    }
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
      
      // 실제 QR vs 가상 작품에 따라 다른 메시지
      if ((art as ArtSpot).isActive) {
        showToast('🎉 실제 작품 수집!', `${art.korTitle}을(를) 획득했습니다!`)
      } else {
        showToast('✨ 가상 체험 완료', `${art.korTitle} 체험이 추가되었습니다.`)
      }
    } else {
      showToast('이미 수집함', '이 작품은 이미 컬렉션에 있습니다.')
    }
    
    // QR 스캔 후 컬렉션 페이지로 이동 (수집된 작품 확인)
    setCurrentView('collection')
  }

  const handleRemoveFromCollection = (id: string) => {
    setInventory(inventory.filter(item => item.id !== id))
    showToast('삭제 완료', '컬렉션에서 제거되었습니다.')
  }

  const handleNavigateToSpot = (item: ArtItem) => {
    // 가상 작품을 컬렉션에서 선택 시 지도로 이동하고 해당 spot 선택
    const spot = spotsWithDistance.find(s => s.id === item.id)
    if (spot) {
      setTargetSpot(spot)
      setCurrentView('map')
      showToast('위치 표시', `${spot.korTitle}의 위치를 지도에 표시했습니다`)
    }
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
        
        {/* GPS 상태 표시 */}
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          {gpsLoading && <span>📍 GPS 로딩 중...</span>}
          {gpsError && <span className="text-red-500">⚠️ GPS 오류</span>}
          {latitude && longitude && (
            <span className="text-green-600">✓ GPS 활성화</span>
          )}
        </div>

        {/* Navigation */}
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
          <HomeView onStart={() => setCurrentView('map')} />
        )}
        
        {currentView === 'map' && (
          <MapView
            spots={spotsWithDistance}
            targetSpot={targetSpot}
            isNearTarget={isNearTarget}
            onSelectSpot={handleSelectSpot}
            onScanClick={() => setCurrentView('qr_scan')}
            userLat={latitude}
            userLng={longitude}
          />
        )}
        
        {currentView === 'qr_scan' && targetSpot && (
          <QRScannerView
            targetSpot={targetSpot}
            onSuccess={handleScanSuccess}
            onBack={() => setCurrentView('map')}
            isNearTarget={isNearTarget}
          />
        )}
        
        {currentView === 'collection' && (
          <CollectionView 
            inventory={inventory}
            onRemove={handleRemoveFromCollection}
            onNavigateToSpot={handleNavigateToSpot}
          />
        )}
        
        {currentView === 'myroom' && (
          <MyRoomView inventory={inventory} />
        )}
      </div>

      {/* Toast Notification */}
      {notification && (
        <ToastNotification notification={notification} />
      )}
    </div>
  )
}
