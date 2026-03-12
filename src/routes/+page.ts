import { parseMatrix, computeEmbedding } from "$lib/umap"

export const load = async ({ fetch }) => {
  const CLOUD_SCALE = 300
  const CAMERA_DISTANCE = 500

  const res = await fetch("/matrix2.csv")
  const text = await res.text()

  const { modelNames, data } = parseMatrix(text)
  const rawPoints = computeEmbedding(modelNames, data)

  const points = rawPoints.map((p) => ({
    model: p.model,
    x: CLOUD_SCALE * p.x,
    y: CLOUD_SCALE * p.y,
    z: CLOUD_SCALE * p.z,
  }))

  const sum_of_points = points.reduce(
    (a, b) => ({
      x: a.x + b.x,
      y: a.y + b.y,
      z: a.z + b.z,
    }),
    { x: 0, y: 0, z: 0 },
  )

  const centroid = {
    x: sum_of_points.x / points.length,
    y: sum_of_points.y / points.length,
    z: sum_of_points.z / points.length,
  }

  const centered_points = points.map((p) => ({
    model: p.model,
    x: p.x - centroid.x,
    y: p.y - centroid.y,
    z: p.z - centroid.z,
  }))

  const camera_init_pos = {
    x: CAMERA_DISTANCE,
    y: CAMERA_DISTANCE,
    z: CAMERA_DISTANCE,
  }

  return { points: centered_points, camera_init_pos }
}
