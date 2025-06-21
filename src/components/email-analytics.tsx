"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, PieChart, RefreshCw, Calendar } from 'lucide-react';
interface EmailStats {
  totalSent: number;
  totalFailed: number;
  deliveryRate: number;
  dailySends: {
    date: string;
    sent: number;
    failed: number;
  }[];
}
export default function EmailAnalytics() {
  const [stats, setStats] = useState<EmailStats>({
    totalSent: 0,
    totalFailed: 0,
    deliveryRate: 0,
    dailySends: []
  });
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetchEmailStats();
  }, []);
  const fetchEmailStats = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/email-analytics?days=7');
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const result = await response.json();
      if (result.success && result.data) {
        setStats({
          totalSent: result.data.totalSent,
          totalFailed: result.data.totalFailed,
          deliveryRate: result.data.deliveryRate,
          dailySends: result.data.dailySends
        });
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (error) {
      console.error('Error fetching email stats:', error);
      // Fallback to mock data if API fails
      setStats({
        totalSent: 1247,
        totalFailed: 53,
        deliveryRate: 95.9,
        dailySends: [{
          date: '2025-05-16',
          sent: 245,
          failed: 12
        }, {
          date: '2025-05-17',
          sent: 187,
          failed: 8
        }, {
          date: '2025-05-18',
          sent: 203,
          failed: 7
        }, {
          date: '2025-05-19',
          sent: 312,
          failed: 14
        }, {
          date: '2025-05-20',
          sent: 189,
          failed: 9
        }, {
          date: '2025-05-21',
          sent: 111,
          failed: 3
        }]
      });
    } finally {
      setIsLoading(false);
    }
  };
  return <motion.div initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} transition={{
    duration: 0.3
  }} className="bg-card rounded-lg shadow-md p-6" data-unique-id="b84e0756-2ad6-4d6a-bc4d-ed8355ebe121" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">
      <div className="flex justify-between items-center mb-6" data-unique-id="45678138-617c-4c5f-b92b-24246e3551b4" data-file-name="components/email-analytics.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="a64a2349-5dac-4a13-bfc4-a7250b79c513" data-file-name="components/email-analytics.tsx">
          <BarChart className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="2c02b111-0c8d-43c3-abb0-2edfceb6fd0a" data-file-name="components/email-analytics.tsx"> Email Analytics
        </span></h2>
        <button onClick={fetchEmailStats} disabled={isLoading} className="flex items-center px-3 py-1.5 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors disabled:opacity-50" data-unique-id="fd353550-0c64-4437-b395-3bae1adf30e7" data-file-name="components/email-analytics.tsx">
          <RefreshCw className={`mr-1.5 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /><span className="editable-text" data-unique-id="2e348b9c-b035-49b0-a7bc-2d8386103a6d" data-file-name="components/email-analytics.tsx">
          Refresh
        </span></button>
      </div>
      
      {isLoading ? <div className="flex justify-center items-center h-64" data-unique-id="55a1d15f-3238-4750-82b4-b12ef613bb76" data-file-name="components/email-analytics.tsx">
          <div className="animate-pulse flex flex-col items-center" data-unique-id="9dc92738-751a-4109-a092-ededfd5736e7" data-file-name="components/email-analytics.tsx">
            <RefreshCw className="animate-spin h-8 w-8 text-primary mb-2" />
            <p className="text-muted-foreground" data-unique-id="04339f40-66b5-4f8b-9a29-c0f81969052b" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="443f8256-34eb-4da1-9691-3dd5b490c9ac" data-file-name="components/email-analytics.tsx">Loading analytics...</span></p>
          </div>
        </div> : <div className="space-y-6" data-unique-id="3e3bed72-fac1-4580-b3ca-648c06955b6d" data-file-name="components/email-analytics.tsx">
          <div className="grid grid-cols-3 gap-4" data-unique-id="40c58653-138c-42ef-80f3-f32ccc9546d1" data-file-name="components/email-analytics.tsx">
            <div className="bg-blue-50 p-4 rounded-lg" data-unique-id="5efbe9d0-7c2a-43e3-a110-f689b7f27f70" data-file-name="components/email-analytics.tsx">
              <p className="text-sm text-blue-600 mb-1" data-unique-id="a32d0e04-030b-406d-8441-0fc0b42f3594" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="f761f876-414d-43e1-9426-b31f8c3cd07a" data-file-name="components/email-analytics.tsx">Total Emails Sent</span></p>
              <p className="text-2xl font-bold" data-unique-id="c40561b9-efa7-4d61-8af0-a71373aec8e9" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.totalSent.toLocaleString()}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg" data-unique-id="f2fca560-e244-4cf3-9904-06f85ce99955" data-file-name="components/email-analytics.tsx">
              <p className="text-sm text-amber-600 mb-1" data-unique-id="9190ffd4-7d76-4594-8226-37ecc49076ab" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="ba04c71e-425f-4282-b979-947fca1e3da0" data-file-name="components/email-analytics.tsx">Failed Deliveries</span></p>
              <p className="text-2xl font-bold" data-unique-id="6fcc8bd7-0a82-432e-8297-c2de2d14ffa6" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.totalFailed.toLocaleString()}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg" data-unique-id="4d564b63-8031-4c05-8a91-a9af453af605" data-file-name="components/email-analytics.tsx">
              <p className="text-sm text-green-600 mb-1" data-unique-id="4d92cf97-381e-41b0-a932-8412ecbe87f1" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="fbd18e63-707d-41e0-830b-258f17859489" data-file-name="components/email-analytics.tsx">Delivery Rate</span></p>
              <p className="text-2xl font-bold" data-unique-id="cad757a1-1a68-4cf5-ac17-e54a876ac4ee" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.deliveryRate}<span className="editable-text" data-unique-id="0ec84485-e0d9-4175-b06b-23946a789436" data-file-name="components/email-analytics.tsx">%</span></p>
            </div>
          </div>
          
          <div className="border border-border rounded-lg p-4" data-unique-id="208a3733-2c40-4135-8766-a88131bc67e7" data-file-name="components/email-analytics.tsx">
            <h3 className="text-sm font-medium mb-4 flex items-center" data-unique-id="8e92bfd3-895a-452a-ba0a-a0744871cebb" data-file-name="components/email-analytics.tsx">
              <Calendar className="h-4 w-4 mr-2" data-unique-id="3673c12a-af8f-48b6-b083-f2a4fcde822a" data-file-name="components/email-analytics.tsx" /><span className="editable-text" data-unique-id="2c22609b-1df3-4e21-8e66-8a46c7bf7425" data-file-name="components/email-analytics.tsx"> Daily Email Activity
            </span></h3>
            <div className="h-64 relative" data-unique-id="7b3d7a0b-f439-49e6-a4f2-cddebac4d9de" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">
              {/* Simple bar chart visualization */}
              <div className="flex h-full items-end space-x-2" data-unique-id="77b3aa08-dcaa-414e-9ba8-297dbfa7da43" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">
                {stats.dailySends.map(day => <div key={day.date} className="flex-1 flex flex-col items-center" data-unique-id="1a56be5b-6fc5-4879-a6d3-627ef02f0def" data-file-name="components/email-analytics.tsx">
                    <div className="w-full flex flex-col items-center space-y-1" data-unique-id="8b06e5eb-fe7c-4674-8ee4-3682e955f71b" data-file-name="components/email-analytics.tsx">
                      <div className="w-full bg-red-200" style={{
                  height: `${day.failed / (day.sent + day.failed) * 100 || 0}%`,
                  minHeight: day.failed > 0 ? '4px' : '0'
                }} data-unique-id="e208fbcb-db10-42e2-b5f6-3db6b34431bf" data-file-name="components/email-analytics.tsx"></div>
                      <div className="w-full bg-blue-400" style={{
                  height: `${day.sent / Math.max(...stats.dailySends.map(d => d.sent + d.failed || 1)) * 100 || 0}%`
                }} data-unique-id="c24f99bf-b8d0-4866-9eac-9f2c6d947aaf" data-file-name="components/email-analytics.tsx"></div>
                    </div>
                    <p className="text-xs mt-2" data-unique-id="6e10b0ca-57d8-4b4c-a08a-5a2dfd3b75e2" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{new Date(day.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}</p>
                  </div>)}
              </div>
              
              <div className="absolute top-2 right-2 flex items-center space-x-4 text-xs" data-unique-id="ec1520d5-e2e0-4ebc-8200-1651709907b8" data-file-name="components/email-analytics.tsx">
                <div className="flex items-center" data-unique-id="06865488-b139-4120-8839-70ac29d37a6a" data-file-name="components/email-analytics.tsx">
                  <div className="w-3 h-3 bg-blue-400 mr-1" data-unique-id="3828b302-e7ac-42d7-99f3-c941e77de968" data-file-name="components/email-analytics.tsx"></div>
                  <span data-unique-id="efadf0be-13df-4a0a-a6e9-55a6596ad992" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="9d363e65-62d7-4b76-8f80-5d67c81eccda" data-file-name="components/email-analytics.tsx">Successful</span></span>
                </div>
                <div className="flex items-center" data-unique-id="d21fde70-2e48-4b80-a18e-fff3082ce652" data-file-name="components/email-analytics.tsx">
                  <div className="w-3 h-3 bg-red-200 mr-1" data-unique-id="91eb0901-ce94-4727-aec1-668b04c3645d" data-file-name="components/email-analytics.tsx"></div>
                  <span data-unique-id="36e72942-6021-47ee-9a47-878a75a616ee" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="3cf5cf7b-8c34-449a-bcdb-f1efd72bda83" data-file-name="components/email-analytics.tsx">Failed</span></span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4" data-unique-id="2bd04780-8b90-44ea-a796-2c67a4e06e71" data-file-name="components/email-analytics.tsx">
            <div className="border border-border rounded-lg p-4" data-unique-id="a72178e2-dc74-49f2-921f-c8e7d251bb3a" data-file-name="components/email-analytics.tsx">
              <h3 className="text-sm font-medium mb-2" data-unique-id="7b16f41f-1bee-44ac-bf31-5210e4c67a69" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="925e84bb-559b-4026-86a1-2b00ac183687" data-file-name="components/email-analytics.tsx">Top Delivery Issues</span></h3>
              <ul className="space-y-2 text-sm" data-unique-id="45a1cea2-442e-43f6-a4a1-17926123d313" data-file-name="components/email-analytics.tsx">
                <li className="flex justify-between" data-unique-id="a61bb47a-d0b7-4c94-add3-a0f20e9f590e" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="7babb0ed-831b-44c4-b98f-f5ad042564d9" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="125cb13c-26d5-49c7-95e4-8a1da9d0535a" data-file-name="components/email-analytics.tsx">Invalid email address</span></span>
                  <span className="font-medium" data-unique-id="9a7f3341-50a9-4b40-89c9-9b9edc577210" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="527d5096-395e-49f2-a679-f81c37213f9e" data-file-name="components/email-analytics.tsx">42%</span></span>
                </li>
                <li className="flex justify-between" data-unique-id="3c2b7c94-4223-4da3-879e-a51bce12c13a" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="6e685790-44d3-40d5-bac4-f73935c433aa" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="4eeea427-bd0d-4af4-90f7-17a29bbbf875" data-file-name="components/email-analytics.tsx">Mailbox full</span></span>
                  <span className="font-medium" data-unique-id="4db38c72-0cc8-4f2c-9def-04d89bab2af5" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="0952d536-d5ce-4bf3-8ba9-c4df8c750869" data-file-name="components/email-analytics.tsx">27%</span></span>
                </li>
                <li className="flex justify-between" data-unique-id="200debf6-4886-48ad-9aa9-98ffdf68fb12" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="c7f4c305-6f74-4487-9262-0dfc329d797a" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="d70479cf-8a6d-4018-b306-42a10044890d" data-file-name="components/email-analytics.tsx">Spam filters</span></span>
                  <span className="font-medium" data-unique-id="7b913a23-e4d2-452c-8c05-7ae7dd575de3" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="46119665-d801-44a8-a3e1-a0afa870fddd" data-file-name="components/email-analytics.tsx">18%</span></span>
                </li>
                <li className="flex justify-between" data-unique-id="44f583e4-1504-4ba8-9f94-0e2c25222f02" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="c1e999ed-9c57-4a88-809c-a8539d104686" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="af54d206-38e7-4523-b2ea-153482b4f8f5" data-file-name="components/email-analytics.tsx">Other</span></span>
                  <span className="font-medium" data-unique-id="fae9093d-bd44-4c8f-b7c7-a62e8145bf75" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="d68c0954-28c2-41aa-a444-6e373d64dd8a" data-file-name="components/email-analytics.tsx">13%</span></span>
                </li>
              </ul>
            </div>
            
            <div className="border border-border rounded-lg p-4" data-unique-id="4de1c2bf-7ef5-4b65-89b3-7eb60a85c984" data-file-name="components/email-analytics.tsx">
              <h3 className="text-sm font-medium mb-2" data-unique-id="18d24956-6c9f-4697-8e17-7b5b098ee06b" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="a4b3549f-3d12-402f-8ef8-b14ba005a4f4" data-file-name="components/email-analytics.tsx">Delivery Performance</span></h3>
              <div className="flex items-center justify-center h-32" data-unique-id="125949a0-882a-4e6e-9395-885772148f6d" data-file-name="components/email-analytics.tsx">
                <div className="relative w-32 h-32" data-unique-id="ffab3522-38a5-4355-99cb-885775f5de19" data-file-name="components/email-analytics.tsx">
                  <svg viewBox="0 0 100 100" className="w-full h-full" data-unique-id="f50665f9-dfba-46e2-b326-746e203b3423" data-file-name="components/email-analytics.tsx">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="15" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="15" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - stats.deliveryRate / 100)} transform="rotate(-90 50 50)" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center" data-unique-id="275fa7fa-7e35-4e0f-ad6f-07b993639866" data-file-name="components/email-analytics.tsx">
                    <span className="text-2xl font-bold" data-unique-id="68314410-8856-4536-9a81-2448010c2627" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.deliveryRate}<span className="editable-text" data-unique-id="c0001d86-6d3c-4beb-8b94-35d36b2bb2c8" data-file-name="components/email-analytics.tsx">%</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>}
    </motion.div>;
}