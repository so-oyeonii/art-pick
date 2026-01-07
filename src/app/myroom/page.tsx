'use client';

import { useState, useRef } from 'react';
import { useCollection } from '@/hooks/useCollection';
import { ARTWORK } from '@/lib/data';
import GameNav from '@/components/layout/GameNav';

interface PlacedItem {
  artworkId: string;
  instanceId: number;
  x: number;
  y: number;
  title: string;
}

export default function MyRoomPage() {
  const { collection, getCollectionCount } = useCollection();
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
  const [isARMode, setIsARMode] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const roomRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const handlePlaceItem = (artworkId: string) => {
    const newItem: PlacedItem = {
      artworkId,
      instanceId: Date.now(),
      x: 50 + (Math.random() * 20 - 10),
      y: 50 + (Math.random() * 20 - 10),
      title: ARTWORK.titleKo,
    };
    setPlacedItems([...placedItems, newItem]);
    showToast(isARMode ? 'AR 공간에 배치되었습니다!' : '작품이 배치되었습니다!');
  };

  const handleRemoveItem = (instanceId: number) => {
    setPlacedItems(placedItems.filter(i => i.instanceId !== instanceId));
    showToast('작품을 제거했습니다.');
  };

  const moveItemRandomly = (instanceId: number) => {
    setPlacedItems(placedItems.map(item => {
      if (item.instanceId === instanceId) {
        return { 
          ...item, 
          x: Math.max(10, Math.min(90, item.x + (Math.random() * 20 - 10))), 
          y: Math.max(10, Math.min(90, item.y + (Math.random() * 20 - 10))) 
        };
      }
      return item;
    }));
  };

  return (
    <div className="h-screen bg-gray-900 relative flex flex-col">
      {/* View Toggle */}
      <div className="absolute top-4 right-4 z-40 flex bg-black/50 rounded-full p-1 border border-white/20 backdrop-blur-md">
        <button 
          onClick={() => setIsARMode(false)}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
            !isARMode ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400'
          }`}
        >
          <span>🏠</span> 3D Room
        </button>
        <button 
          onClick={() => setIsARMode(true)}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
            isARMode ? 'bg-green-600 text-white shadow-lg' : 'text-gray-400'
          }`}
        >
          <span>📷</span> AR View
        </button>
      </div>

      {/* Main Canvas Area */}
      <div 
        ref={roomRef}
        className={`flex-1 relative overflow-hidden transition-all duration-500 ${
          isARMode ? 'bg-transparent' : 'bg-stone-800'
        }`}
        style={!isARMode ? {
          backgroundImage: 'radial-gradient(circle at 50% 50%, #44403c 0%, #1c1917 100%)'
        } : {}}
      > 
        {/* AR Camera Background */}
        {isARMode && (
          <div className="absolute inset-0 w-full h-full bg-gray-800 z-0">
            <div 
              className="absolute inset-0 opacity-20" 
              style={{ 
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' 
              }}
            ></div>
            <div className="absolute bottom-10 left-10 text-white/50 text-xs">📹 Camera Active</div>
            {/* Grid lines */}
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-green-500/30"></div>
            <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-green-500/30"></div>
          </div>
        )}

        {/* 3D Room Background */}
        {!isARMode && (
          <>
            <div className="absolute bottom-0 w-full h-1/3 bg-stone-900 border-t border-stone-600 opacity-50"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-stone-700 text-6xl font-bold opacity-10 pointer-events-none">
              MY SPACE
            </div>
          </>
        )}

        {/* Placed Items */}
        {placedItems.map((item) => (
          <div 
            key={item.instanceId}
            onClick={() => moveItemRandomly(item.instanceId)}
            className="absolute cursor-move transition-all duration-500 ease-out flex flex-col items-center group z-10"
            style={{ 
              left: `${item.x}%`, 
              top: `${item.y}%`, 
              transform: 'translate(-50%, -50%)' 
            }}
          >
            <div className="relative bg-gradient-to-br from-stone-100 to-stone-300 p-3 shadow-2xl rounded-lg border-2 border-white/20 group-hover:border-indigo-400 group-hover:scale-105 transition-transform">
              <div className="text-5xl">🗿</div>
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  handleRemoveItem(item.instanceId); 
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold"
              >
                ✕
              </button>
            </div>
            <div className="bg-black/50 text-white text-[10px] px-2 py-1 rounded-full mt-2 opacity-0 group-hover:opacity-100 backdrop-blur-sm">
              {item.title}
            </div>
            <div className={`w-12 h-2 rounded-full mt-1 ${isARMode ? 'bg-black/20 blur-sm' : 'bg-black/40 blur-sm'}`}></div>
          </div>
        ))}

        {/* Empty State */}
        {placedItems.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 pointer-events-none">
            <div className="text-center">
              <div className="text-6xl mb-4 opacity-30">🎨</div>
              <p className="text-sm">수집한 작품을 아래에서 배치해보세요</p>
            </div>
          </div>
        )}
      </div>

      {/* Inventory Drawer */}
      <div className="h-48 bg-gray-800 border-t border-gray-700 p-4 pb-24 overflow-x-auto z-10">
        <h3 className="text-xs font-bold text-gray-400 mb-2 uppercase flex justify-between">
          <span>보유 작품 ({collection.length})</span>
          <span className="text-indigo-400">{isARMode ? 'AR 배치 모드' : '갤러리 꾸미기 모드'}</span>
        </h3>
        <div className="flex gap-4">
          {collection.length === 0 && (
            <div className="flex items-center gap-3 text-gray-500 text-sm">
              <span className="text-2xl">📦</span>
              <div>
                <p className="font-semibold">작품을 수집해보세요</p>
                <p className="text-xs">AR 스캔으로 작품을 찾을 수 있습니다</p>
              </div>
            </div>
          )}
          {collection.map((item, idx) => (
            <button 
              key={idx} 
              onClick={() => handlePlaceItem(item.artworkId)}
              className="flex-shrink-0 w-20 h-24 bg-gray-700 rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-gray-600 active:scale-95 transition-all border border-transparent hover:border-indigo-400"
            >
              <div className="text-3xl">🗿</div>
              <span className="text-[10px] text-gray-300 truncate w-full text-center px-1">
                {ARTWORK.titleKo}
              </span>
              <div className="absolute top-1 right-1 bg-indigo-600 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold">
                +
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Toast Notification */}
      {toast && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-xs z-50 animate-bounce">
          {toast}
        </div>
      )}

      <GameNav collectionCount={getCollectionCount()} />
    </div>
  );
}
