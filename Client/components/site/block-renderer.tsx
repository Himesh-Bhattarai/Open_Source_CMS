import { HeroBlock } from "./blocks/hero-block";
import { TextBlock } from "./blocks/text-block";
import { FeaturesBlock } from "./blocks/features-block";
import { GalleryBlock } from "./blocks/gallery-block";
import { CTABlock } from "./blocks/cta-block";
import { TestimonialsBlock } from "./blocks/testimonials-block";
import { TeamBlock } from "./blocks/team-block";
import { ContactBlock } from "./blocks/contact-block";

interface Block {
  id: string;
  type: string;
  data: any;
}

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
