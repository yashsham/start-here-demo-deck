import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/signal-stack/app-shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview · Signal Stack" },
      { name: "description", content: "Explore the Signal Stack company intelligence overview and briefing workspace." },
      { property: "og:title", content: "Overview · Signal Stack" },
      { property: "og:description", content: "A decision-ready company intelligence workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <AppShell page="overview" />,
});
