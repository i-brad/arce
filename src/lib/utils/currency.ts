const ONES = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
]

const TENS = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
]

const SCALES = ["", "Thousand", "Million", "Billion", "Trillion"]

export function formatNaira(amount: number): string {
  const n = Math.round(amount * 100) / 100
  const sign = n < 0 ? "-" : ""
  const abs = Math.abs(n)
  const [whole, kobo] = abs.toFixed(2).split(".")
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  if (kobo === "00") return `${sign}N ${grouped}`
  return `${sign}N ${grouped}.${kobo}`
}

function threeDigitsToWords(n: number): string {
  const hundreds = Math.floor(n / 100)
  const rest = n % 100
  const parts: string[] = []
  if (hundreds > 0) parts.push(`${ONES[hundreds]} Hundred`)
  if (rest > 0) {
    if (rest < 20) parts.push(ONES[rest])
    else {
      const t = TENS[Math.floor(rest / 10)]
      const o = ONES[rest % 10]
      parts.push(o ? `${t}-${o}` : t)
    }
  }
  return parts.join(" and ") || "Zero"
}

export function numberToNairaWords(amount: number): string {
  const n = Math.round(amount * 100) / 100
  const whole = Math.floor(Math.abs(n))
  const kobo = Math.round((Math.abs(n) - whole) * 100)

  const groups: string[] = []
  let remaining = whole
  let scale = 0
  while (remaining > 0) {
    const chunk = remaining % 1000
    if (chunk > 0) {
      const words = threeDigitsToWords(chunk)
      groups.unshift(scale === 0 ? words : `${words} ${SCALES[scale]}`)
    }
    remaining = Math.floor(remaining / 1000)
    scale += 1
  }

  const nairaPart = groups.length === 0 ? "Zero Naira" : `${groups.join(", ")} Naira`
  const koboPart = kobo > 0 ? `, ${threeDigitsToWords(kobo)} Kobo` : ""
  const sign = amount < 0 ? "Minus " : ""
  return `${sign}${nairaPart}${koboPart} only`
}
