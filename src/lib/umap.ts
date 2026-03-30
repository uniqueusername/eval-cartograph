import { UMAP } from "umap-js"

export interface EmbeddingPoint {
  model: string
  x: number
  y: number
  z: number
}

export interface EvalResult {
  evalName: string
  displayName: string
  score: number
}

export function parseMatrix(csv: string): {
  modelNames: string[]
  evalNames: string[]
  data: number[][]
} {
  const lines = csv.trim().split("\n")
  const evalNames = lines[0].split(",").slice(1)
  const modelNames = lines.slice(1).map((row) => row.split(",")[0])
  const data = lines.slice(1).map((row) => row.split(",").slice(1).map(Number))
  return { modelNames, evalNames, data }
}

export function parseEvalResults(csv: string): {
  modelNames: string[]
  evalResultsByModel: Record<string, EvalResult[]>
} {
  const lines = csv.trim().split("\n")
  const evalNames = lines[0].split(",").slice(1)
  const evalResultsByModel: Record<string, EvalResult[]> = {}

  for (const row of lines.slice(1)) {
    const [model, ...scores] = row.split(",")
    evalResultsByModel[model] = evalNames.map((evalName, index) => ({
      evalName,
      displayName:
        evalName.includes("/") ?
          evalName.split("/").slice(1).join("/")
        : evalName,
      score: Number(scores[index]),
    }))
  }

  return {
    modelNames: lines.slice(1).map((row) => row.split(",")[0]),
    evalResultsByModel,
  }
}

function seededRandom(seed: number): () => number {
  return () => {
    seed = (seed * 16807 + 0) % 2147483647
    return (seed - 1) / 2147483646
  }
}

export function computeEmbedding(
  modelNames: string[],
  data: number[][],
): EmbeddingPoint[] {
  const umap = new UMAP({
    nComponents: 3,
    random: seededRandom(42),
    nNeighbors: 6,
  })
  const embedding = umap.fit(data)
  return embedding.map((row, i) => ({
    model: modelNames[i],
    x: row[0],
    y: row[1],
    z: row[2],
  }))
}
