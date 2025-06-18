"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, FileText, Calendar, User, Shield, Filter, SortAsc, Eye, Download } from "lucide-react"

interface SearchResult {
  id: string
  filename: string
  relevanceScore: number
  snippet: string
  uploadedAt: string
  uploadedBy: string
  role: string
  compliance: string[]
  classification: string
}

interface DocumentSearchProps {
  role: string
  compliance: string[]
  onDocumentSelect?: (documentId: string) => void
}

export function DocumentSearch({ role, compliance, onDocumentSelect }: DocumentSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [filters, setFilters] = useState({
    dateRange: "all",
    classification: "all",
    fileType: "all",
  })

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsSearching(true)
    try {
      const response = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          role,
          compliance,
          sessionId: `search_${Date.now()}`,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setResults(data.sources || [])
      }
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="space-y-6">
      {/* Search Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Semantic Document Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search documents using natural language..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? (
                <div className="animate-spin h-4 w-4 border border-white border-t-transparent rounded-full" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Search Filters */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Filters:</span>
            </div>
            <select
              className="border rounded px-2 py-1 text-sm"
              value={filters.dateRange}
              onChange={(e) => setFilters((prev) => ({ ...prev, dateRange: e.target.value }))}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            <select
              className="border rounded px-2 py-1 text-sm"
              value={filters.classification}
              onChange={(e) => setFilters((prev) => ({ ...prev, classification: e.target.value }))}
            >
              <option value="all">All Classifications</option>
              <option value="public">Public</option>
              <option value="internal">Internal</option>
              <option value="confidential">Confidential</option>
              <option value="restricted">Restricted</option>
            </select>
          </div>

          {/* Compliance Notice */}
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm">
              Search results filtered by {role} role permissions and {compliance.join(", ")} compliance
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Search Results ({results.length})</CardTitle>
              <Button variant="outline" size="sm">
                <SortAsc className="h-4 w-4 mr-2" />
                Sort by Relevance
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.map((result) => (
              <div key={result.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-500 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">{result.filename}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {result.uploadedBy}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(result.uploadedAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          {result.classification}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{Math.round(result.relevanceScore * 100)}% match</Badge>
                    <Button size="sm" variant="outline" onClick={() => onDocumentSelect?.(result.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-3">{result.snippet}</p>

                <div className="flex items-center gap-2">
                  {result.compliance.map((comp) => (
                    <Badge key={comp} variant="outline" className="text-xs">
                      {comp}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {query && !isSearching && results.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No documents found matching your search</p>
            <p className="text-sm text-muted-foreground mt-2">Try different keywords or adjust your filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
