import { Box, MapPin, Trash2, ExternalLink } from 'lucide-react'
import type { ArtItem } from '@/lib/types'

interface CollectionViewProps {
  inventory: ArtItem[]
  onRemove: (id: string) => void
}

export default function CollectionView({ inventory, onRemove }: CollectionViewProps) {
  const handleViewArt = (item: ArtItem) => {
    if (item.arUrl && item.arUrl !== '#') {
      window.open(item.arUrl, '_blank')
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inventory.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden group relative"
              >
                {/* 삭제 버튼 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (confirm(`${item.korTitle}을(를) 컬렉션에서 삭제하시겠습니까?`)) {
                      onRemove(item.id)
                    }
                  }}
                  className="absolute top-4 right-4 z-10 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600"
                  title="삭제"
                >
                  <Trash2 size={16} />
                </button>

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

                  {/* AR 보기 버튼 */}
                  {item.arUrl && item.arUrl !== '#' && (
                    <button
                      onClick={() => handleViewArt(item)}
                      className="w-full mt-4 bg-neutral-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors"
                    >
                      <ExternalLink size={18} />
                      AR로 보기
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
