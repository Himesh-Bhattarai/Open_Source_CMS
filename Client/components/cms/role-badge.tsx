import { Badge } from "@/components/ui/badge"
import type { Role } from "@/lib/permissions"
import { Shield, Edit, FileText, Eye } from "lucide-react"

interface RoleBadgeProps {
  role: Role
  showIcon?: boolean
}

const roleConfig = {
  admin: {
    label: "Admin",
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    icon: Shield,
  },
  editor: {
    label: "Editor",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    icon: Edit,
  },
  author: {
    label: "Author",
    className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    icon: FileText,
  },
  viewer: {
    label: "Viewer",
    className: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
    icon: Eye,
  },
}

export function RoleBadge({ role, showIcon = false }: RoleBadgeProps) {
  const config = roleConfig[role]
  const Icon = config.icon

  return (
    <Badge variant="secondary" className={config.className}>
      {showIcon && <Icon className="h-3 w-3 mr-1" />}
      {config.label}
    </Badge>
  )
}
