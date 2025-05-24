import EmailTemplateBuilder from "@/components/email-template-builder";
import { Header } from "@/components/header";
export default function HomePage() {
  return <>
      <Header />
      <main className="min-h-screen bg-background p-4 md:p-8" data-unique-id="afc1ac66-3341-49c7-8777-24f3acdfc489" data-file-name="app/page.tsx">
        <EmailTemplateBuilder />
      </main>
    </>;
}