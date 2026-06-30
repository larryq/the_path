import { useMemo } from 'react'
import {
  GRID_CONFIG,
  axialToWorld,
  indexToAxial,
  TileData,
  GridBounds,
  AxialCoord,
} from '../config/grid.config'

interface UseHexGridResult {
  tiles: TileData[]
  bounds: GridBounds
  radius: number
  worldToTile: (wx: number, wz: number) => AxialCoord | null
}

export function useHexGrid(isMobile = false): UseHexGridResult {
  const radius = GRID_CONFIG.tileRadius * (isMobile ? GRID_CONFIG.mobileGridScale : 1)

  const tiles = useMemo<TileData[]>(() => {
    const result: TileData[] = []
    for (let row = 0; row < GRID_CONFIG.rows; row++) {
      for (let col = 0; col < GRID_CONFIG.cols; col++) {
        const { q, r } = indexToAxial(col, row)
        const { x, z } = axialToWorld(q, r, radius)
        result.push({ q, r, x, z, col, row })
      }
    }
    return result
  }, [radius])

  const bounds = useMemo<GridBounds>(() => {
    if (!tiles.length) return { minX: 0, maxX: 0, minZ: 0, maxZ: 0, cx: 0, cz: 0 }
    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity
    tiles.forEach(({ x, z }) => {
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (z < minZ) minZ = z
      if (z > maxZ) maxZ = z
    })
    return { minX, maxX, minZ, maxZ, cx: (minX + maxX) / 2, cz: (minZ + maxZ) / 2 }
  }, [tiles])

  const worldToTile = (wx: number, wz: number): AxialCoord | null => {
    const r = (wz / radius) * (2 / 3)
    const q = (wx / radius) * (1 / Math.sqrt(3)) - r / 2

    let cx = q, cz = r, cy = -cx - cz
    let rx = Math.round(cx), ry = Math.round(cy), rz = Math.round(cz)

    const xDiff = Math.abs(rx - cx)
    const yDiff = Math.abs(ry - cy)
    const zDiff = Math.abs(rz - cz)

    if (xDiff > yDiff && xDiff > zDiff)      rx = -ry - rz
    else if (yDiff > zDiff)                   ry = -rx - rz
    else                                      rz = -rx - ry

    const tileQ = rx
    const tileR = rz
    const halfCols = Math.floor(GRID_CONFIG.cols / 2)
    const halfRows = Math.floor(GRID_CONFIG.rows / 2)

    if (
      tileQ < -halfCols || tileQ > halfCols ||
      tileR < -halfRows || tileR > halfRows
    ) return null

    return { q: tileQ, r: tileR }
  }

  return { tiles, bounds, radius, worldToTile }
}
