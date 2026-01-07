'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavButtonProps {
  href: string;
  icon: string;
  label: string;
  badge?: number;
}

function NavButton({ href, icon, label, badge }: NavButtonProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-1 transition-all ${
        isActive ? 'text-indigo-400 scale-110' : 'text-gray-400 hover:text-white'
      }`}
    >
      <div className="relative">
        <span className={`text-2xl ${isActive ? 'animate-pulse' : ''}`}>{icon}</span>
        {badge !== undefined && badge > 0 && (
          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
            {badge}
          </span>
        )}
      </div>
      <span className="text-[10px] font-semibold">{label}</span>
    </Link>
  );
}

interface GameNavProps {
  collectionCount: number;
}

export default function GameNav({ collectionCount }: GameNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-md border-t border-gray-700 pb-6 pt-3 px-6">
      <div className="flex justify-between items-center max-w-md mx-auto">
        <NavButton href="/scan" icon="📷" label="AR 스캔" />
        <NavButton href="/collection" icon="📦" label="수집함" badge={collectionCount} />
        <NavButton href="/map" icon="🗺️" label="지도" />
        <NavButton href="/myroom" icon="🏠" label="마이 룸" />
      </div>
    </nav>
  );
}
