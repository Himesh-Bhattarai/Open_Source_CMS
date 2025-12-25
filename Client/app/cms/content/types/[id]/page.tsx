"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Save,
  ArrowLeft,
  GripVertical,
  Settings,
  Plus,
  Trash2,
  Type,
  ImageIcon,
  FileText,
  Calendar,
  ToggleLeft,
  Hash,
  LinkIcon,
} from "lucide-react"
import Link from "next/link"
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

const fieldTypes = [
  { value: "text", label: "Text", icon: Type },
  { value: "textarea", label: "Rich Text", icon: FileText },
  { value: "number", label: "Number", icon: Hash },
  { value: "date", label: "Date", icon: Calendar },
  { value: "boolean", label: "Boolean", icon: ToggleLeft },
  { value: "image", label: "Image", icon: ImageIcon },
  { value: "relation", label: "Relation", icon: LinkIcon },
]

export default function ContentTypeEditor() {
  const params = useParams()
  const router = useRouter()
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false)
  const [newField, setNewField] = useState({
    name: "",
    type: "text",
    required: false,
  })

  const [contentType, setContentType] = useState({
    id: params.id,
    name: "Products",
    description: "Product catalog items",
    fields: [
      { id: "1", name: "Title", type: "text", required: true },
      { id: "2", name: "Description", type: "textarea", required: true },
      { id: "3", name: "Price", type: "number", required: true },
      { id: "4", name: "Featured Image", type: "image", required: false },
      { id: "5", name: "Published Date", type: "date", required: true },
    ],
  })

  const handleAddField = () => {
    if (newField.name) {
      const field = {
        id: Date.now().toString(),
        name: newField.name,
        type: newField.type,
        required: newField.required,
      }
      setContentType({
        ...contentType,
        fields: [...contentType.fields, field],
      })
      setNewField({ name: "", type: "text", required: false })
      setIsAddFieldOpen(false)
    }
  }

  const handleDeleteField = (fieldId: string) => {
    setContentType({
      ...contentType,
      fields: contentType.fields.filter((f) => f.id !== fieldId),
    })
  }

  const getFieldIcon = (type: string) => {
    const fieldType = fieldTypes.find((ft) => ft.value === type)
    return fieldType ? fieldType.icon : Type
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/cms/content/types">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-balance text-3xl font-bold tracking-tight">Edit Content Type</h1>
          <p className="text-pretty text-muted-foreground mt-1">Configure fields and validation</p>
        </div>
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Fields</CardTitle>
            <CardDescription>Define the structure of your content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {contentType.fields.map((field) => {
              const FieldIcon = getFieldIcon(field.type)
              return (
                <div
                  key={field.id}
                  className="flex items-center gap-3 p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                  <div className="h-9 w-9 rounded-lg bg-background flex items-center justify-center">
                    <FieldIcon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{field.name}</p>
                      {field.required && (
                        <Badge variant="secondary" className="text-xs">
                          Required
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground capitalize">{field.type}</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteField(field.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )
            })}

            <Dialog open={isAddFieldOpen} onOpenChange={setIsAddFieldOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Field
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Field</DialogTitle>
                  <DialogDescription>Configure the field properties</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="fieldName">Field Name</Label>
                    <Input
                      id="fieldName"
                      placeholder="e.g., Product Name"
                      value={newField.name}
                      onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fieldType">Field Type</Label>
                    <Select value={newField.type} onValueChange={(value) => setNewField({ ...newField, type: value })}>
                      <SelectTrigger id="fieldType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fieldTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <type.icon className="h-4 w-4" />
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="required"
                      checked={newField.required}
                      onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="required" className="cursor-pointer">
                      Required field
                    </Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddFieldOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddField}>Add Field</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="typeName">Name</Label>
                <Input
                  id="typeName"
                  value={contentType.name}
                  onChange={(e) => setContentType({ ...contentType, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="typeDescription">Description</Label>
                <Textarea
                  id="typeDescription"
                  value={contentType.description}
                  onChange={(e) => setContentType({ ...contentType, description: e.target.value })}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Enable drafts</p>
                  <p className="text-xs text-muted-foreground">Allow saving draft entries</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Versioning</p>
                  <p className="text-xs text-muted-foreground">Track content history</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">SEO fields</p>
                  <p className="text-xs text-muted-foreground">Add meta title & description</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
