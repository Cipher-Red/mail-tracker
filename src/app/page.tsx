import EmailTemplateBuilder from "@/components/email-template-builder";
import { Header } from "@/components/header";
export default function HomePage() {
  return <>
      <Header />
      <main className="min-h-screen bg-background p-4 md:p-8" data-unique-id="b8ac0ff8-8621-4cd6-b457-4ddc2393d2b2" data-file-name="app/page.tsx">
        <EmailTemplateBuilder />
      </main>
    </>;
}