"use client"

import { useEffect, useState, type ComponentType } from "react"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { Button } from "@/components/ui/button"
import type { Client, Company, InvoiceDocument } from "@/lib/data/types"

interface PdfProps {
  doc: InvoiceDocument
  company: Company
  client?: Client
}

export function PdfDownloadButton({
  doc,
  company,
  client,
  fileName,
}: PdfProps & { fileName: string }) {
  const [LetterPdf, setLetterPdf] = useState<ComponentType<PdfProps> | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let mounted = true
    void import("@/lib/pdf/letter-pdf")
      .then((mod) => {
        if (mounted) setLetterPdf(() => mod.LetterPdf)
      })
      .catch(() => {
        if (mounted) setFailed(true)
      })
    return () => {
      mounted = false
    }
  }, [])

  if (failed) {
    return (
      <Button variant="secondary" disabled>
        PDF unavailable
      </Button>
    )
  }

  if (!LetterPdf) {
    return (
      <Button variant="secondary" disabled>
        Preparing PDF…
      </Button>
    )
  }

  return (
    <PDFDownloadLink
      document={<LetterPdf doc={doc} company={company} client={client} />}
      fileName={fileName}
    >
      {({ loading }) => (
        <Button variant="secondary" disabled={loading}>
          {loading ? "Preparing PDF…" : "Download PDF"}
        </Button>
      )}
    </PDFDownloadLink>
  )
}
