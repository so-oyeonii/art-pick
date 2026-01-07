/**
 * ARt-Pick 타입 통합 Export
 */

// Artwork types
export type {
  Artwork,
  ArtworkCategory
} from './artwork';

export {
  CATEGORY_CONFIG,
  getArtworkDisplayTitle,
  getArtworkDisplayDescription
} from './artwork';

// ArtSpot types
export type {
  GeoLocation,
  ArtSpot,
  ProximityStatus
} from './artspot';

export {
  PROXIMITY_CONFIG,
  DISTANCE_THRESHOLDS,
  getProximityStatus,
  formatDistance,
  getSpotDisplayName,
  getSpotDisplayHint
} from './artspot';

// User & Collection types
export type {
  User,
  CollectionItem,
  CollectionDocument,
  CollectionStatus,
  CollectResult,
  CollectionStats
} from './user';

export {
  formatCollectedDate,
  getRelativeTime
} from './user';

/**
 * API 응답 타입
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * 로딩 상태 타입
 */
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

/**
 * 언어 설정
 */
export type Locale = 'en' | 'ko';
