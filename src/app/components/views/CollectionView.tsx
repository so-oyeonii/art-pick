import { Box, MapPin, Trash2, ExternalLink, Map, X } from 'lucide-react'
import { useState } from 'react'
import type { ArtItem } from '@/lib/types'

interface CollectionViewProps {
  inventory: ArtItem[]
  onRemove: (id: string) => void
  onNavigateToSpot?: (item: ArtItem) => void
}

export default function CollectionView({ inventory, onRemove, onNavigateToSpot }: CollectionViewProps) {
  const [selectedImage, setSelectedImage] = useState<ArtItem | null>(null)

  const handleViewArt = (item: ArtItem) => {
    if (item.arUrl && item.arUrl !== '#') {
      window.open(item.arUrl, '_blank')
    }
  }

  const handleCardClick = (item: ArtItem) => {
    console.log('카드 클릭:', item.korTitle, 'arUrl:', item.arUrl)
    // 실제 AR 작품이면 바로 AR 링크로 이동
    if (item.arUrl && item.arUrl !== '#') {
      console.log('AR 링크로 이동:', item.arUrl)
      handleViewArt(item)
    } else {
      // 가상 작품이면 팝업으로 이미지 보기
      console.log('팝업 열기')
      setSelectedImage(item)
    }
  }

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inventory.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden group relative border border-neutral-100"
              >
                {/* 삭제 버튼 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (confirm(`${item.korTitle}을(를) 컬렉션에서 삭제하시겠습니까?`)) {
                      onRemove(item.id)
                    }
                  }}
                  className="absolute top-3 right-3 z-10 w-7 h-7 bg-neutral-100 text-neutral-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-500 hover:text-white"
                  title="삭제"
                >
                  <Trash2 size={14} />
                </button>

                <div className="p-4">
                  <div className="flex items-start gap-3">
                    {/* 이미지 */}
                    <div className={`w-16 h-16 ${item.color} rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 p-1.5`}>
                      <img
                        src={item.icon}
                        alt={item.korTitle}
                        className="w-full h-full object-contain"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          const parent = e.currentTarget.parentElement
                          if (parent && !parent.querySelector('.fallback-icon')) {
                            const fallback = document.createElement('div')
                            fallback.className = 'fallback-icon text-3xl'
                            fallback.textContent = item.korTitle.charAt(0)
                            parent.appendChild(fallback)
                          }
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-lg font-bold mb-0.5 truncate">{item.korTitle}</h3>
                      <p className="text-neutral-500 text-sm">{item.artist}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-semibold rounded-full">
                          <MapPin size={10} />
                          수집완료
                        </span>
                        {item.collectedAt && (
                          <span className="text-[10px] text-neutral-400">
                            {new Date(item.collectedAt).toLocaleDateString('ko-KR')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* AR 체험 버튼 */}
                  <button
                    onClick={() => handleCardClick(item)}
                    className={`w-full mt-3 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                      item.arUrl && item.arUrl !== '#'
                        ? 'bg-neutral-900 text-white hover:bg-neutral-800'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    <ExternalLink size={16} />
                    {item.arUrl && item.arUrl !== '#' ? 'AR 체험하기' : '이미지 보기'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 이미지 팝업 */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors z-10"
          >
            <X size={24} className="text-neutral-900" />
          </button>
          
          <div className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className={`w-full aspect-square ${selectedImage.color} flex items-center justify-center p-8`}>
              <img 
                src={selectedImage.icon} 
                alt={selectedImage.korTitle}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="p-6">
              <h3 className="font-serif text-2xl font-bold mb-2">{selectedImage.korTitle}</h3>
              <p className="text-neutral-600 mb-3">{selectedImage.artist}</p>
              <p className="text-neutral-700">{selectedImage.description}</p>
              
              {/* AR 보기 버튼 */}
              {selectedImage.arUrl && selectedImage.arUrl !== '#' && (
                <button
                  onClick={() => handleViewArt(selectedImage)}
                  className="w-full mt-4 bg-neutral-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors"
                >
                  <ExternalLink size={18} />
                  AR로 보기
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
