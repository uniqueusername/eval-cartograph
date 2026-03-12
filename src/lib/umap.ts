import { UMAP } from 'umap-js'

export interface EmbeddingPoint {
  model: string
  x: number
  y: number
  z: number
}

export function parseMatrix(csv: string): { modelNames: string[]; data: number[][] } {
  const lines = csv.trim().split('\n')
  const modelNames = lines.slice(1).map(row => row.split(',')[0])
  const data = lines.slice(1).map(row => row.split(',').slice(1).map(Number))
  return { modelNames, data }
}

export function computeEmbedding(modelNames: string[], data: number[][]): EmbeddingPoint[] {
  const umap = new UMAP({ nComponents: 3 })
  const embedding = umap.fit(data)
  return embedding.map((row, i) => ({
    model: modelNames[i],
    x: row[0],
    y: row[1],
    z: row[2],
  }))
}
