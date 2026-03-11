import { UMAP } from 'umap-js'

const DATA_PATH = process.argv[2]
const OUTPUT_PATH = process.argv[3]

if (!DATA_PATH || !OUTPUT_PATH) {
  console.error("usage: bun run preprocess.ts <input.csv> <output.csv>")
  process.exit(1)
}

const data_string: string = await Bun.file(import.meta.dir + "/../" + DATA_PATH).text()
const lines: string[] = data_string.trim().split('\n')
const model_names: string[] = lines.slice(1).map(row => row.split(',')[0])
const data: number[][] = lines.slice(1).map(row => row.split(',').slice(1).map(Number))

const umap: UMAP = new UMAP({ nComponents: 3 })
const embedding: number[][] = umap.fit(data)

const output_string: string = ['Model,x,y,z'].join(',') + '\n' + embedding.map((row, i) => `${model_names[i]},${row.join(",")}`).join('\n')
Bun.write(import.meta.dir + "/../" + OUTPUT_PATH, output_string)
