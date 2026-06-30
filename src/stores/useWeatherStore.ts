import { create } from 'zustand'
import { TimeOfDay } from '../config/lighting.config'

interface WeatherState {
  timeOfDay: TimeOfDay
  lightingLerpProgress: number
  windEnabled: boolean
  windStrength: number
  windAngle: number
  rainEnabled: boolean
  rainIntensity: number

  toggleTimeOfDay:        () => void
  setLightingLerpProgress:(v: number) => void
  toggleWind:             () => void
  setWindStrength:        (v: number) => void
  toggleRain:             () => void
  setRainIntensity:       (v: number) => void
}

export const useWeatherStore = create<WeatherState>((set) => ({
  timeOfDay: 'day',
  lightingLerpProgress: 1.0,
  windEnabled: false,
  windStrength: 0.0,
  windAngle: Math.PI,
  rainEnabled: false,
  rainIntensity: 0.0,

  toggleTimeOfDay: () => set(s => ({
    timeOfDay: s.timeOfDay === 'day' ? 'night' : 'day',
    lightingLerpProgress: 0,
  })),
  setLightingLerpProgress: (v) => set({ lightingLerpProgress: v }),
  toggleWind: () => set(s => ({
    windEnabled: !s.windEnabled,
    windStrength: s.windEnabled ? 0.0 : 0.6,
  })),
  setWindStrength:  (v) => set({ windStrength: v }),
  toggleRain: () => set(s => ({
    rainEnabled: !s.rainEnabled,
    rainIntensity: s.rainEnabled ? 0.0 : 0.7,
  })),
  setRainIntensity: (v) => set({ rainIntensity: v }),
}))
