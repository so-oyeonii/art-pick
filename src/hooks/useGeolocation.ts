'use client'

import { useState, useEffect } from 'react'

interface GeolocationState {
  latitude: number | null
  longitude: number | null
  accuracy: number | null
  loading: boolean
  error: string | null
  permission: 'granted' | 'denied' | 'prompt' | null
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    loading: true,
    error: null,
    permission: null
  })

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'GPS를 지원하지 않는 브라우저입니다'
      }))
      return
    }

    // 권한 체크
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then(result => {
        setState(prev => ({ ...prev, permission: result.state }))
      })
    }

    // GPS 추적 시작
    const watchId = navigator.geolocation.watchPosition(
      position => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          loading: false,
          error: null,
          permission: 'granted'
        })
      },
      error => {
        let errorMessage = 'GPS 위치를 가져올 수 없습니다'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'GPS 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'GPS 위치 정보를 사용할 수 없습니다'
            break
          case error.TIMEOUT:
            errorMessage = 'GPS 요청 시간이 초과되었습니다'
            break
        }

        setState(prev => ({
          ...prev,
          loading: false,
          error: errorMessage,
          permission: error.code === error.PERMISSION_DENIED ? 'denied' : prev.permission
        }))
      },
      {
        enableHighAccuracy: true,  // 높은 정확도 요청
        maximumAge: 5000,          // 5초 이내 캐시 허용
        timeout: 10000             // 10초 타임아웃
      }
    )

    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [])

  return state
}
