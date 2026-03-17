import { parseMatrix } from "$lib/umap"

export const load = async ({ fetch }) => {
  const res = await fetch("/matrix2.csv")
  const text = await res.text()

  const { modelNames, evalNames, data } = parseMatrix(text)

  return { modelNames, evalNames, data }
}
