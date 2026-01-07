'use client';

import { useState, useEffect } from 'react';
import { useCollection } from '@/hooks/useCollection';
import { ARTWORK, ARTSPOT } from '@/lib/data';
import Notification from '@/components/ui/Notification';
import GameNav from '@/components/layout/GameNav';

export default function ScanPage() {
  const { addToCollection, isCollected, getCollectionCount } = useCollection();
  const [scanning, setScanning] = useState(false);
  const [foundArt, setFoundArt] = useState<typeof ARTWORK | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [message, setMessage] = useState('주변 공간을 인식하고 있습니다...');
  const [notification, setNotification] = useState<string | null>(null);
  
  const alreadyCollected = isCollected(ARTWORK.id);

  useEffect(() => {
    setTimeout(() => {
      setCameraReady(true);
      setMessage('주변에 숨겨진 예술 작품을 찾아보세요!');
    }, 1500);
  }, []);

  const handleScan = () => {
    if (foundArt) return;
    
    setScanning(true);
    setMessage('GPS 신호 분석 중...');

    setTimeout(() => {
      setFoundArt(ARTWORK);
      setScanning(false);
      setMessage('🎉 작품 발견! 터치하여 수집하세요.');
    }, 2000);
  };

  const handleCollect = () => {
    if (foundArt && !alreadyCollected) {
      addToCollection(foundArt.id, ARTSPOT.id);
      setNotification(`'${foundArt.titleKo}' 수집 완료!`);
      setFoundArt(null);
      setMessage('수집 완료! 또 다른 작품을 찾아보세요.');
      setScanning(false);
    } else if (alreadyCollected) {
      setNotification('이미 수집한 작품입니다.');
    }
  };

  return (
    <div className="relative w-full h-screen bg-gray-900">
      {notification && (
        <Notification 
          message={notification} 
          onClose={() => setNotification(null)} 
        />
      )}

      <div className="absolute inset-0 overflow-hidden">
        {cameraReady ? (
          <div className="w-full h-full bg-gradient-to-b from-gray-700 to-gray-600 relative">
            <div 
              className="absolute inset-0 opacity-10" 
              style={{ 
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' 
              }}
            ></div>
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[80%] h-[60%] border border-white/30 rounded-lg relative">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white"></div>
                
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                </div>
              </div>
            </div>

            {foundArt && (
              <div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-float cursor-pointer z-10"
                onClick={handleCollect}
              >
                <div className="relative bg-gradient-to-br from-stone-100 to-stone-300 w-48 h-64 shadow-[0_0_50px_rgba(255,255,255,0.6)] rounded-lg flex items-center justify-center flex-col p-4 border-4 border-white/50 group hover:scale-105 transition-transform">
                  <div className="text-6xl mb-4">🗿</div>
                  <h3 className="text-black font-bold text-center text-lg">{foundArt.titleKo}</h3>
                  <p className="text-gray-600 text-sm mt-1">{foundArt.artist}</p>
                  
                  {!alreadyCollected && (
                    <div className="absolute -bottom-16 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm animate-bounce">
                      터치하여 수집하기 👇
                    </div>
                  )}
                  
                  {alreadyCollected && (
                    <div className="absolute -bottom-16 bg-green-600/80 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm flex items-center gap-1">
                      <span>✓</span> 이미 수집 완료
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-6xl mb-4 animate-pulse">📷</div>
              <p>카메라 연결 중...</p>
            </div>
          </div>
        )}
      </div>

      <div className="absolute top-16 left-0 w-full p-4 flex flex-col items-center z-20 pointer-events-none">
        <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full text-sm flex items-center gap-2 border border-white/10 text-white">
          {scanning ? (
            <>
              <span className="animate-spin">🔍</span>
              {message}
            </>
          ) : (
            <>
              <span className="text-green-400">📍</span>
              {message}
            </>
          )}
        </div>
      </div>

      {!foundArt && cameraReady && (
        <div className="absolute bottom-32 left-0 w-full flex justify-center z-20">
          <button 
            onClick={handleScan}
            disabled={scanning}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-600 text-white rounded-full w-20 h-20 flex items-center justify-center shadow-2xl border-4 border-indigo-400/30 active:scale-95 transition-all animate-glow"
          >
            <span className="text-4xl">
              {scanning ? '🔍' : '📡'}
            </span>
          </button>
        </div>
      )}
      
      {foundArt && (
        <div className="absolute bottom-24 left-4 right-4 bg-white/90 backdrop-blur-xl rounded-2xl p-4 text-black shadow-2xl z-30 animate-slide-up">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">🎨 Docent Info</span>
              <h2 className="text-xl font-bold">{foundArt.titleKo}</h2>
              <p className="text-sm text-gray-500">{foundArt.artist}</p>
            </div>
            {!alreadyCollected && (
              <button 
                onClick={handleCollect}
                className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg active:scale-95 transition-all"
              >
                수집하기
              </button>
            )}
          </div>
          <p className="text-sm text-gray-700 leading-snug mb-3">{foundArt.descriptionKo}</p>
          
          <a
            href={foundArt.arUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg text-center transition-colors text-sm"
          >
            🌐 AR로 자세히 보기
          </a>
        </div>
      )}

      <GameNav collectionCount={getCollectionCount()} />
    </div>
  );
}
