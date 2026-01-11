import { MapPin, Scan, Lock, ZoomIn, ZoomOut, Navigation } from 'lucide-react'
import { useState, useRef } from 'react'
import type { ArtSpot } from '@/lib/types'

interface MapViewProps {
  spots: ArtSpot[]
  targetSpot: ArtSpot | null
  isNearTarget: boolean
  onSelectSpot: (spot: ArtSpot) => void
  onScanClick: () => void
  userLat: number | null
  userLng: number | null
}

export default function MapView({
  spots,
  targetSpot,
  isNearTarget,
  onSelectSpot,
  onScanClick,
  userLat,
  userLng
}: MapViewProps) {
  const [zoom, setZoom] = useState(2.5)
  const [offset, setOffset] = useState({ x: 0, y: -100 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const mapRef = useRef<HTMLDivElement>(null)

  // 드래그 시작
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true)
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    dragStart.current = { x: clientX - offset.x, y: clientY - offset.y }
  }

  // 드래그 중
  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return
    e.preventDefault()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    setOffset({
      x: clientX - dragStart.current.x,
      y: clientY - dragStart.current.y
    })
  }

  // 드래그 종료
  const handleDragEnd = () => {
    setIsDragging(false)
  }

  // 내 위치로 리셋
  const resetToMyLocation = () => {
    setOffset({ x: 0, y: -100 })
    setZoom(2.5)
  }

  // GPS 좌표를 화면 좌표로 변환 (상대적 위치 계산)
  const getPosition = (lat: number, lng: number) => {
    if (!userLat || !userLng) {
      return { x: 50, y: 50 }
    }

    // 비발디파크 중심 기준 (37.6524, 127.6874)
    const centerLat = 37.6524
    const centerLng = 127.6874
    
    // 위도/경도 차이를 픽셀로 변환 (1도 ≈ 111km)
    const latDiff = (lat - centerLat) * 111000 // 미터
    const lngDiff = (lng - centerLng) * 88000 // 한국 위도에서 경도 보정
    
    // 화면 중앙을 기준으로 상대 위치 계산 (100m = 7%로 스케일 조정)
    const x = 50 + (lngDiff / 100) * 7 * zoom
    const y = 50 - (latDiff / 100) * 7 * zoom
    
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) }
  }

  const userPos = userLat && userLng ? getPosition(userLat, userLng) : null

  return (
    <div className="w-full h-full bg-slate-100 relative overflow-hidden">
      {/* 지도 배경 */}
      <div 
        ref={mapRef}
        className="absolute inset-0 transition-transform duration-300"
        style={{ 
          transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${offset.y / zoom}px)`,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
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

        {/* 사용자 위치 마커 (파란 점) - GPS 기반 위치 */}
        {userPos && (
          <div 
            className="absolute" 
            style={{ 
              left: `${userPos.x}%`, 
              top: `${userPos.y}%`, 
              transform: 'translate(-50%, -50%)' 
            }}
          >
            <div className="relative">
              <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg z-10" />
              <div className="absolute inset-0 w-4 h-4 bg-blue-400 rounded-full animate-ping" />
            </div>
          </div>
        )}

        {/* 아트스팟 마커들 - GPS 기반 위치 */}
        {spots.map((spot) => {
          const pos = getPosition(spot.lat, spot.lng)
          return (
            <button
              key={spot.id}
              onClick={() => onSelectSpot(spot)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-all duration-300"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`
              }}
            >
              <div className="relative">
                <div className={`w-14 h-14 ${spot.color} rounded-2xl shadow-lg flex items-center justify-center overflow-hidden border-2 ${
                  targetSpot?.id === spot.id ? 'border-neutral-900 ring-4 ring-neutral-900/20' : 'border-white'
                }`}>
                  <img src={spot.icon} alt={spot.korTitle} className="w-full h-full object-cover" />
                </div>
                
                {/* Coming Soon 배지 (가상 작품) */}
                {!spot.isActive && (
                  <div className="absolute -top-2 -right-2 bg-purple-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                    SOON
                  </div>
                )}

                {/* 거리 표시 */}
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <div className="text-xs font-bold bg-white px-2 py-1 rounded-full shadow">
                    {spot.distance || '계산 중...'}
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* 줌 컨트롤 */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <button
          onClick={() => setZoom(Math.min(2, zoom + 0.25))}
          className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition"
        >
          <ZoomIn size={20} />
        </button>
        <button
          onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
          className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition"
        >
          <ZoomOut size={20} />
        </button>
        <button
          onClick={resetToMyLocation}
          className="w-10 h-10 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 transition"
          title="내 위치로"
        >
          <Navigation size={20} />
        </button>
      </div>

      {/* 하단 시트 */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl p-6">
        {targetSpot ? (
          <div>
            <div className="flex items-start gap-4">
              <div className={`w-16 h-16 ${targetSpot.color} rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0`}>
                <img src={targetSpot.icon} alt={targetSpot.korTitle} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-2xl font-bold">{targetSpot.korTitle}</h3>
                  {!targetSpot.isActive && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-bold">
                      Coming Soon
                    </span>
                  )}
                </div>
                <p className="text-neutral-600 mb-1">{targetSpot.artist}</p>
                <p className="text-sm text-neutral-500">{targetSpot.description}</p>
              </div>
            </div>
            
            {/* QR 스캔 버튼 */}
            {targetSpot.isActive ? (
              isNearTarget ? (
                <button
                  onClick={onScanClick}
                  className="w-full mt-4 bg-neutral-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors"
                >
                  <Scan size={20} />
                  QR 스캔하기
                </button>
              ) : (
                <div className="w-full mt-4 bg-neutral-200 text-neutral-500 py-4 rounded-xl font-bold flex items-center justify-center gap-2">
                  <Lock size={20} />
                  <span>{targetSpot.distance} | 100m 이내로 이동</span>
                </div>
              )
            ) : (
              <button
                onClick={onScanClick}
                className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <Scan size={20} />
                가상 체험하기
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
