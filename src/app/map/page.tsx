'use client';

import { useCollection } from '@/hooks/useCollection';
import { ARTSPOT } from '@/lib/data';
import GameNav from '@/components/layout/GameNav';

export default function MapPage() {
  const { getCollectionCount } = useCollection();
  
  return (
    <div className="h-screen bg-gray-900">
      {/* 지도 컨테이너 */}
      <div className="relative w-full h-full bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
        {/* Map Grid Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="w-full h-full" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(255,255,255,0.1) 50px, rgba(255,255,255,0.1) 51px), repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(255,255,255,0.1) 50px, rgba(255,255,255,0.1) 51px)'
          }}></div>
        </div>

        {/* Art Spot Marker */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center animate-fade-in-up">
            <div className="text-8xl mb-4 animate-float">📍</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {ARTSPOT.nameKo}
            </h2>
            <p className="text-gray-300 mb-1">{ARTSPOT.addressKo}</p>
            <p className="text-sm text-gray-400 mb-6">
              위도: {ARTSPOT.latitude}, 경도: {ARTSPOT.longitude}
            </p>
            
            {/* 액션 버튼 */}
            <div className="space-y-3 max-w-sm mx-auto px-4">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${ARTSPOT.latitude},${ARTSPOT.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition-all active:scale-95 shadow-lg"
              >
                🗺️ Google Maps에서 보기
              </a>
              <a
                href="/scan"
                className="block w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg transition-all active:scale-95 shadow-lg"
              >
                📷 AR 스캔 시작
              </a>
            </div>
          </div>
        </div>

        {/* 정보 카드 */}
        <div className="absolute bottom-24 left-0 right-0 px-4">
          <div className="bg-black/50 backdrop-blur-xl rounded-2xl p-6 shadow-2xl max-w-md mx-auto border border-white/20">
            <h3 className="font-semibold text-white mb-3">
              💡 방문 가이드
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>아트스팟 반경 100m 이내에서 작품 수집 가능</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{ARTSPOT.hintKo}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>AR 스캔으로 작품 발견하기</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <GameNav collectionCount={getCollectionCount()} />
    </div>
  );
}
