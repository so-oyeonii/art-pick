/**
 * Haversine 공식을 사용한 두 GPS 좌표 간 거리 계산
 * @returns 미터 단위 거리
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3 // 지구 반지름 (미터)
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

/**
 * 미터를 사용자 친화적인 문자열로 변환
 */
export function formatDistance(meters: number): string {
  if (meters < 100) return `${Math.round(meters)}m`
  if (meters < 1000) return `${Math.round(meters)}m`
  return `${(meters / 1000).toFixed(1)}km`
}

/**
 * GPS 범위 내에 있는지 확인
 */
export function isWithinRange(
  userLat: number,
  userLon: number,
  targetLat: number,
  targetLon: number,
  rangeMeters: number = 100
): boolean {
  const distance = calculateDistance(userLat, userLon, targetLat, targetLon)
  return distance <= rangeMeters
}
