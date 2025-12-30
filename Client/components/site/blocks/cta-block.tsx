import { Button } from "@/components/ui/button"
import Link from "next/link"

interface CTABlockProps {
  data: {
    heading?: string
    description?: string
    buttonText?: string
    buttonLink?: string
    variant?: "primary" | "gradient"
  }
}

export function CTABlock({ data }: CTABlockProps) {
  const isGradient = data.variant === "gradient"

  return (
    <section className={`py-20 lg:py-32 ${isGradient ? "bg-gradient-to-br from-primary to-primary/80" : "bg-primary"}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center text-primary-foreground">
          <h2 className="text-balance text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            {data.heading || "Ready to Get Started?"}
          </h2>
          <p className="text-pretty text-xl mb-8 opacity-90 leading-relaxed">
            {data.description || "Join us today and start your journey"}
          </p>
          {data.buttonText && data.buttonLink && (
            <Button size="lg" variant="secondary" asChild className="text-lg px-8 py-6">
              <Link href={data.buttonLink}>{data.buttonText}</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
