'use client';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 pt-safe">
      <div className="flex items-center justify-between h-14 px-4">
        {/* 로고 */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">
            ARt-Pick
          </h1>
        </div>

        {/* 메뉴 버튼 (추후 구현) */}
        <button 
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="메뉴"
        >
          <svg 
            className="w-6 h-6 text-gray-700" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
    </header>
  );
}
