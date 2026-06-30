import { useCallback } from 'react'
import { ThreeEvent } from '@react-three/fiber'
import { useGridStore } from '../stores/useGridStore'

interface PathDragHandlers {
  onTilePointerDown:  (e: ThreeEvent<PointerEvent>, q: number, r: number) => void
  onTilePointerEnter: (e: ThreeEvent<PointerEvent>, q: number, r: number) => void
  onCanvasPointerUp:  () => void
  isDragging: boolean
}

export function usePathDrag(): PathDragHandlers {
  const { isDragging, pathCommitted, startDrag, extendPath, commitPath } = useGridStore()

  const onTilePointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>, q: number, r: number) => {
      if (pathCommitted) return
      e.stopPropagation()
      startDrag(q, r)
    },
    [pathCommitted, startDrag]
  )

  const onTilePointerEnter = useCallback(
    (e: ThreeEvent<PointerEvent>, q: number, r: number) => {
      if (!isDragging) return
      e.stopPropagation()
      extendPath(q, r)
    },
    [isDragging, extendPath]
  )

  const onCanvasPointerUp = useCallback(() => {
    if (!isDragging) return
    commitPath()
  }, [isDragging, commitPath])

  return { onTilePointerDown, onTilePointerEnter, onCanvasPointerUp, isDragging }
}
