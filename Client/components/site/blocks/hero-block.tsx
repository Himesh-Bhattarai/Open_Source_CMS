import { Button } from "@/components/ui/button"
import Link from "next/link"

interface HeroBlockProps {
  data: {
    title?: string
    subtitle?: string
    buttonText?: string
    buttonLink?: string
    backgroundImage?: string
  }
}

export function HeroBlock({ data }: HeroBlockProps) {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-primary/5 to-background -z-10" />

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-balance text-5xl lg:text-7xl font-bold tracking-tight mb-6">
            {data.title || "Welcome to Our Website"}
          </h1>
          <p className="text-pretty text-xl lg:text-2xl text-muted-foreground mb-8 leading-relaxed">
            {data.subtitle || "Build amazing experiences with our platform"}
          </p>
          {data.buttonText && data.buttonLink && (
            <Button size="lg" asChild className="text-lg px-8 py-6">
              <Link href={data.buttonLink}>{data.buttonText}</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
