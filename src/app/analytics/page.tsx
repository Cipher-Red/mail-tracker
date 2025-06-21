import AnalyticsDashboard from '@/components/analytics-dashboard';
import { Header } from '@/components/header';
export default function AnalyticsPage() {
  return <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8" data-unique-id="2a36bfe5-0aae-4040-be92-6014ccc113f6" data-file-name="app/analytics/page.tsx">
        <div className="container mx-auto" data-unique-id="d9a410ac-b68e-42dc-9fe4-ab0f2b5d9808" data-file-name="app/analytics/page.tsx">
          <AnalyticsDashboard />
        </div>
      </main>
    </>;
}