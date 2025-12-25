"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Search, X, Plus, Save } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface SearchFilter {
  id: string
  field: string
  operator: string
  value: string
}

interface SavedFilter {
  id: string
  name: string
  filters: SearchFilter[]
}

export function AdvancedSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<SearchFilter[]>([])
  const [savedFilters] = useState<SavedFilter[]>([
    {
      id: "1",
      name: "Published Pages",
      filters: [{ id: "1", field: "status", operator: "equals", value: "published" }],
    },
    { id: "2", name: "My Drafts", filters: [{ id: "2", field: "author", operator: "equals", value: "Sarah K." }] },
  ])

  const fields = [
    { value: "title", label: "Title" },
    { value: "status", label: "Status" },
    { value: "author", label: "Author" },
    { value: "created", label: "Created Date" },
    { value: "modified", label: "Modified Date" },
  ]

  const operators = [
    { value: "equals", label: "Equals" },
    { value: "contains", label: "Contains" },
    { value: "starts_with", label: "Starts with" },
    { value: "ends_with", label: "Ends with" },
  ]

  const addFilter = () => {
    setFilters([
      ...filters,
      {
        id: Date.now().toString(),
        field: "title",
        operator: "contains",
        value: "",
      },
    ])
  }

  const removeFilter = (id: string) => {
    setFilters(filters.filter((f) => f.id !== id))
  }

  const updateFilter = (id: string, field: keyof SearchFilter, value: string) => {
    setFilters(filters.map((f) => (f.id === id ? { ...f, [field]: value } : f)))
  }

  const applyFilters = () => {
    console.log("[v0] Applying filters:", filters)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Search className="h-4 w-4 mr-2" />
          Advanced Search
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Advanced Search</DialogTitle>
          <DialogDescription>Create complex search queries with multiple filters</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Saved Filters */}
          {savedFilters.length > 0 && (
            <div className="space-y-2">
              <Label>Saved Filters</Label>
              <div className="flex flex-wrap gap-2">
                {savedFilters.map((saved) => (
                  <Button
                    key={saved.id}
                    variant="outline"
                    size="sm"
                    onClick={() => setFilters(saved.filters)}
                    className="bg-transparent"
                  >
                    {saved.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Active Filters */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Filters</Label>
              <Button variant="outline" size="sm" onClick={addFilter}>
                <Plus className="h-4 w-4 mr-2" />
                Add Filter
              </Button>
            </div>

            {filters.length === 0 ? (
              <div className="text-center py-8 border rounded-lg bg-muted/30">
                <p className="text-sm text-muted-foreground">No filters added yet</p>
              </div>
            ) : (
              filters.map((filter, index) => (
                <div key={filter.id} className="flex items-center gap-2">
                  {index > 0 && (
                    <Badge variant="secondary" className="h-8 px-2">
                      AND
                    </Badge>
                  )}
                  <Select value={filter.field} onValueChange={(value) => updateFilter(filter.id, "field", value)}>
                    <SelectTrigger className="w-35">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fields.map((field) => (
                        <SelectItem key={field.value} value={field.value}>
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filter.operator} onValueChange={(value) => updateFilter(filter.id, "operator", value)}>
                    <SelectTrigger className="w-35">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {operators.map((op) => (
                        <SelectItem key={op.value} value={op.value}>
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Value"
                    value={filter.value}
                    onChange={(e) => updateFilter(filter.id, "value", e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="ghost" size="icon" onClick={() => removeFilter(filter.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setFilters([])}>
            Clear All
          </Button>
          <Button variant="outline">
            <Save className="h-4 w-4 mr-2" />
            Save Filter
          </Button>
          <Button onClick={applyFilters} disabled={filters.length === 0}>
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
