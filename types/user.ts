/**
 * ARt-Pick 사용자 & 컬렉션 타입 정의
 */

import { GeoLocation } from './artspot';

/**
 * 사용자 인터페이스
 */
export interface User {
  /** Firebase UID */
  uid: string;
  
  /** 익명 사용자 여부 */
  isAnonymous: boolean;
  
  /** 계정 생성일 */
  createdAt: Date;
  
  /** 마지막 방문일 */
  lastVisit: Date;
}

/**
 * 수집 아이템 인터페이스
 */
export interface CollectionItem {
  /** 작품 ID */
  artworkId: string;
  
  /** 수집한 아트스팟 ID */
  spotId: string;
  
  /** 수집 시간 */
  collectedAt: Date;
  
  /** 수집 위치 */
  location: GeoLocation;
}

/**
 * Firestore 문서 형태 (저장용)
 */
export interface CollectionDocument {
  artworkId: string;
  spotId: string;
  collectedAt: FirebaseTimestamp;
  location: {
    latitude: number;
    longitude: number;
  };
}

/**
 * Firebase Timestamp 타입
 */
interface FirebaseTimestamp {
  seconds: number;
  nanoseconds: number;
  toDate(): Date;
}

/**
 * 수집 상태
 */
export type CollectionStatus = 
  | 'not-collected'   // 미수집
  | 'collecting'      // 수집 중 (AR 체험 중)
  | 'collected';      // 수집 완료

/**
 * 수집 결과
 */
export interface CollectResult {
  success: boolean;
  item?: CollectionItem;
  error?: string;
}

/**
 * 수집 통계
 */
export interface CollectionStats {
  /** 총 수집 개수 */
  totalCollected: number;
  
  /** 마지막 수집일 */
  lastCollectedAt?: Date;
}

/**
 * 날짜 포맷팅 함수
 */
export function formatCollectedDate(date: Date, locale: 'en' | 'ko' = 'ko'): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return date.toLocaleDateString(
    locale === 'ko' ? 'ko-KR' : 'en-US',
    options
  );
}

/**
 * 상대적 시간 표시 함수
 */
export function getRelativeTime(date: Date, locale: 'en' | 'ko' = 'ko'): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (locale === 'ko') {
    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return formatCollectedDate(date, locale);
  } else {
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return formatCollectedDate(date, locale);
  }
}
