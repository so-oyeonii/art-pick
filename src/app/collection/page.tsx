'use client';

import { useCollection } from '@/hooks/useCollection';
import { ARTWORK } from '@/lib/data';
import { formatCollectedDate } from '@/types/user';
import GameNav from '@/components/layout/GameNav';

export default function CollectionPage() {
  const { collection, getCollectionCount, isLoading } = useCollection();
  const collectedCount = getCollectionCount();
  const progress = (collectedCount / 1) * 100;

  if (isLoading) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4 animate-pulse">⏳</div>
          <p className="text-gray-400">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-24 pt-16 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <span className="text-4xl">📦</span>
          나의 컬렉션
          <span className="text-sm font-normal text-gray-400 ml-auto">
            {collectedCount} / 1
          </span>
        </h1>
        <p className="text-gray-400">수집한 작품을 확인하고 다시 감상하세요</p>
      </div>

      <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-indigo-500/30">
        <div className="text-center">
          <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 mb-2">
            {collectedCount} / 1
          </p>
          <p className="text-gray-300 mb-4">작품 수집 완료</p>
          <div className="bg-gray-800/50 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {collectedCount > 0 ? (
        <div className="space-y-4">
          {collection.map((item, idx) => (
            <div
              key={`${item.artworkId}-${idx}`}
              className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:border-indigo-500 transition-all group"
            >
              <div className="bg-gradient-to-br from-stone-100 to-stone-300 h-48 flex items-center justify-center relative">
                <div className="text-8xl animate-float">🗿</div>
                <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <span>✓</span> Collected
                </div>
                <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded text-xs">
                  AR 작품
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-2xl font-bold mb-1">{ARTWORK.titleKo}</h3>
                    <p className="text-gray-400">{ARTWORK.artist}</p>
                  </div>
                  <span className="px-3 py-1 bg-purple-900/50 text-purple-300 text-xs font-bold rounded-full border border-purple-500/30">
                    Masterpiece
                  </span>
                </div>

                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                  {ARTWORK.descriptionKo}
                </p>

                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span className="mr-2">🕐</span>
                  {formatCollectedDate(new Date(item.collectedAt), 'ko')}
                </div>

                <a
                  href={ARTWORK.arUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg text-center transition-all active:scale-95 shadow-lg"
                >
                  🎨 AR로 다시 보기
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-700 rounded-2xl bg-gray-800/30">
          <span className="text-6xl mb-4 opacity-50">📷</span>
          <p className="text-gray-400 mb-2">아직 수집한 작품이 없습니다</p>
          <p className="text-gray-500 text-sm mb-6">AR 스캔으로 작품을 찾아보세요!</p>
          <a
            href="/scan"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            작품 수집하러 가기
          </a>
        </div>
      )}

      <GameNav collectionCount={getCollectionCount()} />
    </div>
  );
}
