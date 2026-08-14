export const FLOWER_SPACING = 74
export const FLOWER_PETAL_R = 4
export const FLOWER_CENTER_R = 1.4

export interface FlowerShape {
  path: string
  centerX: number
  centerY: number
  centerR: number
}

export function flowerPath(
  cx: number,
  cy: number,
  petalR = FLOWER_PETAL_R,
  centerR = FLOWER_CENTER_R,
): FlowerShape {
  const petals = 6
  const phi = (Math.PI * 2) / petals
  const ctrl = petalR * 0.55
  let d = `M ${cx.toFixed(2)} ${cy.toFixed(2)}`
  for (let i = 0; i < petals; i++) {
    const a = phi * i - Math.PI / 2
    const tipX = cx + Math.cos(a) * petalR
    const tipY = cy + Math.sin(a) * petalR
    const c1x = cx + Math.cos(a - phi / 2) * ctrl
    const c1y = cy + Math.sin(a - phi / 2) * ctrl
    const c2x = cx + Math.cos(a + phi / 2) * ctrl
    const c2y = cy + Math.sin(a + phi / 2) * ctrl
    d += ` Q ${c1x.toFixed(2)} ${c1y.toFixed(2)} ${tipX.toFixed(2)} ${tipY.toFixed(2)}`
    d += ` Q ${c2x.toFixed(2)} ${c2y.toFixed(2)} ${cx.toFixed(2)} ${cy.toFixed(2)}`
  }
  d += " Z"
  return { path: d, centerX: cx, centerY: cy, centerR }
}
