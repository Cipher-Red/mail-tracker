import EmailTemplateBuilder from "@/components/email-template-builder";
import { Header } from "@/components/header";
export default function HomePage() {
  return <>
      <Header />
      <main className="min-h-screen bg-background p-4 md:p-8" data-unique-id="920edd8b-d910-457b-9daa-0c2db09a1498" data-file-name="app/page.tsx">
        <EmailTemplateBuilder />
      </main>
    </>;
}