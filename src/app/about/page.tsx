import { Badge, Button, Card, CardContent, CardHeader } from "@/components";

export const metadata = {
  title: "About",
  description: "About me and my interests",
};

export default function AboutPage() {
  return (
    <>
      <h1 className="mb-8 font-bold text-3xl">About Me</h1>

      <div className="space-y-6">
        {/* Bio Section */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-xl">Introduction</h2>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/80">
              Welcome to my blog! I&apos;m a passionate developer who loves building web
              applications and sharing knowledge with the community. This is a placeholder bio that
              can be customized with your personal story, background, and what drives your work.
            </p>
          </CardContent>
        </Card>

        {/* Skills/Interests Section */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-xl">Skills &amp; Interests</h2>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="info">Next.js</Badge>
              <Badge variant="info">TypeScript</Badge>
              <Badge variant="info">React</Badge>
              <Badge variant="success">Web Development</Badge>
              <Badge variant="success">UI/UX Design</Badge>
              <Badge variant="default">Cloud Computing</Badge>
              <Badge variant="default">Performance Optimization</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-xl">Get in Touch</h2>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-foreground/80">
              Feel free to reach out if you&apos;d like to connect or collaborate on projects.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" size="md" disabled>
                Email
              </Button>
              <Button variant="secondary" size="md" disabled>
                GitHub
              </Button>
              <Button variant="secondary" size="md" disabled>
                Twitter
              </Button>
              <Button variant="ghost" size="md" disabled>
                LinkedIn
              </Button>
            </div>
            <p className="mt-3 text-foreground/60 text-sm">(Contact links will be added soon)</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
