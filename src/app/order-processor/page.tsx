import OrderDataProcessor from "@/components/order-data-processor";
import { Header } from "@/components/header";
export default function OrderProcessorPage() {
  return <>
      <Header />
      <main className="min-h-screen bg-background p-4 md:p-8" data-unique-id="9d5f61da-2d95-40ee-a900-fd11d7f80aa5" data-file-name="app/order-processor/page.tsx">
        <OrderDataProcessor />
      </main>
    </>;
}