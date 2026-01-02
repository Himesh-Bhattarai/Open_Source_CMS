import { MenuBuilder } from "@/components/cms/menu-builder";
import { use } from "react";

export default function EditMenuPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return <MenuBuilder menuId={id} />;
}
