"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Save,
  GripVertical,
  Settings,
  Menu,
  Type,
  Image,
  Mail,
  Trash2,
  Edit,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Github,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast as sonnerToast } from "sonner";
import { createFooter } from "@/Api/Footer/Create";
import { useTenant } from "@/context/TenantContext";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { fetchFooterById as getFooterById } from "@/Api/Footer/Fetch";
import { updateFooter } from "@/Api/Footer/Create";

// Data Models
interface MenuLink {
  id: string;
  label: string;
  slug: string;
}

interface LogoBlockData {
  imageUrl: string;
  altText: string;
  text?: string;
  link?: string;
}

interface MenuBlockData {
  title: string;
  links: MenuLink[];
}

interface TextBlockData {
  title?: string;
  content: string;
}

interface NewsletterBlockData {
  title: string;
  description: string;
  buttonText: string;
  buttonAction: "subscribe" | "redirect";
  redirectUrl?: string;
}

type BlockData = LogoBlockData | MenuBlockData | TextBlockData | NewsletterBlockData;

interface FooterBlock {
  id: string;
  type: "logo" | "menu" | "text" | "newsletter";
  data: BlockData;
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  label?: string;
  slug?: string;
}

type FooterStatus = "draft" | "published";

interface FooterCMSData {
  tenantId: string;
  layout: "4-column" | "3-column" | "custom";
  blocks: FooterBlock[];
  bottomBar: {
    copyrightText: string;
    socialLinks: SocialLink[];
  };
  status?: FooterStatus;
  publishedAt?: string | null;
  metadata?: {
    createdAt?: string;
    updatedAt?: string;
    status?: FooterStatus;
  };
}

