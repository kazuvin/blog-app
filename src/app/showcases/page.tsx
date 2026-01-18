import { ShowcasesContainer, showcaseItems } from "@/features/showcases";

export const dynamic = "force-static";

export default function ShowcasesPage() {
  return <ShowcasesContainer items={showcaseItems} />;
}
