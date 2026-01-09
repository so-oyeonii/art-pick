'use client'

import { useState, useEffect } from 'react'
import { Home, X } from 'lucide-react'
import type { ArtItem } from '@/lib/types'

interface MyRoomViewProps {
  inventory: ArtItem[]
}

type PlacedItem = ArtItem & { uid: string; x: number; y: number }

export default function MyRoomView({ inventory }: MyRoomViewProps) {
  const [activeTab, setActiveTab] = useState<'virtual' | 'ar'>('virtual')
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([])
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
    const newItem: PlacedItem = {
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
