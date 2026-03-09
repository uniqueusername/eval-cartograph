export const load = async ({ fetch }) => {

  const CLOUD_SCALE = 300
  const CAMERA_DISTANCE = 1000

  const res = await fetch("/embedding2.csv")
  const text = await res.text()

  const points = text.trim().split('\n').map(row => {
    const [x, y, z] = row.split(',').map(n => CLOUD_SCALE * Number(n))
    return { x, y, z }
  })

  const sum_of_points = points.reduce(
    (a, b) => ({
      x: a.x + b.x,
      y: a.y + b.y,
      z: a.z + b.z,
    }), { x: 0, y: 0, z: 0 }
  )

  const centroid = {
    x: sum_of_points.x / points.length,
    y: sum_of_points.y / points.length,
    z: sum_of_points.z / points.length,
  }

  const camera_init_pos = {
    x: centroid.x + CAMERA_DISTANCE,
    y: centroid.y,
    z: centroid.z + CAMERA_DISTANCE,
  }

  return { points, centroid, camera_init_pos }
}
