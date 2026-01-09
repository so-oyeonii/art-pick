import { ArrowRight } from 'lucide-react'

interface HomeViewProps {
  onStart: () => void
}

export default function HomeView({ onStart }: HomeViewProps) {
  return (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
      {/* 배경 그라디언트 */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-white to-rose-100 animate-pulse-slow" />
      
      {/* 콘텐츠 */}
      <div className="relative z-10 text-center px-8 max-w-2xl">
        <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 text-neutral-900">
          Walk, Collect, Curate
        </h1>
        <p className="text-lg md:text-xl text-neutral-600 mb-12 leading-relaxed">
          지도를 따라 숨겨진 예술 작품을 찾고,<br />
          AR로 감상하며, 나만의 갤러리를 만드세요.
        </p>
        <button
          onClick={onStart}
          className="bg-neutral-900 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 mx-auto hover:bg-neutral-800 transition-all hover:scale-105"
        >
          탐험 시작하기
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  )
}
