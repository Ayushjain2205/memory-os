"use client"

import { useState } from "react"
import { Search, Filter, Calendar, Tag, FileText, Brain, Clock, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

interface SearchResult {
  id: string
  type: "memory" | "file" | "suggestion"
  title: string
  content: string
  source: string
  relevance: number
  tags: string[]
  date: string
  highlight?: string
}

const mockResults: SearchResult[] = [
  {
    id: "1",
    type: "memory",
    title: "Communication Preferences",
    content: "I prefer evening workouts and casual tone when writing emails. This helps me maintain work-life balance.",
    source: "Memory Vault",
    relevance: 95,
    tags: ["communication", "personal"],
    date: "2024-01-15",
    highlight: "casual tone when writing emails",
  },
  {
    id: "2",
    type: "file",
    title: "Product Requirements Document",
    content:
      "The new platform should support casual user interactions with AI assistants, focusing on natural language processing.",
    source: "Files/Product Requirements.pdf",
    relevance: 87,
    tags: ["product", "requirements"],
    date: "2024-01-14",
    highlight: "casual user interactions",
  },
  {
    id: "3",
    type: "suggestion",
    title: "Related Memory Suggestion",
    content:
      "You mentioned preferring casual communication. Would you like to update your email signature preferences?",
    source: "AI Suggestions",
    relevance: 78,
    tags: ["suggestion", "email"],
    date: "2024-01-15",
  },
]

const smartSuggestions = [
  "Did you mean to update your workout schedule?",
  "You mentioned this preference last week — want to recall it now?",
  "Similar memories found in your Work profile",
  "This relates to your goal about improving communication",
]

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedSource, setSelectedSource] = useState<string>("all")

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)

    // Simulate search delay
    setTimeout(() => {
      const filteredResults = mockResults.filter((result) => {
        const matchesQuery =
          result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.content.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesType = selectedType === "all" || result.type === selectedType
        const matchesSource =
          selectedSource === "all" || result.source.toLowerCase().includes(selectedSource.toLowerCase())

        return matchesQuery && matchesType && matchesSource
      })

      setResults(filteredResults)
      setIsSearching(false)
    }, 1000)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "memory":
        return Brain
      case "file":
        return FileText
      case "suggestion":
        return Lightbulb
      default:
        return Search
    }
  }

  const getTypeColor = (type: string) => {
    const colors = {
      memory: "bg-blue-100 text-blue-800",
      file: "bg-green-100 text-green-800",
      suggestion: "bg-yellow-100 text-yellow-800",
    }
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getRelevanceColor = (relevance: number) => {
    if (relevance >= 90) return "bg-green-500"
    if (relevance >= 70) return "bg-yellow-500"
    return "bg-gray-500"
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Search</h1>
        <p className="text-gray-600">Find anything across your memory vault, files, and connected data</p>
      </div>

      {/* Search Interface */}
      <div className="space-y-6">
        {/* Main Search Bar */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search your memories, files, and more..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="pl-12 h-12 text-lg"
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={!searchQuery.trim() || isSearching}
            className="bg-blue-600 hover:bg-blue-700 h-12 px-8"
          >
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700 font-medium">Filters:</span>
          </div>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="memory">Memories</SelectItem>
              <SelectItem value="file">Files</SelectItem>
              <SelectItem value="suggestion">Suggestions</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedSource} onValueChange={setSelectedSource}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Sources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="memory">Memory Vault</SelectItem>
              <SelectItem value="files">Files</SelectItem>
              <SelectItem value="apps">Connected Apps</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Smart Suggestions */}
        {searchQuery && !isSearching && results.length === 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Smart Suggestions
            </h3>
            <div className="space-y-2">
              {smartSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="block text-left text-sm text-blue-700 hover:text-blue-900 hover:underline"
                  onClick={() => setSearchQuery(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Search Results ({results.length})</h2>
              <div className="text-sm text-gray-500">Found in {(Math.random() * 0.5 + 0.1).toFixed(2)}s</div>
            </div>

            <div className="space-y-4">
              {results.map((result) => {
                const TypeIcon = getTypeIcon(result.type)

                return (
                  <Card key={result.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <TypeIcon className="h-5 w-5 text-gray-600" />
                          <div>
                            <CardTitle className="text-lg font-medium text-gray-900">{result.title}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getTypeColor(result.type)} variant="secondary">
                                {result.type}
                              </Badge>
                              <span className="text-sm text-gray-500">{result.source}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${getRelevanceColor(result.relevance)}`} />
                            <span className="text-xs text-gray-500">{result.relevance}%</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-3">
                        <p className="text-gray-700">
                          {result.highlight ? (
                            <>
                              {result.content.split(result.highlight)[0]}
                              <mark className="bg-yellow-200 px-1 rounded">{result.highlight}</mark>
                              {result.content.split(result.highlight)[1]}
                            </>
                          ) : (
                            result.content
                          )}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {result.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                <Tag className="h-3 w-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            {result.date}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* No Results */}
        {searchQuery && !isSearching && results.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search terms or filters</p>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Suggestions:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Check your spelling</li>
                <li>• Try broader search terms</li>
                <li>• Remove filters to see more results</li>
                <li>• Search for related concepts</li>
              </ul>
            </div>
          </div>
        )}

        {/* Recent Searches */}
        {!searchQuery && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Searches</h3>
              <div className="flex flex-wrap gap-2">
                {["communication preferences", "workout schedule", "project requirements", "meeting notes"].map(
                  (term, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setSearchQuery(term)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      {term}
                    </Button>
                  ),
                )}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Access</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Brain className="h-8 w-8 text-blue-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">All Memories</h4>
                        <p className="text-sm text-gray-600">Browse your memory vault</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-green-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">Recent Files</h4>
                        <p className="text-sm text-gray-600">View uploaded documents</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Tag className="h-8 w-8 text-purple-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">Popular Tags</h4>
                        <p className="text-sm text-gray-600">Explore by categories</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
