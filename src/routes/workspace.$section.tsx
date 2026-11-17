import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/signal-stack/app-shell";
import { sectionTitles, type Section } from "@/components/signal-stack/data";

export const Route = createFileRoute("/workspace/$section")({
  head: ({ params }) => {
    const section = params.section in sectionTitles ? (params.section as Section) : "overview";
    const title = sectionTitles[section].title;
    return {
      meta: [
        { title: `${title} · Signal Stack` },
        { name: "description", content: sectionTitles[section].description },
        { property: "og:title", content: `${title} · Signal Stack` },
        { property: "og:description", content: sectionTitles[section].description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: WorkspaceRoute,
});

function WorkspaceRoute() {
  const { section } = Route.useParams();
  const page: Section = section in sectionTitles ? (section as Section) : "overview";
  return <AppShell page={page} />;
}