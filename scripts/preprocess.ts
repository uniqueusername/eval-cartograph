import { UMAP } from 'umap-js'

const DATA_PATH: string = "/../static/matrix.csv"
const OUTPUT_PATH: string = "/../static/embedding.csv"

const data_string: string = await Bun.file(import.meta.dir + DATA_PATH).text()
const data: number[][] = data_string.trim().split('\n').map(row => row.split(',').map(Number))

const umap: UMAP = new UMAP({ nComponents: 3 })
const embedding: number[][] = umap.fit(data)

const output_string: string = embedding.map(row => row.join(",")).join('\n')
Bun.write(import.meta.dir + OUTPUT_PATH, output_string)
