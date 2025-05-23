import EmailTemplateBuilder from "@/components/email-template-builder";
import { Header } from "@/components/header";
export default function HomePage() {
  return <>
      <Header />
      <main className="min-h-screen bg-background p-4 md:p-8" data-unique-id="3aa17517-93d0-477b-adef-eb74a5613bc3" data-file-name="app/page.tsx">
        <EmailTemplateBuilder />
      </main>
    </>;
}