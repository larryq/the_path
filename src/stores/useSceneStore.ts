import { create } from 'zustand'

interface SceneState {
  walkProgress: number
  walkYaw: number
  isTransitioning: boolean
  setWalkProgress:  (v: number) => void
  setWalkYaw:       (v: number) => void
  setTransitioning: (v: boolean) => void
  resetWalk:        () => void
}

export const useSceneStore = create<SceneState>((set) => ({
  walkProgress: 0,
  walkYaw: 0,
  isTransitioning: false,
  setWalkProgress:  (v) => set({ walkProgress: v }),
  setWalkYaw:       (v) => set({ walkYaw: v }),
  setTransitioning: (v) => set({ isTransitioning: v }),
  resetWalk: () => set({ walkProgress: 0, walkYaw: 0, isTransitioning: false }),
}))
