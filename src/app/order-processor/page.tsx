import OrderDataProcessor from "@/components/order-data-processor";
import { Header } from "@/components/header";
export default function OrderProcessorPage() {
  return <>
      <Header />
      <main className="min-h-screen bg-background p-4 md:p-8" data-unique-id="4ddd5b86-12d6-4fde-ac12-4df5f37435bc" data-file-name="app/order-processor/page.tsx">
        <OrderDataProcessor />
      </main>
    </>;
}