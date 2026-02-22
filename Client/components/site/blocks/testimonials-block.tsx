import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface Testimonial {
  quote: string;
  author: string;
  role?: string;
  company?: string;
  rating?: number;
}

interface TestimonialsBlockProps {
  data: {
    title?: string;
    subtitle?: string;
    testimonials?: Testimonial[];
  };
}

export function TestimonialsBlock({ data }: TestimonialsBlockProps) {
  const testimonials = data.testimonials || [];

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-balance text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            {data.title || "What Our Customers Say"}
          </h2>
          {data.subtitle && (
            <p className="text-pretty text-xl text-muted-foreground">{data.subtitle}</p>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {testimonials.length > 0
            ? testimonials.map((testimonial, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    {testimonial.rating && (
                      <div className="flex gap-1 mb-4">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                        ))}
                      </div>
                    )}
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      "{testimonial.quote}"
                    </p>
                    <div>
                      <p className="font-semibold">{testimonial.author}</p>
                      {testimonial.role && (
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}
                          {testimonial.company && ` at ${testimonial.company}`}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            : // Placeholder testimonials
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4">
                      "Great product! Highly recommend to anyone looking for a solution."
                    </p>
                    <div>
                      <p className="font-semibold">Customer Name</p>
                      <p className="text-sm text-muted-foreground">Role at Company</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>
      </div>
    </section>
  );
}
