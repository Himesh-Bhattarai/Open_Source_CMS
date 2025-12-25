import { Card, CardContent } from "@/components/ui/card"

interface TeamMember {
  name: string
  role: string
  bio?: string
  image?: string
}

interface TeamBlockProps {
  data: {
    title?: string
    subtitle?: string
    members?: TeamMember[]
  }
}

export function TeamBlock({ data }: TeamBlockProps) {
  const members = data.members || []

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-balance text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            {data.title || "Meet Our Team"}
          </h2>
          {data.subtitle && <p className="text-pretty text-xl text-muted-foreground">{data.subtitle}</p>}
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {members.length > 0
            ? members.map((member, index) => (
                <Card key={index}>
                  <CardContent className="p-6 text-center">
                    <div className="h-32 w-32 rounded-full bg-muted mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                    <p className="text-sm text-primary mb-2">{member.role}</p>
                    {member.bio && <p className="text-sm text-muted-foreground">{member.bio}</p>}
                  </CardContent>
                </Card>
              ))
            : // Placeholder team members
              Array.from({ length: 4 }).map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-6 text-center">
                    <div className="h-32 w-32 rounded-full bg-muted mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-1">Team Member</h3>
                    <p className="text-sm text-primary mb-2">Position</p>
                    <p className="text-sm text-muted-foreground">Brief bio about the team member</p>
                  </CardContent>
                </Card>
              ))}
        </div>
      </div>
    </section>
  )
}
