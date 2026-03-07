export const load = async ({ fetch }) => {
  const res = await fetch("/embedding.csv")
  const text = await res.text()

  const points = text.trim().split('\n').map(row => {
    const [x, y, z] = row.split(',').map(Number)
    return { x, y, z }
  })

  return { points }
}
