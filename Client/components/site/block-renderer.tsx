import { HeroBlock } from "./blocks/hero-block";
import { TextBlock } from "./blocks/text-block";
import { FeaturesBlock } from "./blocks/features-block";
import { GalleryBlock } from "./blocks/gallery-block";
import { CTABlock } from "./blocks/cta-block";
import { TestimonialsBlock } from "./blocks/testimonials-block";
import { TeamBlock } from "./blocks/team-block";
import { ContactBlock } from "./blocks/contact-block";

type HeroBlockData = Parameters<typeof HeroBlock>[0]["data"];
type TextBlockData = Parameters<typeof TextBlock>[0]["data"];
type FeaturesBlockData = Parameters<typeof FeaturesBlock>[0]["data"];
type GalleryBlockData = Parameters<typeof GalleryBlock>[0]["data"];
type CtaBlockData = Parameters<typeof CTABlock>[0]["data"];
type TestimonialsBlockData = Parameters<typeof TestimonialsBlock>[0]["data"];
type TeamBlockData = Parameters<typeof TeamBlock>[0]["data"];
type ContactBlockData = Parameters<typeof ContactBlock>[0]["data"];

type Block =
  | { id: string; type: "hero"; data: HeroBlockData }
  | { id: string; type: "text"; data: TextBlockData }
  | { id: string; type: "features"; data: FeaturesBlockData }
  | { id: string; type: "gallery"; data: GalleryBlockData }
  | { id: string; type: "cta"; data: CtaBlockData }
  | { id: string; type: "testimonials"; data: TestimonialsBlockData }
  | { id: string; type: "team"; data: TeamBlockData }
  | { id: string; type: "contact"; data: ContactBlockData }
  | {
      id: string;
      type: string;
      data: Record<string, unknown>;
    };

interface BlockRendererProps {
  blocks: Block[];
}

export function BlockRenderer({ blocks }: BlockRendererProps) {
  return (
    <div className="w-full">
      {blocks.map((block) => {
        switch (block.type) {
          case "hero":
            return <HeroBlock key={block.id} data={block.data} />;
          case "text":
            return <TextBlock key={block.id} data={block.data} />;
          case "features":
            return <FeaturesBlock key={block.id} data={block.data} />;
          case "gallery":
            return <GalleryBlock key={block.id} data={block.data} />;
          case "cta":
            return <CTABlock key={block.id} data={block.data} />;
          case "testimonials":
            return <TestimonialsBlock key={block.id} data={block.data} />;
          case "team":
            return <TeamBlock key={block.id} data={block.data} />;
          case "contact":
            return <ContactBlock key={block.id} data={block.data} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
