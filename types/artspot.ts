/**
 * ARt-Pick 아트스팟 타입 정의
 * 위치 기반 작품 발견 지점
 */

/**
 * 위치 좌표
 */
export interface GeoLocation {
  latitude: number;
  longitude: number;
}

/**
 * 아트스팟 인터페이스
 */
export interface ArtSpot {
  /** 스팟 고유 ID */
  id: string;
  
  /** 스팟 이름 (영문) */
  name: string;
  
  /** 스팟 이름 (한글) */
  nameKo: string;
  
  /** 위도 */
  latitude: number;
  
  /** 경도 */
  longitude: number;
  
  /** 인식 반경 (미터) */
  radius: number;
  
  /** 연결된 작품 ID */
  artworkId: string;
  
  /** 주소 */
  address: string;
  
  /** 주소 (한글) */
  addressKo: string;
  
  /** 스팟 설명 */
  description: string;
  
  /** 스팟 설명 (한글) */
  descriptionKo: string;
  
  /** 힌트 메시지 */
  hint: string;
  
  /** 힌트 메시지 (한글) */
  hintKo: string;
  
  /** 활성화 여부 */
  isActive: boolean;
}

/**
 * 근접 상태
 */
export type ProximityStatus = 
  | 'far'       // 500m 초과 - 멀리 있음
  | 'near'      // 100m~500m - 가까워지는 중
  | 'arrived';  // 100m 이내 - 도착, 스캔 가능

/**
 * 근접 상태별 설정
 */
export const PROXIMITY_CONFIG: Record<ProximityStatus, {
  label: string;
  labelKo: string;
  color: string;
  canScan: boolean;
  message: string;
  messageKo: string;
}> = {
  far: {
    label: 'Far Away',
    labelKo: '멀리 있음',
    color: '#64748B',
    canScan: false,
    message: 'Head to the art spot to discover the artwork',
    messageKo: '아트스팟으로 이동하여 작품을 발견하세요'
  },
  near: {
    label: 'Getting Close',
    labelKo: '가까워지는 중',
    color: '#F59E0B',
    canScan: false,
    message: 'Almost there! Keep walking',
    messageKo: '거의 다 왔어요! 조금만 더 이동하세요'
  },
  arrived: {
    label: 'Arrived',
    labelKo: '도착',
    color: '#10B981',
    canScan: true,
    message: 'You\'re here! Scan the QR code to view the artwork',
    messageKo: '도착했습니다! QR 코드를 스캔하여 작품을 감상하세요'
  }
};

/**
 * 거리 임계값 (미터)
 */
export const DISTANCE_THRESHOLDS = {
  /** 스캔 가능 거리 */
  SCAN_RADIUS: 100,
  /** 근접 알림 거리 */
  NEAR_RADIUS: 500,
  /** 지도 표시 거리 */
  MAP_RADIUS: 5000
} as const;

/**
 * 근접 상태 계산 함수
 */
export function getProximityStatus(distance: number): ProximityStatus {
  if (distance <= DISTANCE_THRESHOLDS.SCAN_RADIUS) {
    return 'arrived';
  } else if (distance <= DISTANCE_THRESHOLDS.NEAR_RADIUS) {
    return 'near';
  } else {
    return 'far';
  }
}

/**
 * 거리 포맷팅 함수
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  } else {
    return `${(meters / 1000).toFixed(1)}km`;
  }
}

/**
 * 아트스팟 표시용 헬퍼 함수
 */
export function getSpotDisplayName(spot: ArtSpot, locale: 'en' | 'ko' = 'ko'): string {
  return locale === 'ko' ? spot.nameKo : spot.name;
}

export function getSpotDisplayHint(spot: ArtSpot, locale: 'en' | 'ko' = 'ko'): string {
  return locale === 'ko' ? spot.hintKo : spot.hint;
}
