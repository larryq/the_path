import { useMemo } from 'react'
import { useGridStore } from '../../../stores/useGridStore'
import { useHexGrid } from '../../../hooks/useHexGrid'
import { usePathDrag } from '../../../hooks/usePathDrag'
import { axialToWorld } from '../../../config/grid.config'
import { TileState } from './HexTile'
import HexTile from './HexTile'
import PathLine from './PathLine'
import StartMarker from './StartMarker'

const tileKey = (q: number, r: number) => `${q},${r}`

interface HexGridProps {
  isMobile?: boolean
}

export default function HexGrid({ isMobile = false }: HexGridProps) {
  const { tiles, bounds } = useHexGrid(isMobile)
  const { path, pathCommitted, adjacentSet, placedNature, openDialog } = useGridStore()
  const { onTilePointerDown, onTilePointerEnter } = usePathDrag()

  const tileStates = useMemo(() => {
    const states: Record<string, TileState> = {}

    path.forEach(({ q, r }, idx) => {
      if (idx === 0)                  states[tileKey(q, r)] = 'pathStart'
      else if (idx === path.length - 1) states[tileKey(q, r)] = 'pathEnd'
      else                            states[tileKey(q, r)] = 'path'
    })

    if (pathCommitted) {
      adjacentSet.forEach(k => {
        states[k] = placedNature[k] ? 'selected' : 'adjacent'
      })
    }

    return states
  }, [path, pathCommitted, adjacentSet, placedNature])

  const showStartMarker = path.length >= 2
  const startTile = path[0]
  const startWorld = startTile ? axialToWorld(startTile.q, startTile.r) : null

  return (
    <group position={[-bounds.cx, 0, -bounds.cz]}>
      {/* Ground — visible through the gaps between tiles */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[bounds.cx, -0.11, bounds.cz]}
        receiveShadow
      >
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#1e2e28" roughness={0.9} />
      </mesh>

      {tiles.map(({ q, r, x, z }) => {
        const k = tileKey(q, r)
        return (
          <HexTile
            key={k}
            x={x}
            z={z}
            state={tileStates[k] ?? 'default'}
            onPointerDown={(e) => onTilePointerDown(e, q, r)}
            onPointerEnter={(e) => onTilePointerEnter(e, q, r)}
            onClick={() => openDialog(q, r)}
          />
        )
      })}

      {path.length >= 2 && <PathLine path={path} />}

      {showStartMarker && startWorld && (
        <StartMarker x={startWorld.x} z={startWorld.z} />
      )}
    </group>
  )
}
