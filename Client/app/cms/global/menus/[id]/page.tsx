import { MenuBuilder } from "@/components/cms/menu-builder"

export default function EditMenuPage({ params }: { params: { id: string } }) {
  return <MenuBuilder menuId={params.id} />
}
