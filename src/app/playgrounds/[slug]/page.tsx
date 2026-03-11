import { notFound } from "next/navigation";
import { playgroundItems } from "@/features/playgrounds";

export const dynamic = "force-static";

export function generateStaticParams() {
  return playgroundItems.map((item) => ({
    slug: item.slug,
  }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const item = playgroundItems.find((i) => i.slug === slug);
  if (!item) return {};
  return { title: item.name };
}

export default async function PlaygroundPage({ params }: Props) {
  const { slug } = await params;
  const item = playgroundItems.find((i) => i.slug === slug);

  if (!item) {
    notFound();
  }

  const PlaygroundComponent = item.component;

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2 font-bold text-3xl text-foreground">{item.name}</h1>
        <p className="text-foreground/70">{item.description}</p>
      </div>
      <div className="rounded-xl border border-border p-6">
        {PlaygroundComponent ? (
          <PlaygroundComponent />
        ) : (
          <p className="text-foreground/60">
            Playground content for &ldquo;{item.name}&rdquo; goes here.
          </p>
        )}
      </div>
    </div>
  );
}
