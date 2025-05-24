import OrderDataProcessor from "@/components/order-data-processor";
import { Header } from "@/components/header";
export default function OrderProcessorPage() {
  return <>
      <Header />
      <main className="min-h-screen bg-background p-4 md:p-8" data-unique-id="72d2b0a6-8be4-45ba-8710-fa77ccfe0983" data-file-name="app/order-processor/page.tsx">
        <OrderDataProcessor />
      </main>
    </>;
}