import type { ArtSpot } from './types'

export const ART_SPOTS: ArtSpot[] = [
  // ✅ 실제 QR 코드 있음 (GPS 필수)
  {
    id: 'vivaldi-alice-rabbit',
    title: 'Alice Rabbit',
    korTitle: '앨리스 토끼',
    artist: 'Lewis Carroll',
    lat: 37.6524,
    lng: 127.6874,
    distance: '',
    isActive: true,
    requiresGPS: true,
    arUrl: 'https://seoyoung.swiftxr.site/seo-001',
    icon: '/artworks/rabbit.png',
    color: 'bg-blue-50',
    accent: 'text-blue-600',
    description: '비발디파크 컨벤션센터에서 이상한 나라의 앨리스를 만나보세요.'
  },

  // 🎮 가상 체험 (비발디파크 주변)
  {
    id: 'vivaldi-cheshire',
    title: 'Cheshire Cat',
    korTitle: '체셔 고양이',
    artist: 'Lewis Carroll',
    lat: 37.6534,
    lng: 127.6864,
    distance: '',
    isActive: false,
    requiresGPS: false,
    arUrl: '#',
    icon: '/artworks/cat.png',
    color: 'bg-purple-50',
    accent: 'text-purple-600',
    description: '스키장 입구 - Coming Soon'
  },

  {
    id: 'vivaldi-queen',
    title: 'Queen of Hearts',
    korTitle: '하트 여왕',
    artist: 'Lewis Carroll',
    lat: 37.6514,
    lng: 127.6884,
    distance: '',
    isActive: false,
    requiresGPS: false,
    arUrl: '#',
    icon: '/artworks/queen.png',
    color: 'bg-red-50',
    accent: 'text-red-600',
    description: '오션월드 근처 - Coming Soon'
  },

  {
    id: 'vivaldi-hatter',
    title: 'Mad Hatter',
    korTitle: '매드 해터',
    artist: 'Lewis Carroll',
    lat: 37.6520,
    lng: 127.6890,
    distance: '',
    isActive: false,
    requiresGPS: false,
    arUrl: '#',
    icon: '/artworks/madhatter.png',
    color: 'bg-amber-50',
    accent: 'text-amber-600',
    description: '리조트 중앙 광장 - Coming Soon'
  },

  {
    id: 'vivaldi-white-rabbit',
    title: 'White Rabbit',
    korTitle: '백토끼',
    artist: 'Lewis Carroll',
    lat: 37.6530,
    lng: 127.6880,
    distance: '',
    isActive: false,
    requiresGPS: false,
    arUrl: '#',
    icon: '/artworks/alice.png',
    color: 'bg-slate-50',
    accent: 'text-slate-600',
    description: '골프장 클럽하우스 - Coming Soon'
  },

  {
    id: 'vivaldi-soldier',
    title: 'Card Soldier',
    korTitle: '트럼프 병사',
    artist: 'Lewis Carroll',
    lat: 37.6518,
    lng: 127.6868,
    distance: '',
    isActive: false,
    requiresGPS: false,
    arUrl: '#',
    icon: '/artworks/cardsoldier.png',
    color: 'bg-gray-50',
    accent: 'text-gray-600',
    description: '온천 스파 입구 - Coming Soon'
  },

  {
    id: 'vivaldi-caterpillar',
    title: 'Caterpillar',
    korTitle: '애벌레',
    artist: 'Lewis Carroll',
    lat: 37.6528,
    lng: 127.6870,
    distance: '',
    isActive: false,
    requiresGPS: false,
    arUrl: '#',
    icon: '/artworks/caterpillar.png',
    color: 'bg-green-50',
    accent: 'text-green-600',
    description: '산책로 전망대 - Coming Soon'
  },

  {
    id: 'vivaldi-dodo',
    title: 'Dodo Bird',
    korTitle: '도도새',
    artist: 'Lewis Carroll',
    lat: 37.6522,
    lng: 127.6878,
    distance: '',
    isActive: false,
    requiresGPS: false,
    arUrl: '#',
    icon: '/artworks/dodobird.png',
    color: 'bg-yellow-50',
    accent: 'text-yellow-600',
    description: '레스토랑 거리 - Coming Soon'
  },

  {
    id: 'vivaldi-turtle',
    title: 'Mock Turtle',
    korTitle: '모의 거북',
    artist: 'Lewis Carroll',
    lat: 37.6526,
    lng: 127.6882,
    distance: '',
    isActive: false,
    requiresGPS: false,
    arUrl: '#',
    icon: '/artworks/turtle.png',
    color: 'bg-teal-50',
    accent: 'text-teal-600',
    description: '호텔 로비 - Coming Soon'
  }
]
