import EmailTemplateBuilder from "@/components/email-template-builder";
import { Header } from "@/components/header";
export default function HomePage() {
  return <>
      <Header />
      <main className="min-h-screen bg-background p-4 md:p-8" data-unique-id="90efe5f5-b8a0-497b-a7a2-3d828373e275" data-file-name="app/page.tsx">
        <EmailTemplateBuilder />
      </main>
    </>;
}