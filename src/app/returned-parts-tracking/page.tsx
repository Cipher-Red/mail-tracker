import { Header } from "@/components/header";
import ReturnedPartsManager from "@/components/returned-parts-manager";
export default function ReturnedPartsTrackingPage() {
  return <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8" data-unique-id="be2236cf-2207-460e-ad2a-421172034d45" data-file-name="app/returned-parts-tracking/page.tsx">
        <ReturnedPartsManager />
      </main>
    </>;
}