import { Header } from "@/components/header";
import ReturnedPartsManager from "@/components/returned-parts-manager";
export default function ReturnedPartsTrackingPage() {
  return <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8" data-unique-id="3be28515-719b-4afb-90bb-beef60629d2a" data-file-name="app/returned-parts-tracking/page.tsx">
        <ReturnedPartsManager />
      </main>
    </>;
}