import EmailTemplateBuilder from "@/components/email-template-builder";
import { Header } from "@/components/header";
export default function HomePage() {
  return <>
      <Header />
      <main className="min-h-screen bg-background p-4 md:p-8" data-unique-id="8b75513b-1558-4500-b15f-e586bc3d4c4c" data-file-name="app/page.tsx">
        <EmailTemplateBuilder />
      </main>
    </>;
}