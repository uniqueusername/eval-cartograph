export const load = async ({ fetch }) => {
  const CLOUD_SCALE = 300
  const CAMERA_DISTANCE = 500

  const res = await fetch("/embedding2.csv")
  const text = await res.text()

  const points = text
    .trim()
    .split("\n")
    .slice(1)
    .map((row) => {
      const [model, x, y, z] = row.split(",")
      return {
        model,
        x: CLOUD_SCALE * Number(x),
        y: CLOUD_SCALE * Number(y),
        z: CLOUD_SCALE * Number(z),
      }
    })

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
