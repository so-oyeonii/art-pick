/**
 * ARt-Pick 작품 타입 정의
 * QR 기반 Web AR MVP 버전
 */

/**
 * 작품 인터페이스
 */
export interface Artwork {
  /** 작품 고유 ID */
  id: string;
  
  /** 작품 제목 (영문) */
  title: string;
  
  /** 작품 제목 (한글) */
  titleKo: string;
  
  /** 작품 설명 (영문) */
  description: string;
  
  /** 작품 설명 (한글) */
  descriptionKo: string;
  
  /** 아티스트/작가 */
  artist: string;
  
  /** 작품 이미지 URL */
  imageUrl: string;
  
  /** 썸네일 이미지 URL */
  thumbnailUrl: string;
  
  /** SwiftXR AR 체험 URL */
  arUrl: string;
  
  /** QR 코드 이미지 URL */
  qrCodeUrl: string;
  
  /** 작품 카테고리 */
  category: ArtworkCategory;
  
  /** 생성일 */
  createdAt: string;
}

/**
 * 작품 카테고리
 */
export type ArtworkCategory = 
  | 'sculpture'      // 조각
  | 'installation'   // 설치미술
  | 'digital'        // 디지털 아트
  | 'mixed-media';   // 복합 매체

/**
 * 작품 카테고리 설정
 */
export const CATEGORY_CONFIG: Record<ArtworkCategory, {
  label: string;
  labelKo: string;
  color: string;
  icon: string;
}> = {
  sculpture: {
    label: 'Sculpture',
    labelKo: '조각',
    color: '#8B5CF6',
    icon: '🗿'
  },
  installation: {
    label: 'Installation',
    labelKo: '설치미술',
    color: '#EC4899',
    icon: '🎪'
  },
  digital: {
    label: 'Digital Art',
    labelKo: '디지털 아트',
    color: '#06B6D4',
    icon: '💻'
  },
  'mixed-media': {
    label: 'Mixed Media',
    labelKo: '복합 매체',
    color: '#F59E0B',
    icon: '🎨'
  }
};

/**
 * 작품 표시용 헬퍼 함수
 */
export function getArtworkDisplayTitle(artwork: Artwork, locale: 'en' | 'ko' = 'ko'): string {
  return locale === 'ko' ? artwork.titleKo : artwork.title;
}

export function getArtworkDisplayDescription(artwork: Artwork, locale: 'en' | 'ko' = 'ko'): string {
  return locale === 'ko' ? artwork.descriptionKo : artwork.description;
}
