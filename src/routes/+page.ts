import { parseEvalResults, parseMatrix } from "$lib/umap"

export const load = async ({ fetch }) => {
  const [umapRes, evalsRes] = await Promise.all([
    fetch("/trinity_umap.csv"),
    fetch("/trinity_evals.csv"),
  ])
  const [umapText, evalsText] = await Promise.all([
    umapRes.text(),
    evalsRes.text(),
  ])

  const { modelNames, evalNames, data } = parseMatrix(umapText)
  const { evalResultsByModel } = parseEvalResults(evalsText)

  return { modelNames, evalNames, data, evalResultsByModel }
}
