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
        {/* 지도 배경 - 녹지/공원 영역 */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-green-50 to-emerald-100" />

        {/* 지형 텍스처 */}
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <pattern id="grass" patternUnits="userSpaceOnUse" width="20" height="20">
              <circle cx="3" cy="3" r="1" fill="#86efac" opacity="0.4" />
              <circle cx="13" cy="8" r="0.8" fill="#86efac" opacity="0.3" />
              <circle cx="8" cy="15" r="1.2" fill="#86efac" opacity="0.35" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grass)" />
        </svg>

        {/* 도로 네트워크 */}
        <svg className="absolute inset-0 w-full h-full">
          {/* 메인 도로 (굵음) */}
          <path d="M 0 180 Q 150 200 300 180 Q 450 160 600 180 Q 750 200 900 180"
                stroke="#e5e7eb" strokeWidth="24" fill="none" strokeLinecap="round" />
          <path d="M 0 180 Q 150 200 300 180 Q 450 160 600 180 Q 750 200 900 180"
                stroke="#f3f4f6" strokeWidth="20" fill="none" strokeLinecap="round" />

          {/* 세로 메인 도로 */}
          <path d="M 200 0 Q 180 150 200 300 Q 220 450 200 600"
                stroke="#e5e7eb" strokeWidth="20" fill="none" strokeLinecap="round" />
          <path d="M 200 0 Q 180 150 200 300 Q 220 450 200 600"
                stroke="#f3f4f6" strokeWidth="16" fill="none" strokeLinecap="round" />

          {/* 보조 도로들 */}
          <path d="M 0 350 L 400 350" stroke="#e5e7eb" strokeWidth="12" fill="none" strokeLinecap="round" />
          <path d="M 0 350 L 400 350" stroke="#f9fafb" strokeWidth="8" fill="none" strokeLinecap="round" />

          <path d="M 350 100 Q 380 250 350 400" stroke="#e5e7eb" strokeWidth="10" fill="none" strokeLinecap="round" />
          <path d="M 350 100 Q 380 250 350 400" stroke="#f9fafb" strokeWidth="6" fill="none" strokeLinecap="round" />

          {/* 산책로 (점선) */}
          <path d="M 50 80 Q 200 120 350 80 Q 500 40 650 80"
                stroke="#d1d5db" strokeWidth="3" fill="none" strokeDasharray="8,6" />
          <path d="M 100 450 Q 250 420 400 450"
                stroke="#d1d5db" strokeWidth="3" fill="none" strokeDasharray="8,6" />
        </svg>

        {/* 건물/시설 블록 */}
        <svg className="absolute inset-0 w-full h-full">
          {/* 건물 그룹 1 */}
          <rect x="40" y="220" width="60" height="45" rx="4" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
          <rect x="110" y="230" width="40" height="35" rx="3" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />

          {/* 건물 그룹 2 */}
          <rect x="250" y="200" width="50" height="40" rx="4" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
          <rect x="310" y="210" width="35" height="30" rx="3" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />

          {/* 건물 그룹 3 */}
          <rect x="80" y="380" width="70" height="50" rx="5" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
          <rect x="160" y="395" width="45" height="35" rx="3" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />

          {/* 랜드마크 건물 */}
          <rect x="220" y="280" width="80" height="60" rx="6" fill="#dbeafe" stroke="#93c5fd" strokeWidth="2" />

          {/* 작은 시설물들 */}
          <circle cx="380" cy="320" r="15" fill="#fef3c7" stroke="#fcd34d" strokeWidth="1" />
          <circle cx="70" cy="130" r="12" fill="#fce7f3" stroke="#f9a8d4" strokeWidth="1" />
        </svg>

        {/* 나무/녹지 장식 */}
        <svg className="absolute inset-0 w-full h-full opacity-60">
          <circle cx="30" cy="50" r="8" fill="#86efac" />
          <circle cx="50" cy="65" r="6" fill="#86efac" />
          <circle cx="420" cy="280" r="10" fill="#86efac" />
          <circle cx="440" cy="300" r="7" fill="#86efac" />
          <circle cx="320" cy="450" r="9" fill="#86efac" />
          <circle cx="150" cy="500" r="8" fill="#86efac" />
          <circle cx="500" cy="150" r="11" fill="#86efac" />
          <circle cx="520" cy="170" r="7" fill="#86efac" />
        </svg>

        {/* 물/연못 */}
        <svg className="absolute inset-0 w-full h-full">
          <ellipse cx="450" cy="380" rx="40" ry="25" fill="#bfdbfe" opacity="0.7" />
          <ellipse cx="450" cy="380" rx="30" ry="18" fill="#93c5fd" opacity="0.5" />
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
          const isSelected = targetSpot?.id === spot.id
          return (
            <button
              key={spot.id}
              onClick={() => onSelectSpot(spot)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-all duration-200"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`
              }}
            >
              <div className="relative">
                {/* 선택된 마커 배경 효과 */}
                {isSelected && (
                  <div className="absolute -inset-1 bg-neutral-900/20 rounded-xl animate-pulse" />
                )}
                <div className={`w-9 h-9 ${spot.color} rounded-xl shadow-md flex items-center justify-center overflow-hidden border-2 ${
                  isSelected ? 'border-neutral-900 ring-2 ring-neutral-900/30' : 'border-white/90'
                }`}>
                  <img src={spot.icon} alt={spot.korTitle} className="w-full h-full object-cover" />
                </div>

                {/* Coming Soon 배지 (가상 작품) */}
                {!spot.isActive && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full shadow" />
                )}

                {/* 거리 표시 - 선택된 것만 표시 */}
                {isSelected && (
                  <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <div className="text-[10px] font-semibold bg-white/95 px-1.5 py-0.5 rounded-full shadow-sm">
                      {spot.distance || '...'}
                    </div>
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* 줌 컨트롤 */}
      <div className="absolute top-4 right-4 flex flex-col gap-1.5 z-10">
        <button
          onClick={() => setZoom(Math.min(3, zoom + 0.3))}
          className="w-9 h-9 bg-white/95 backdrop-blur-sm rounded-xl shadow-md flex items-center justify-center hover:bg-white active:scale-95 transition-all"
        >
          <ZoomIn size={18} className="text-neutral-700" />
        </button>
        <button
          onClick={() => setZoom(Math.max(0.8, zoom - 0.3))}
          className="w-9 h-9 bg-white/95 backdrop-blur-sm rounded-xl shadow-md flex items-center justify-center hover:bg-white active:scale-95 transition-all"
        >
          <ZoomOut size={18} className="text-neutral-700" />
        </button>
        <button
          onClick={resetToMyLocation}
          className="w-9 h-9 bg-blue-500 text-white rounded-xl shadow-md flex items-center justify-center hover:bg-blue-600 active:scale-95 transition-all"
          title="내 위치로"
        >
          <Navigation size={18} />
        </button>
      </div>

      {/* 하단 시트 */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md rounded-t-2xl shadow-xl p-4 pb-safe">
        {targetSpot ? (
          <div>
            {/* 드래그 핸들 */}
            <div className="w-10 h-1 bg-neutral-200 rounded-full mx-auto mb-3" />

            <div className="flex items-start gap-3">
              <div className={`w-14 h-14 ${targetSpot.color} rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm border border-white`}>
                <img src={targetSpot.icon} alt={targetSpot.korTitle} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-serif text-xl font-bold text-neutral-900">{targetSpot.korTitle}</h3>
                  {!targetSpot.isActive && (
                    <span className="text-[10px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full font-semibold">
                      SOON
                    </span>
                  )}
                </div>
                <p className="text-neutral-500 text-sm">{targetSpot.artist}</p>
                <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">{targetSpot.description}</p>
              </div>
            </div>

            {/* QR 스캔 버튼 */}
            {targetSpot.isActive ? (
              isNearTarget ? (
                <button
                  onClick={onScanClick}
                  className="w-full mt-3 bg-neutral-900 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-neutral-800 active:scale-[0.98] transition-all"
                >
                  <Scan size={18} />
                  QR 스캔하기
                </button>
              ) : (
                <div className="w-full mt-3 bg-neutral-100 text-neutral-500 py-3 rounded-xl font-medium flex items-center justify-center gap-2 text-sm">
                  <Lock size={16} />
                  <span>{targetSpot.distance} | 100m 이내로 이동하세요</span>
                </div>
              )
            ) : (
              <button
                onClick={onScanClick}
                className="w-full mt-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
              >
                <Scan size={18} />
                가상 체험하기
              </button>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-10 h-1 bg-neutral-200 rounded-full mx-auto mb-4" />
            <MapPin className="mx-auto mb-2 text-neutral-300" size={28} />
            <p className="text-neutral-500 text-sm">지도 위의 핀을 눌러주세요</p>
          </div>
        )}
      </div>
    </div>
  )
}
