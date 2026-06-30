import { create } from 'zustand'

export type AppPhase = 'intro' | 'build' | 'walk'

interface AppState {
  phase: AppPhase
  isDissolving: boolean
  beginDissolve: () => void
  startBuild: () => void
  startWalk: () => void
  resetToIntro: () => void
}

export const useAppStore = create<AppState>((set) => ({
  phase: 'intro',
  isDissolving: false,
  beginDissolve: () => set({ isDissolving: true }),
  startBuild:    () => set({ phase: 'build', isDissolving: false }),
  startWalk:     () => set({ phase: 'walk' }),
  resetToIntro:  () => set({ phase: 'intro', isDissolving: false }),
}))
