interface TextBlockProps {
  data: {
    heading?: string
    content?: string
    alignment?: "left" | "center" | "right"
  }
}

export function TextBlock({ data }: TextBlockProps) {
  const alignmentClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[data.alignment || "left"]

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className={`max-w-4xl mx-auto ${alignmentClass}`}>
          {data.heading && (
            <h2 className="text-balance text-4xl lg:text-5xl font-bold tracking-tight mb-6">{data.heading}</h2>
          )}
          {data.content && (
            <div className="text-pretty text-lg text-muted-foreground leading-relaxed prose prose-lg max-w-none">
              <p>{data.content}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
