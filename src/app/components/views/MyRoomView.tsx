'use client'

import { useState, useEffect, useRef } from 'react'
import { Home, X, ExternalLink } from 'lucide-react'
import type { ArtItem } from '@/lib/types'

interface MyRoomViewProps {
  inventory: ArtItem[]
}

type PlacedItem = ArtItem & { uid: string; x: number; y: number }

export default function MyRoomView({ inventory }: MyRoomViewProps) {
  const [activeTab, setActiveTab] = useState<'virtual' | 'ar'>('virtual')
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([])
  const [arPlaneDetected, setArPlaneDetected] = useState(false)
  const [draggingItem, setDraggingItem] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

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
      x: Math.random() * 60 + 20,
      y: Math.random() * 50 + 25
    }
    setPlacedItems([...placedItems, newItem])
  }

  const handleRemove = (uid: string) => {
    setPlacedItems(placedItems.filter(item => item.uid !== uid))
  }

  const handleDragStart = (e: React.MouseEvent, uid: string) => {
    e.preventDefault()
    setDraggingItem(uid)
  }

  const handleDrag = (e: React.MouseEvent) => {
    if (!draggingItem || !containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    setPlacedItems(items =>
      items.map(item =>
        item.uid === draggingItem
          ? { ...item, x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) }
          : item
      )
    )
  }

  const handleDragEnd = () => {
    setDraggingItem(null)
  }

  const handleViewAR = (item: ArtItem) => {
    if (item.arUrl && item.arUrl !== '#') {
      window.open(item.arUrl, '_blank')
    }
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
      <div 
        ref={containerRef}
        className="flex-1 relative overflow-hidden"
        onMouseMove={handleDrag}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        {activeTab === 'virtual' ? (
          <div className="w-full h-full relative" style={{ perspective: '1200px' }}>
            {/* 방 배경 - 더 현실적인 갤러리 느낌 */}
            <div className="absolute inset-0">
              {/* 바닥 */}
              <div 
                className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-b from-neutral-300 to-neutral-400"
                style={{ 
                  transform: 'rotateX(60deg) translateZ(-200px)',
                  transformOrigin: 'bottom',
                  backgroundImage: 'repeating-linear-gradient(90deg, rgba(0,0,0,0.05) 0px, transparent 1px, transparent 100px, rgba(0,0,0,0.05) 100px)'
                }}
              />
              {/* 벽 */}
              <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-gray-200" />
              {/* 조명 효과 */}
              <div className="absolute top-0 left-1/2 w-96 h-96 bg-yellow-100/30 rounded-full blur-3xl transform -translate-x-1/2" />
            </div>
            
            {/* 배치된 아이템들 */}
            {placedItems.map((item) => (
              <div
                key={item.uid}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all group"
                style={{ 
                  left: `${item.x}%`, 
                  top: `${item.y}%`,
                  cursor: draggingItem === item.uid ? 'grabbing' : 'grab'
                }}
                onMouseDown={(e) => handleDragStart(e, item.uid)}
              >
                <div className="relative">
                  {/* 액자 프레임 */}
                  <div className={`w-28 h-36 ${item.color} rounded-lg shadow-2xl flex flex-col items-center justify-center text-4xl border-8 border-amber-900 bg-gradient-to-br from-white to-gray-50`}>
                    {item.icon}
                    <div className="text-xs font-bold mt-2 text-neutral-700">{item.korTitle}</div>
                  </div>
                  {/* 벽 그림자 */}
                  <div className="absolute -bottom-2 -right-2 w-full h-full bg-black/5 rounded-lg -z-10 blur-sm" />
                  
                  {/* AR 보기 버튼 (실제 작품인 경우) */}
                  {item.arUrl && item.arUrl !== '#' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleViewAR(item)
                      }}
                      className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 whitespace-nowrap"
                    >
                      <ExternalLink size={12} />
                      AR 보기
                    </button>
                  )}
                  
                  {/* 삭제 버튼 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemove(item.uid)
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <X className="text-white" size={12} />
                  </button>
                </div>
              </div>
            ))}

            {placedItems.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-neutral-500">
                  <Home size={64} className="mx-auto mb-4" />
                  <p className="text-lg font-bold">나만의 갤러리를 꾸며보세요</p>
                  <p className="text-sm mt-2">하단에서 작품을 선택하여 배치하고<br/>드래그로 위치를 조정하세요</p>
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
                  <div
                    key={item.uid}
                    className="absolute transform -translate-x-1/2 transition-all group"
                    style={{ 
                      left: `${item.x}%`, 
                      bottom: `${item.y}%`,
                      cursor: draggingItem === item.uid ? 'grabbing' : 'grab'
                    }}
                    onMouseDown={(e) => handleDragStart(e, item.uid)}
                  >
                    <div className="relative animate-float">
                      <div className={`w-32 h-40 ${item.color} rounded-lg shadow-2xl flex items-center justify-center text-5xl border-4 border-white`}>
                        {item.icon}
                      </div>
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                        {item.korTitle}
                      </div>
                      
                      {/* AR 보기 버튼 */}
                      {item.arUrl && item.arUrl !== '#' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleViewAR(item)
                          }}
                          className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                        >
                          <ExternalLink size={12} />
                          AR
                        </button>
                      )}
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemove(item.uid)
                        }}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <X className="text-white" size={16} />
                      </button>
                    </div>
                  </div>
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
                className={`flex-shrink-0 ${item.color} w-20 h-20 rounded-xl flex items-center justify-center text-3xl border-2 border-white shadow-lg hover:scale-110 transition-all relative ${
                  activeTab === 'ar' && !arPlaneDetected ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {item.icon}
                {item.arUrl && item.arUrl !== '#' && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <ExternalLink size={10} className="text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
