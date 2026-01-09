// 타입 import
import type { ArtItem } from './types'

const STORAGE_KEY = 'art-collection'

// 저장
export function saveCollection(items: ArtItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch (error) {
    console.error('저장 실패:', error)
  }
}

// 불러오기
export function loadCollection(): ArtItem[] | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('불러오기 실패:', error)
    return null
  }
}

// 초기화 (디버깅용)
export function clearCollection(): void {
  localStorage.removeItem(STORAGE_KEY)
}
