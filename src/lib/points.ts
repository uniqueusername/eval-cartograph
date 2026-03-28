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

  // center on centroid
  const sum = rawPoints.reduce(
    (a, b) => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z }),
    { x: 0, y: 0, z: 0 },
  )
  const n = rawPoints.length
  const centered = rawPoints.map((p) => ({
    model: p.model,
    x: p.x - sum.x / n,
    y: p.y - sum.y / n,
    z: p.z - sum.z / n,
  }))

  // normalize so RMS distance from origin = 1, then apply CLOUD_SCALE
  const rms = Math.sqrt(
    centered.reduce((s, p) => s + p.x * p.x + p.y * p.y + p.z * p.z, 0) / n,
  )
  const scale = rms > 1e-10 ? CLOUD_SCALE / rms : 1

  return centered.map((p) => ({
    model: p.model,
    x: p.x * scale,
    y: p.y * scale,
    z: p.z * scale,
  }))
}
