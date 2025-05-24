import EmailTemplateBuilder from "@/components/email-template-builder";
import { Header } from "@/components/header";
export default function HomePage() {
  return <>
      <Header />
      <main className="min-h-screen bg-background p-4 md:p-8" data-unique-id="9674e669-912e-4dcb-932c-99162758486a" data-file-name="app/page.tsx">
        <EmailTemplateBuilder />
      </main>
    </>;
}