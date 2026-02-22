import Image from "next/image";

interface GalleryBlockProps {
  data: {
    title?: string;
    images?: Array<{ url: string; alt: string; caption?: string }>;
    columns?: number;
  };
}

export function GalleryBlock({ data }: GalleryBlockProps) {
  const images = data.images || [];
  const columns = data.columns || 4;

  const gridClass =
    {
      2: "md:grid-cols-2",
      3: "md:grid-cols-3",
      4: "md:grid-cols-4",
    }[columns] || "md:grid-cols-4";

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {data.title && (
          <h2 className="text-balance text-4xl lg:text-5xl font-bold tracking-tight text-center mb-12">
            {data.title}
          </h2>
        )}

        <div className={`grid gap-4 ${gridClass}`}>
          {images.length > 0
            ? images.map((image, index) => (
                <div
                  key={index}
                  className="group relative aspect-square overflow-hidden rounded-lg"
                >
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  {image.caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent p-4">
                      <p className="text-white text-sm">{image.caption}</p>
                    </div>
                  )}
                </div>
              ))
            : // Placeholder images
              Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="aspect-square bg-muted rounded-lg" />
              ))}
        </div>
      </div>
    </section>
  );
}
