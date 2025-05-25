import OrderDataProcessor from "@/components/order-data-processor";
import { Header } from "@/components/header";
export default function OrderProcessorPage() {
  return <>
      <Header />
      <main className="min-h-screen bg-background p-4 md:p-8" data-unique-id="90d3e0b7-b375-4f1c-bdd2-61940b07cb9f" data-file-name="app/order-processor/page.tsx">
        <OrderDataProcessor />
      </main>
    </>;
}