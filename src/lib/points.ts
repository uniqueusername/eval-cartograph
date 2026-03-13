import { computeEmbedding, type EmbeddingPoint } from "$lib/umap"

export const CLOUD_SCALE = 300
export const CAMERA_DISTANCE = 500

export function stringHash(str: string): number {
  let hash = 2166136261
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash
}

export function modelColor(model: string): string {
  const h = Math.abs(stringHash(model)) % 360
  return `hsl(${h}, 100%, 50%)`
}

export function computePoints(
  modelNames: string[],
  evalNames: string[],
  matrixData: number[][],
  selectedModels: Set<string>,
  selectedEvals: Set<string>,
): EmbeddingPoint[] {
  const modelIndices = modelNames
    .map((n, i) => [n, i] as const)
    .filter(([n]) => selectedModels.has(n))
  const evalIndices = evalNames
    .map((n, i) => [n, i] as const)
    .filter(([n]) => selectedEvals.has(n))

  if (modelIndices.length < 2 || evalIndices.length === 0) return []

  const filteredNames = modelIndices.map(([n]) => n)
  const filteredData = modelIndices.map(([, mi]) =>
    evalIndices.map(([, ei]) => matrixData[mi][ei]),
  )

  const rawPoints = computeEmbedding(filteredNames, filteredData)

  const scaled = rawPoints.map((p) => ({
    model: p.model,
    x: CLOUD_SCALE * p.x,
    y: CLOUD_SCALE * p.y,
    z: CLOUD_SCALE * p.z,
  }))

  const sum = scaled.reduce(
    (a, b) => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z }),
    { x: 0, y: 0, z: 0 },
  )

  const centroid = {
    x: sum.x / scaled.length,
    y: sum.y / scaled.length,
    z: sum.z / scaled.length,
  }

  return scaled.map((p) => ({
    model: p.model,
    x: p.x - centroid.x,
    y: p.y - centroid.y,
    z: p.z - centroid.z,
  }))
}
