import EmailTemplateBuilder from "@/components/email-template-builder";
import { Header } from "@/components/header";
export default function HomePage() {
  return <>
      <Header />
      <main className="min-h-screen bg-background p-4 md:p-8" data-unique-id="08c3a803-6d13-45f6-a9dd-cb7b024941c5" data-file-name="app/page.tsx">
        <EmailTemplateBuilder />
      </main>
    </>;
}