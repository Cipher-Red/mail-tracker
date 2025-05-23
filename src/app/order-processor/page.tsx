import OrderDataProcessor from "@/components/order-data-processor";
import { Header } from "@/components/header";
export default function OrderProcessorPage() {
  return <>
      <Header />
      <main className="min-h-screen bg-background p-4 md:p-8" data-unique-id="a8d114fc-10e3-4d47-97dd-0a764e00ad23" data-file-name="app/order-processor/page.tsx">
        <OrderDataProcessor />
      </main>
    </>;
}