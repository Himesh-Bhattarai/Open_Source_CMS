import { Layout, Zap, Smartphone, Shield, Users, TrendingUp } from "lucide-react";

const iconMap = {
  layout: Layout,
  zap: Zap,
  smartphone: Smartphone,
  shield: Shield,
  users: Users,
  trending: TrendingUp,
};

interface Feature {
  title: string;
  description: string;
  icon?: keyof typeof iconMap;
}

interface FeaturesBlockProps {
  data: {
    title?: string;
    subtitle?: string;
    features?: Feature[];
  };
}

export function FeaturesBlock({ data }: FeaturesBlockProps) {
  const features = data.features || [];

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-balance text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            {data.title || "Features"}
          </h2>
          {data.subtitle && (
            <p className="text-pretty text-xl text-muted-foreground">{data.subtitle}</p>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon ? iconMap[feature.icon] : Layout;
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 text-primary mb-4">
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
