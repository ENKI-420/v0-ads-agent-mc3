import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Presentation, BarChart, DollarSign, FileText } from "lucide-react"

export default function InvestorDossierPage() {
  return (
    <div className="grid gap-6 p-4 md:p-6">
      <h1 className="text-3xl font-bold">Investor Dossier</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <Presentation className="h-6 w-6 text-purple-500" />
            <CardTitle>Investor Deck Q3 2025</CardTitle>
            <CardDescription>Latest presentation for potential investors.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-end">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <BarChart className="h-6 w-6 text-green-500" />
            <CardTitle>Financial Performance Summary</CardTitle>
            <CardDescription>Key financial metrics and growth indicators.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-end">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <DollarSign className="h-6 w-6 text-yellow-500" />
            <CardTitle>Valuation Report</CardTitle>
            <CardDescription>Independent valuation of the company.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-end">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <FileText className="h-6 w-6 text-blue-500" />
            <CardTitle>Legal & Compliance Documents</CardTitle>
            <CardDescription>Essential legal and regulatory filings.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-end">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
