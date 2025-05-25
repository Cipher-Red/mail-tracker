import EmailTemplateBuilder from "@/components/email-template-builder";
import { Header } from "@/components/header";
export default function HomePage() {
  return <>
      <Header />
      <main className="min-h-screen bg-background p-4 md:p-8" data-unique-id="d6bdb9f5-c100-4137-984b-048106a93875" data-file-name="app/page.tsx">
        <EmailTemplateBuilder />
      </main>
    </>;
}