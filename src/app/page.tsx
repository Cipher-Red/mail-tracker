import EmailTemplateBuilder from "@/components/email-template-builder";
import { Header } from "@/components/header";
export default function HomePage() {
  return <>
      <Header />
      <main className="min-h-screen bg-background p-4 md:p-8" data-unique-id="797681a8-60c1-40a3-8084-2a77541cf567" data-file-name="app/page.tsx">
        <EmailTemplateBuilder />
      </main>
    </>;
}