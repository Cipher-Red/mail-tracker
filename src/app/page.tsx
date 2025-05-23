import EmailTemplateBuilder from "@/components/email-template-builder";
import { Header } from "@/components/header";
import { GuidanceButton } from "@/components/guidance-button";
export default function HomePage() {
  return <>
      <Header />
      <main className="min-h-screen bg-background p-4 md:p-8" data-unique-id="35d2389f-432a-4ae5-9fb5-9db98af4771a" data-file-name="app/page.tsx">
        <EmailTemplateBuilder />
        <GuidanceButton />
      </main>
    </>;
}