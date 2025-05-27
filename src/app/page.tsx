import EmailTemplateBuilder from "@/components/email-template-builder";
import { Header } from "@/components/header";
export default function HomePage() {
  return <>
      <Header />
      <main className="min-h-screen bg-background p-4 md:p-8" data-unique-id="f8bacd4a-95b3-454e-8ef7-305fea439550" data-file-name="app/page.tsx">
        <EmailTemplateBuilder />
      </main>
    </>;
}