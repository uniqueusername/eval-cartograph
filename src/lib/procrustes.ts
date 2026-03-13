interface Point3D {
  model: string
  x: number
  y: number
  z: number
}

type Mat3 = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
]

function matMul(a: Mat3, b: Mat3): Mat3 {
  return [
    a[0] * b[0] + a[1] * b[3] + a[2] * b[6],
    a[0] * b[1] + a[1] * b[4] + a[2] * b[7],
    a[0] * b[2] + a[1] * b[5] + a[2] * b[8],
    a[3] * b[0] + a[4] * b[3] + a[5] * b[6],
    a[3] * b[1] + a[4] * b[4] + a[5] * b[7],
    a[3] * b[2] + a[4] * b[5] + a[5] * b[8],
    a[6] * b[0] + a[7] * b[3] + a[8] * b[6],
    a[6] * b[1] + a[7] * b[4] + a[8] * b[7],
    a[6] * b[2] + a[7] * b[5] + a[8] * b[8],
  ]
}

function transpose(m: Mat3): Mat3 {
  return [m[0], m[3], m[6], m[1], m[4], m[7], m[2], m[5], m[8]]
}

function det3(m: Mat3): number {
  return (
    m[0] * (m[4] * m[8] - m[5] * m[7])
    - m[1] * (m[3] * m[8] - m[5] * m[6])
    + m[2] * (m[3] * m[7] - m[4] * m[6])
  )
}

const IDENTITY: Mat3 = [1, 0, 0, 0, 1, 0, 0, 0, 1]

/** Jacobi eigendecomposition for a 3×3 symmetric matrix. Returns { eigenvalues, eigenvectors } */
function symmetricEigen3(s: Mat3): {
  vals: [number, number, number]
  vecs: Mat3
} {
  const a = [...s] as [...Mat3]
  let v: Mat3 = [...IDENTITY]

  for (let iter = 0; iter < 50; iter++) {
    // find largest off-diagonal
    const offDiag = [
      [0, 1],
      [0, 2],
      [1, 2],
    ] as const
    let maxVal = 0
    let pi = 0,
      pj = 1
    for (const [i, j] of offDiag) {
      const val = Math.abs(a[i * 3 + j])
      if (val > maxVal) {
        maxVal = val
        pi = i
        pj = j
      }
    }
    if (maxVal < 1e-12) break

    const ii = pi * 3 + pi,
      jj = pj * 3 + pj,
      ij = pi * 3 + pj
    const theta =
      Math.abs(a[jj] - a[ii]) < 1e-15 ?
        Math.PI / 4
      : 0.5 * Math.atan2(2 * a[ij], a[jj] - a[ii])
    const c = Math.cos(theta),
      s2 = Math.sin(theta)

    // build Givens rotation
    const g: Mat3 = [...IDENTITY]
    g[pi * 3 + pi] = c
    g[pj * 3 + pj] = c
    g[pi * 3 + pj] = s2
    g[pj * 3 + pi] = -s2

    // a = G^T * a * G
    const gt = transpose(g)
    const tmp = matMul(gt, a as Mat3)
    const rotated = matMul(tmp, g)
    for (let k = 0; k < 9; k++) a[k] = rotated[k]

    // v = v * G
    const newV = matMul(v, g)
    v = newV
  }

  return {
    vals: [a[0], a[4], a[8]],
    vecs: v,
  }
}

/** SVD of a 3×3 matrix M = U * diag(sigma) * V^T */
function svd3(m: Mat3): { u: Mat3; sigma: [number, number, number]; vt: Mat3 } {
  const mt = transpose(m)
  const mtm = matMul(mt, m)
  const { vals, vecs: v } = symmetricEigen3(mtm)

  // singular values = sqrt of eigenvalues, build sigma and V
  const sigma: [number, number, number] = [
    Math.sqrt(Math.max(0, vals[0])),
    Math.sqrt(Math.max(0, vals[1])),
    Math.sqrt(Math.max(0, vals[2])),
  ]

  // sort by descending singular value
  const order = [0, 1, 2].sort((a, b) => sigma[b] - sigma[a])
  const sortedSigma: [number, number, number] = [
    sigma[order[0]],
    sigma[order[1]],
    sigma[order[2]],
  ]

  // reorder columns of V
  const sortedV: Mat3 = [0, 0, 0, 0, 0, 0, 0, 0, 0]
  for (let col = 0; col < 3; col++) {
    const srcCol = order[col]
    for (let row = 0; row < 3; row++) {
      sortedV[row * 3 + col] = v[row * 3 + srcCol]
    }
  }

  // U = M * V * diag(1/sigma)
  const mv = matMul(m, sortedV)
  const u: Mat3 = [...IDENTITY]
  for (let col = 0; col < 3; col++) {
    const s = sortedSigma[col]
    if (s > 1e-10) {
      for (let row = 0; row < 3; row++) {
        u[row * 3 + col] = mv[row * 3 + col] / s
      }
    } else {
      // degenerate: keep identity column
      for (let row = 0; row < 3; row++) {
        u[row * 3 + col] = row === col ? 1 : 0
      }
    }
  }

  return { u, sigma: sortedSigma, vt: transpose(sortedV) }
}

/**
 * Align `newPoints` to `oldPoints` using orthogonal Procrustes.
 * Matches points by model name. Returns transformed new points.
 * If fewer than 3 common models, returns newPoints unmodified.
 */
export function alignProcrustes(
  oldPoints: Point3D[],
  newPoints: Point3D[],
): Point3D[] {
  if (oldPoints.length === 0) return newPoints

  const oldMap = new Map(oldPoints.map((p) => [p.model, p]))
  const pairedOld: [number, number, number][] = []
  const pairedNew: [number, number, number][] = []
  const pairedIndices: number[] = []

  for (let i = 0; i < newPoints.length; i++) {
    const op = oldMap.get(newPoints[i].model)
    if (op) {
      pairedOld.push([op.x, op.y, op.z])
      pairedNew.push([newPoints[i].x, newPoints[i].y, newPoints[i].z])
      pairedIndices.push(i)
    }
  }

  if (pairedOld.length < 3) return newPoints

  // Build M = A^T * B  where A = old (target), B = new (source)
  // We want R such that B * R ≈ A
  const m: Mat3 = [0, 0, 0, 0, 0, 0, 0, 0, 0]
  for (let k = 0; k < pairedOld.length; k++) {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // M_ij = sum( B_ki * A_kj ) = B^T * A
        m[i * 3 + j] += pairedNew[k][i] * pairedOld[k][j]
      }
    }
  }

  const { u, vt } = svd3(m)

  // R = V * U^T  (but our vt is V^T, so V = vt^T)
  const v = transpose(vt)
  const ut = transpose(u)
  let r = matMul(v, ut)

  // Check for reflection
  if (det3(r) < 0) {
    // Flip sign of last column of V, then recompute R
    const vFixed: Mat3 = [...v]
    vFixed[2] = -vFixed[2]
    vFixed[5] = -vFixed[5]
    vFixed[8] = -vFixed[8]
    r = matMul(vFixed, ut)
  }

  // Apply R to all new points
  return newPoints.map((p) => ({
    model: p.model,
    x: r[0] * p.x + r[1] * p.y + r[2] * p.z,
    y: r[3] * p.x + r[4] * p.y + r[5] * p.z,
    z: r[6] * p.x + r[7] * p.y + r[8] * p.z,
  }))
}
