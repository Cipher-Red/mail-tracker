import EmailTemplateBuilder from "@/components/email-template-builder";
import { Header } from "@/components/header";
export default function HomePage() {
  return <>
      <Header />
      <main className="min-h-screen bg-background p-4 md:p-8" data-unique-id="e0ce60ea-6272-49d8-9955-d821f5db7ebe" data-file-name="app/page.tsx">
        <EmailTemplateBuilder />
      </main>
    </>;
}