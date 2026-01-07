import { Artwork, ArtSpot } from '@/types/index';

export const ARTWORK: Artwork = {
  id: 'swiftxr-001',
  title: 'Digital Dimensions',
  titleKo: '디지털 디멘션',
  description: 'An interactive 3D sculpture exploring the boundaries between physical and digital realms.',
  descriptionKo: '물리적 세계와 디지털 세계의 경계를 탐구하는 인터랙티브 3D 조각 작품입니다.',
  artist: 'ARt-Pick Studio',
  imageUrl: '/images/artwork-preview.png',
  thumbnailUrl: '/images/artwork-thumb.png',
  arUrl: 'https://seoyoung.swiftxr.site/seo-001',
  qrCodeUrl: '/qr-code.png',
  category: 'digital',
  createdAt: '2025-01-07T00:00:00Z',
};

export const ARTSPOT: ArtSpot = {
  id: 'vivaldi-convention',
  name: 'Sono Belle Vivaldi Park Convention Center',
  nameKo: '소노벨 비발디파크 컨벤션센터',
  latitude: 37.6524,
  longitude: 127.6874,
  radius: 100,
  artworkId: 'swiftxr-001',
  address: '262 Hanchigol-gil, Seo-myeon, Hongcheon-gun, Gangwon-do',
  addressKo: '강원특별자치도 홍천군 서면 한치골길 262',
  description: 'Discover hidden digital art at the convention center.',
  descriptionKo: '컨벤션센터에서 숨겨진 디지털 아트를 발견하세요.',
  hint: 'Look for the QR code near the main entrance.',
  hintKo: '정문 근처에서 QR 코드를 찾아보세요.',
  isActive: true,
};
