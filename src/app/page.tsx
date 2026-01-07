'use client';

import { useCollection } from '@/hooks/useCollection';
import Link from 'next/link';

export default function HomePage() {
  const { getCollectionCount } = useCollection();
  const collectedCount = getCollectionCount();

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black p-6 relative overflow-hidden">
      <div className="absolute top-0 w-full p-2 flex justify-between items-center z-50 text-xs opacity-80">
        <span className="text-gray-400">ARt-Pick v1.0</span>
        <div className="flex gap-2 text-gray-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> GPS
          </span>
          <span>100%</span>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full blur-3xl mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500 rounded-full blur-3xl mix-blend-screen animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="z-10 text-center space-y-6 md:space-y-8 animate-fade-in-up max-w-md md:max-w-2xl w-full px-4">
        <div className="space-y-2">
          <div className="text-5xl md:text-7xl mb-4 animate-float">🎨</div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-400">
            ARt-Pick
          </h1>
          <p className="text-gray-300 text-xs md:text-sm tracking-widest uppercase">LBS Based Web AR Docent</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-white/20 text-left space-y-4">
          <p className="text-gray-200 text-sm md:text-base leading-relaxed">
            "일상의 틈을 예술로 채우다"
            <br/><br/>
            걷고, 발견하고, 수집하세요.<br/>
            당신의 공간이 곧 미술관이 됩니다.
          </p>

          <div className="flex flex-col gap-2 text-xs md:text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>앱 설치 없는 Web AR</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>위치 기반 아트 스팟</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <strong>나만의 공간에 AR 배치</strong>
            </div>
          </div>

          {collectedCount > 0 && (
            <div className="pt-3 border-t border-white/10">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">수집 진행도</span>
                <span className="text-indigo-300 font-bold">{collectedCount} / 1</span>
              </div>
              <div className="mt-2 bg-gray-700 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-500"
                  style={{ width: `${(collectedCount / 1) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3 w-full">
          <Link
            href="/scan"
            className="group relative block px-8 py-4 md:py-5 bg-white text-indigo-900 rounded-full font-bold text-base md:text-xl shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all active:scale-95"
          >
            <span className="flex items-center justify-center gap-2">
              🎯 AR 스캔 시작
            </span>
          </Link>

          {collectedCount > 0 && (
            <Link
              href="/collection"
              className="block px-8 py-3 md:py-4 bg-indigo-600/30 hover:bg-indigo-600/50 text-white rounded-full font-semibold text-sm md:text-base border border-indigo-400/30 backdrop-blur-sm transition-all active:scale-95"
            >
              ✨ 내 컬렉션 보기
            </Link>
          )}

          <Link
            href="/map"
            className="block px-8 py-3 md:py-4 bg-transparent hover:bg-white/10 text-gray-300 hover:text-white rounded-full font-semibold text-sm md:text-base border border-gray-600 transition-all active:scale-95"
          >
            🗺️ 아트스팟 위치
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 text-center text-gray-500 text-xs animate-pulse">
        <p>👆 터치하여 시작하기</p>
      </div>
    </div>
  );
}