export default function FooterBuilder() {
  const router = useRouter();
  const [blocks, setBlocks] = useState<FooterBlock[]>([]);
  const [layout, setLayout] = useState<"4-column" | "3-column" | "custom">("4-column");
  const [footerStatus, setFooterStatus] = useState<FooterStatus>("draft");
  const [editOpen, setEditOpen] = useState(false);
  const [socialLinksOpen, setSocialLinksOpen] = useState(false);
  const [activeBlock, setActiveBlock] = useState<FooterBlock | null>(null);

  const [copyrightText, setCopyrightText] = useState("");
  const searchParams = useSearchParams();
  const footerId = searchParams.get("footerId");
  const isEditMode = Boolean(footerId);

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    {
      id: "1",
      platform: "facebook",
      url: "",
      icon: "facebook",
      label: "Facebook",
      slug: "facebook",
    },
    {
      id: "2",
      platform: "twitter",
      url: "",
      icon: "twitter",
      label: "Twitter",
      slug: "twitter",
    },
    {
      id: "3",
      platform: "instagram",
      url: "",
      icon: "instagram",
      label: "Instagram",
      slug: "instagram",
    },
  ]);
  const toast = ({
    title,
    description,
    variant,
  }: {
    title: string;
    description?: string;
    variant?: "destructive";
  }) => {
    const message = description || title;
    if (variant === "destructive") {
      sonnerToast.error(message);
      return;
    }
    sonnerToast.success(message);
  };

  const { tenants, activeTenant, setActiveTenant } = useTenant();

  const blockTypes = [
    { type: "text", label: "Text Block", icon: Type },
    { type: "menu", label: "Menu", icon: Menu },
    { type: "logo", label: "Logo", icon: Image },
    { type: "newsletter", label: "Newsletter", icon: Mail },
  ];

  const platformIcons: Record<string, React.ElementType> = {
    facebook: Facebook,
    twitter: Twitter,
    instagram: Instagram,
    linkedin: Linkedin,
    youtube: Youtube,
    github: Github,
  };

  function createEmptyBlock(type: FooterBlock["type"]): FooterBlock {
    const base = {
      id: crypto.randomUUID(),
      type,
      data: {} as BlockData,
    };

    switch (type) {
      case "logo":
        base.data = {
          imageUrl: "",
          altText: "",
          text: "",
          link: "",
        };
        break;
      case "menu":
        base.data = {
          title: "",
          links: [],
        };
        break;
      case "text":
        base.data = {
          title: "",
          content: "",
        };
        break;
      case "newsletter":
        base.data = {
          title: "",
          description: "",
          buttonText: "Subscribe",
          buttonAction: "subscribe",
        };
        break;
    }

    return base;
  }

  function addBlock(type: FooterBlock["type"]) {
    const newBlock = createEmptyBlock(type);
    setBlocks((prev) => [...prev, newBlock]);
  }

  function deleteBlock(id: string) {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  }

  function saveEdit() {
    if (!activeBlock) return;
    setBlocks((prev) => prev.map((b) => (b.id === activeBlock.id ? activeBlock : b)));
    setEditOpen(false);
  }

  function updateBlockData(field: string, value: unknown) {
    if (!activeBlock) return;
    setActiveBlock({
      ...activeBlock,
      data: {
        ...activeBlock.data,
        [field]: value,
      },
    });
  }

  function addMenuLink() {
    if (!activeBlock || activeBlock.type !== "menu") return;
    const menuData = activeBlock.data as MenuBlockData;
    const newLink: MenuLink = {
      id: crypto.randomUUID(),
      label: "",
      slug: "",
    };
    setActiveBlock({
      ...activeBlock,
      data: {
        ...menuData,
        links: [...menuData.links, newLink],
      },
    });
  }

  function updateMenuLink(linkId: string, field: "label" | "slug", value: string) {
    if (!activeBlock || activeBlock.type !== "menu") return;
    const menuData = activeBlock.data as MenuBlockData;
    setActiveBlock({
      ...activeBlock,
      data: {
        ...menuData,
        links: menuData.links.map((link) =>
          link.id === linkId ? { ...link, [field]: value } : link,
        ),
      },
    });
  }

  function deleteMenuLink(linkId: string) {
    if (!activeBlock || activeBlock.type !== "menu") return;
    const menuData = activeBlock.data as MenuBlockData;
    setActiveBlock({
      ...activeBlock,
      data: {
        ...menuData,
        links: menuData.links.filter((link) => link.id !== linkId),
      },
    });
  }

  // Social Links Functions
  function updateSocialLink(id: string, field: keyof SocialLink, value: string) {
    setSocialLinks((prev) =>
      prev.map((link) => (link.id === id ? { ...link, [field]: value } : link)),
    );
  }

  function addNewSocialLink() {
    const newLink: SocialLink = {
      id: crypto.randomUUID(),
      platform: "custom",
      url: "",
      icon: "link",
      label: "",
      slug: "",
    };
    setSocialLinks((prev) => [...prev, newLink]);
  }

  function removeSocialLink(id: string) {
    setSocialLinks((prev) => prev.filter((link) => link.id !== id));
  }

  function getBlockTitle(block: FooterBlock): string {
    switch (block.type) {
      case "logo":
        const logoData = block.data as LogoBlockData;
        return logoData.text || logoData.altText || "Logo Block";
      case "menu":
        const menuData = block.data as MenuBlockData;
        return menuData.title || "Menu Block";
      case "text":
        const textData = block.data as TextBlockData;
        return textData.title || "Text Block";
      case "newsletter":
        const newsletterData = block.data as NewsletterBlockData;
        return newsletterData.title || "Newsletter Block";
      default:
        return "Untitled Block";
    }
  }

  function getBlockDescription(block: FooterBlock): string {
    switch (block.type) {
      case "logo":
        return "Logo";
      case "menu":
        const menuData = block.data as MenuBlockData;
        return `${menuData.links.length} link${menuData.links.length !== 1 ? "s" : ""}`;
      case "text":
        const textData = block.data as TextBlockData;
        return textData.content.substring(0, 20) + (textData.content.length > 20 ? "..." : "");
      case "newsletter":
        const newsletterData = block.data as NewsletterBlockData;
        return (
          newsletterData.description.substring(0, 30) +
          (newsletterData.description.length > 30 ? "..." : "")
        );
      default:
        return "";
    }
  }

  // Function to gather all data for backend
  function gatherFooterData(statusOverride?: FooterStatus): FooterCMSData {
    const nextStatus = statusOverride ?? footerStatus;
    return {
      tenantId: activeTenant?._id ?? "",
      layout,
      blocks: blocks.map((block) => ({
        id: block.id,
        type: block.type,
        data: block.data,
      })),
      bottomBar: {
        copyrightText,
        socialLinks: socialLinks.filter((link) => link.url.trim() !== ""), // Only include links with URLs
      },
      status: nextStatus,
      publishedAt: nextStatus === "published" ? new Date().toISOString() : null,
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: nextStatus,
      },
    };
  }

  // Function to validate data before sending
  function validateFooterData(data: FooterCMSData): boolean {
    if (!data.tenantId) {
      toast({
        title: "Missing Information",
        description: "Please select a tenant",
        variant: "destructive",
      });
      return false;
    }

    if (data.blocks.length === 0) {
      toast({
        title: "No Blocks Added",
        description: "Please add at least one footer block",
        variant: "destructive",
      });
      return false;
    }

    // Validate blocks have required data
    for (const block of data.blocks) {
      switch (block.type) {
        case "logo":
          const logoData = block.data as LogoBlockData;
          if (!logoData.imageUrl || !logoData.altText) {
            toast({
              title: "Invalid Logo Block",
              description: "Logo blocks require an image URL and alt text",
              variant: "destructive",
            });
            return false;
          }
          break;
        case "menu":
          const menuData = block.data as MenuBlockData;
          if (menuData.links.length === 0) {
            toast({
              title: "Invalid Menu Block",
              description: "Menu blocks require at least one link",
              variant: "destructive",
            });
            return false;
          }
          for (const link of menuData.links) {
            if (!link.label.trim() || !link.slug.trim()) {
              toast({
                title: "Invalid Menu Link",
                description: "All menu links must have both label and slug",
                variant: "destructive",
              });
              return false;
            }
          }
          break;
        case "text":
          const textData = block.data as TextBlockData;
          if (!textData.content.trim()) {
            toast({
              title: "Invalid Text Block",
              description: "Text blocks require content",
              variant: "destructive",
            });
            return false;
          }
          break;
        case "newsletter":
          const newsletterData = block.data as NewsletterBlockData;
          if (!newsletterData.title || !newsletterData.description || !newsletterData.buttonText) {
            toast({
              title: "Invalid Newsletter Block",
              description: "Newsletter blocks require title, description, and button text",
              variant: "destructive",
            });
            return false;
          }
          if (newsletterData.buttonAction === "redirect" && !newsletterData.redirectUrl) {
            toast({
              title: "Invalid Newsletter Block",
              description: "Redirect action requires a redirect URL",
              variant: "destructive",
            });
            return false;
          }
          break;
      }
    }

    return true;
  }

  // Function to handle save draft
  async function handleSave(status: FooterStatus) {
    const footerData = gatherFooterData(status);

    if (!validateFooterData(footerData)) return;

    try {
      const response = isEditMode
        ? await updateFooter(footerId!, footerData)
        : await createFooter(footerData);

      setFooterStatus(status);
      toast({
        title: "Success",
        description:
          response?.message || (status === "published" ? "Footer published" : "Footer saved"),
      });

      router.push("/cms/global/footer");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to save footer";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  }

  // Function to handle preview
  function handlePreview() {
    toast({
      title: "Preview Mode",
      description: "Check console for footer data",
    });
  }

  // Function to handle discard changes
  function handleDiscardChanges() {
    setBlocks([]);
    setFooterStatus("draft");
    setCopyrightText("");
    setSocialLinks([
      {
        id: "1",
        platform: "facebook",
        url: "",
        icon: "facebook",
        label: "Facebook",
        slug: "facebook",
      },
      {
        id: "2",
        platform: "twitter",
        url: "",
        icon: "twitter",
        label: "Twitter",
        slug: "twitter",
      },
      {
        id: "3",
        platform: "instagram",
        url: "",
        icon: "instagram",
        label: "Instagram",
        slug: "instagram",
      },
    ]);

    toast({
      title: "Changes Discarded",
      description: "All changes have been reset",
    });
  }

  const gridCols =
    layout === "3-column" ? "grid-cols-3" : layout === "custom" ? "grid-cols-2" : "grid-cols-4";

  const visibleBlocks = blocks;

  useEffect(() => {
    if (!footerId) return;

    async function loadFooter() {
      try {
        const res = await getFooterById(footerId);
        if (!res?.ok) throw new Error("Failed to load footer");

        const footer = res.data;

        setLayout(footer.layout);
        setBlocks(footer.blocks);
        setFooterStatus(footer?.status === "published" ? "published" : "draft");
        setCopyrightText(footer.bottomBar?.copyrightText || "");
        setSocialLinks(footer.bottomBar?.socialLinks || []);
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to load footer",
          variant: "destructive",
        });
      }
    }

    loadFooter();
  }, [footerId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{isEditMode ? "Edit Footer" : "Create Footer"}</h1>

          <p className="text-pretty text-muted-foreground mt-1">
            Design your site footer with flexible blocks
          </p>
          <p className="text-xs mt-2 text-muted-foreground">
            Current status: <span className="font-medium">{footerStatus}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDiscardChanges}>
            Discard Changes
          </Button>
          <Button variant="outline" onClick={handlePreview}>
            Preview
          </Button>
          <Button variant="outline" onClick={() => handleSave("draft")}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={() => handleSave("published")}>
            <Save className="h-4 w-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Website Footer Settings</CardTitle>
          <CardDescription>Create or edit footer for a specific website</CardDescription>
        </CardHeader>

        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tenantId">Tenant</Label>
            <select
              disabled={isEditMode}
              id="tenantId"
              className="w-full border rounded-md px-3 py-2 text-sm bg-background"
              value={activeTenant?._id ?? ""}
              onChange={(e) => {
                const tenant = tenants.find((t) => t._id === e.target.value);
                if (tenant) setActiveTenant(tenant);
              }}
            >
              <option value="">Select Tenant</option>
              {tenants.map((tenant) => (
                <option key={tenant._id} value={tenant._id}>
                  {tenant.name}
                </option>
              ))}
            </select>

            {isEditMode && <input type="hidden" name="tenantId" value={activeTenant?._id ?? ""} />}
          </div>
          <div className="space-y-2">
            <Label htmlFor="footer-status">Status</Label>
            <select
              id="footer-status"
              className="w-full border rounded-md px-3 py-2 text-sm bg-background"
              value={footerStatus}
              onChange={(event) => setFooterStatus(event.target.value as FooterStatus)}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Layout</CardTitle>
          <CardDescription>Choose your footer column structure</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={layout}
            onValueChange={(value) => setLayout(value as "4-column" | "3-column" | "custom")}
          >
            <div className="grid grid-cols-3 gap-4">
              <div className="relative">
                <RadioGroupItem value="4-column" id="4-col" className="peer sr-only" />
                <Label
                  htmlFor="4-col"
                  className="flex flex-col items-center gap-3 rounded-lg border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer"
                >
                  <div className="flex gap-1 w-full">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex-1 h-16 bg-muted rounded" />
                    ))}
                  </div>
                  <span className="text-sm font-medium">4 Columns</span>
                </Label>
              </div>

              <div className="relative">
                <RadioGroupItem value="3-column" id="3-col" className="peer sr-only" />
                <Label
                  htmlFor="3-col"
                  className="flex flex-col items-center gap-3 rounded-lg border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer"
                >
                  <div className="flex gap-1 w-full">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex-1 h-16 bg-muted rounded" />
                    ))}
                  </div>
                  <span className="text-sm font-medium">3 Columns</span>
                </Label>
              </div>

              <div className="relative">
                <RadioGroupItem value="custom" id="custom" className="peer sr-only" />
                <Label
                  htmlFor="custom"
                  className="flex flex-col items-center gap-3 rounded-lg border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer"
                >
                  <div className="flex gap-1 w-full">
                    <div className="w-1/3 h-16 bg-muted rounded" />
                    <div className="flex-1 h-16 bg-muted rounded" />
                  </div>
                  <span className="text-sm font-medium">Custom</span>
                </Label>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Footer Blocks</CardTitle>
              <CardDescription>Add and arrange content blocks</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Block
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Footer Block</DialogTitle>
                  <DialogDescription>Choose a block type to add</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {blockTypes.map((blockType) => (
                    <button
                      key={blockType.type}
                      onClick={() => addBlock(blockType.type as FooterBlock["type"])}
                      className="flex flex-col items-center gap-3 p-4 border-2 rounded-lg hover:border-primary hover:bg-accent transition-colors"
                    >
                      <blockType.icon className="h-8 w-8" />
                      <span className="font-medium">{blockType.label}</span>
                    </button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          <div className={`grid ${gridCols} gap-4`}>
            {visibleBlocks.map((block) => (
              <Card key={block.id} className="group hover:shadow-md transition-shadow">
                <CardHeader className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                      <div>
                        <CardTitle className="text-sm">
                          {getBlockTitle(block) || "(Untitled)"}
                        </CardTitle>
                        <CardDescription className="text-xs capitalize">
                          {block.type === "logo" && "Logo"}
                          {block.type === "menu" &&
                            `${(block.data as MenuBlockData).links.length} link${(block.data as MenuBlockData).links.length !== 1 ? "s" : ""}`}
                          {block.type === "text" && "Text"}
                          {block.type === "newsletter" && "Newsletter"}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 pt-0">
                  <div className="h-24 bg-muted rounded p-2 overflow-hidden text-xs">
                    {block.type === "menu" && (
                      <div className="h-full flex flex-col">
                        <div className="font-medium text-foreground mb-1 truncate">
                          {(block.data as MenuBlockData).title || "Menu Title"}
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-0.5">
                          {(block.data as MenuBlockData).links.length > 0 ? (
                            (block.data as MenuBlockData).links.map((link) => (
                              <div
                                key={link.id}
                                className="text-muted-foreground hover:text-foreground truncate"
                              >
                                → {link.label || "Link"}
                              </div>
                            ))
                          ) : (
                            <div className="text-muted-foreground italic">No links added</div>
                          )}
                        </div>
                      </div>
                    )}

                    {block.type === "logo" && (
                      <div className="h-full flex flex-col items-center justify-center">
                        <div className="w-8 h-8 bg-primary/20 rounded flex items-center justify-center mb-1">
                          <Image className="h-4 w-4 text-primary" />
                        </div>
                        <div className="text-center truncate max-w-full">
                          {(block.data as LogoBlockData).text || "Logo"}
                        </div>
                      </div>
                    )}

                    {block.type === "text" && (
                      <div className="h-full overflow-hidden">
                        {(block.data as TextBlockData).title && (
                          <div className="font-medium text-foreground mb-1 truncate">
                            {(block.data as TextBlockData).title}
                          </div>
                        )}
                        <div className="text-muted-foreground text-[10px] leading-tight line-clamp-3">
                          {(block.data as TextBlockData).content || "No content"}
                        </div>
                      </div>
                    )}

                    {block.type === "newsletter" && (
                      <div className="h-full flex flex-col">
                        <div className="font-medium text-foreground mb-1 truncate">
                          {(block.data as NewsletterBlockData).title || "Newsletter"}
                        </div>
                        <div className="text-[10px] text-muted-foreground mb-1 line-clamp-2 flex-1">
                          {(block.data as NewsletterBlockData).description || "Stay updated"}
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="flex-1 h-5 bg-background border rounded px-2 flex items-center text-[10px]">
                            email@example.com
                          </div>
                          <div className="h-5 px-2 bg-primary text-primary-foreground rounded text-[10px] flex items-center">
                            {(block.data as NewsletterBlockData).buttonText || "Subscribe"}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => {
                        setActiveBlock(block);
                        setEditOpen(true);
                      }}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => deleteBlock(block.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bottom Bar</CardTitle>
          <CardDescription>Copyright text and social links</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="copyright">Copyright Text</Label>
              <Input
                id="copyright"
                placeholder="© 2025 Your Company"
                value={copyrightText}
                onChange={(e) => setCopyrightText(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Social Links</Label>
              <Dialog open={socialLinksOpen} onOpenChange={setSocialLinksOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Social Links
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Manage Social Links</DialogTitle>
                    <DialogDescription>
                      Add and configure social media links for the footer
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      {socialLinks.map((link) => {
                        const IconComponent = platformIcons[link.icon] || Settings;
                        return (
                          <div
                            key={link.id}
                            className="flex items-center gap-3 p-3 border rounded-lg"
                          >
                            <div className="flex items-center justify-center w-10 h-10 bg-muted rounded">
                              <IconComponent className="h-5 w-5" />
                            </div>
                            <div className="flex-1 grid grid-cols-2 gap-2">
                              <div>
                                <Label className="text-xs">Platform</Label>
                                <Input
                                  value={link.platform}
                                  onChange={(e) =>
                                    updateSocialLink(link.id, "platform", e.target.value)
                                  }
                                  placeholder="Platform name"
                                  className="h-8 text-sm"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Icon</Label>
                                <Input
                                  value={link.icon}
                                  onChange={(e) =>
                                    updateSocialLink(link.id, "icon", e.target.value)
                                  }
                                  placeholder="Icon name"
                                  className="h-8 text-sm"
                                />
                              </div>
                              <div className="col-span-2">
                                <Label className="text-xs">URL</Label>
                                <Input
                                  value={link.url}
                                  onChange={(e) => updateSocialLink(link.id, "url", e.target.value)}
                                  placeholder="https://example.com/username"
                                  className="h-8 text-sm"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Label (Optional)</Label>
                                <Input
                                  value={link.label || ""}
                                  onChange={(e) =>
                                    updateSocialLink(link.id, "label", e.target.value)
                                  }
                                  placeholder="Display label"
                                  className="h-8 text-sm"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Slug (Optional)</Label>
                                <Input
                                  value={link.slug || ""}
                                  onChange={(e) =>
                                    updateSocialLink(link.id, "slug", e.target.value)
                                  }
                                  placeholder="URL slug"
                                  className="h-8 text-sm"
                                />
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeSocialLink(link.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                    <Button variant="outline" className="w-full" onClick={addNewSocialLink}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Social Link
                    </Button>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setSocialLinksOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setSocialLinksOpen(false)}>Save Changes</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Block: {activeBlock?.type}</DialogTitle>
          </DialogHeader>
          {activeBlock && (
            <div className="space-y-4">
              {activeBlock.type === "logo" && (
                <>
                  <div className="space-y-2">
                    <Label>Image URL</Label>
                    <Input
                      value={(activeBlock.data as LogoBlockData).imageUrl || ""}
                      onChange={(e) => updateBlockData("imageUrl", e.target.value)}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Alt Text</Label>
                    <Input
                      value={(activeBlock.data as LogoBlockData).altText || ""}
                      onChange={(e) => updateBlockData("altText", e.target.value)}
                      placeholder="Company Logo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Optional Text</Label>
                    <Input
                      value={(activeBlock.data as LogoBlockData).text || ""}
                      onChange={(e) => updateBlockData("text", e.target.value)}
                      placeholder="Company name or tagline"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Optional Link</Label>
                    <Input
                      value={(activeBlock.data as LogoBlockData).link || ""}
                      onChange={(e) => updateBlockData("link", e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                </>
              )}

              {activeBlock.type === "menu" && (
                <>
                  <div className="space-y-2">
                    <Label>Menu Title</Label>
                    <Input
                      value={(activeBlock.data as MenuBlockData).title || ""}
                      onChange={(e) => updateBlockData("title", e.target.value)}
                      placeholder="e.g. Quick Links"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Menu Links</Label>
                      <Button size="sm" variant="outline" onClick={addMenuLink}>
                        <Plus className="h-3 w-3 mr-1" />
                        Add Link
                      </Button>
                    </div>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {(activeBlock.data as MenuBlockData).links.map((link) => (
                        <div key={link.id} className="flex gap-2 items-start p-3 border rounded-lg">
                          <div className="flex-1 space-y-2">
                            <Input
                              value={link.label}
                              onChange={(e) => updateMenuLink(link.id, "label", e.target.value)}
                              placeholder="Link Label"
                            />
                            <Input
                              value={link.slug}
                              onChange={(e) => updateMenuLink(link.id, "slug", e.target.value)}
                              placeholder="Slug (e.g. /about)"
                            />
                          </div>
                          <Button size="sm" variant="ghost" onClick={() => deleteMenuLink(link.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeBlock.type === "text" && (
                <>
                  <div className="space-y-2">
                    <Label>Optional Title</Label>
                    <Input
                      value={(activeBlock.data as TextBlockData).title || ""}
                      onChange={(e) => updateBlockData("title", e.target.value)}
                      placeholder="Section title (optional)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Content</Label>
                    <Textarea
                      value={(activeBlock.data as TextBlockData).content || ""}
                      onChange={(e) => updateBlockData("content", e.target.value)}
                      placeholder="Enter your text content here..."
                      rows={5}
                    />
                  </div>
                </>
              )}

              {activeBlock.type === "newsletter" && (
                <>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={(activeBlock.data as NewsletterBlockData).title || ""}
                      onChange={(e) => updateBlockData("title", e.target.value)}
                      placeholder="Subscribe to our newsletter"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={(activeBlock.data as NewsletterBlockData).description || ""}
                      onChange={(e) => updateBlockData("description", e.target.value)}
                      placeholder="Enter newsletter description..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Button Text</Label>
                    <Input
                      value={(activeBlock.data as NewsletterBlockData).buttonText || ""}
                      onChange={(e) => updateBlockData("buttonText", e.target.value)}
                      placeholder="Subscribe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Button Action</Label>
                    <select
                      className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                      value={(activeBlock.data as NewsletterBlockData).buttonAction}
                      onChange={(e) => updateBlockData("buttonAction", e.target.value)}
                    >
                      <option value="subscribe">Subscribe Action</option>
                      <option value="redirect">Redirect to URL</option>
                    </select>
                  </div>
                  {(activeBlock.data as NewsletterBlockData).buttonAction === "redirect" && (
                    <div className="space-y-2">
                      <Label>Redirect URL</Label>
                      <Input
                        value={(activeBlock.data as NewsletterBlockData).redirectUrl || ""}
                        onChange={(e) => updateBlockData("redirectUrl", e.target.value)}
                        placeholder="https://example.com/subscribe"
                      />
                    </div>
                  )}
                </>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={saveEdit}>Save</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
