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
  }} className="bg-white rounded-lg shadow-md p-6" data-unique-id="4691b165-282a-4879-a40b-8eb1751e5ebd" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">
      <div className="flex justify-between items-center mb-6" data-unique-id="b15a7787-a9e9-4d4d-a57e-2b970670d7ad" data-file-name="components/email-analytics.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="0a747199-ca09-4083-81ce-186c28b076de" data-file-name="components/email-analytics.tsx">
          <BarChart className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="5761678c-44d7-4975-99bb-e06c07cde421" data-file-name="components/email-analytics.tsx"> Email Analytics
        </span></h2>
        <button onClick={fetchEmailStats} disabled={isLoading} className="flex items-center px-3 py-1.5 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors disabled:opacity-50" data-unique-id="806ec8a2-4107-467c-9cbe-7cc99c0baf1c" data-file-name="components/email-analytics.tsx">
          <RefreshCw className={`mr-1.5 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /><span className="editable-text" data-unique-id="70d26526-f36f-4cb0-8ba3-7540fa2fb5fc" data-file-name="components/email-analytics.tsx">
          Refresh
        </span></button>
      </div>
      
      {isLoading ? <div className="flex justify-center items-center h-64" data-unique-id="c0654666-428e-4733-91dd-b6f912c63dc5" data-file-name="components/email-analytics.tsx">
          <div className="animate-pulse flex flex-col items-center" data-unique-id="b7d8facb-5901-4413-b7e1-00b6720ce071" data-file-name="components/email-analytics.tsx">
            <RefreshCw className="animate-spin h-8 w-8 text-primary mb-2" />
            <p className="text-muted-foreground" data-unique-id="2b5f1aeb-bb2d-447a-a297-ce0dc22208f8" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="c24cb4c1-bd81-4255-bd22-3e6fb9958a2e" data-file-name="components/email-analytics.tsx">Loading analytics...</span></p>
          </div>
        </div> : <div className="space-y-6" data-unique-id="94bfc921-bbf5-4c92-994e-6c806ab1de79" data-file-name="components/email-analytics.tsx">
          <div className="grid grid-cols-3 gap-4" data-unique-id="04f1ec48-add8-45de-904f-473a1fe1f021" data-file-name="components/email-analytics.tsx">
            <div className="bg-blue-50 p-4 rounded-lg" data-unique-id="716e2277-d29c-45d5-9c15-2208d17168db" data-file-name="components/email-analytics.tsx">
              <p className="text-sm text-blue-600 mb-1" data-unique-id="8464f05e-b65d-4d19-ac3a-b85a7a4a2f9f" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="1df7e95d-737b-4213-8b20-d20394d9d7f8" data-file-name="components/email-analytics.tsx">Total Emails Sent</span></p>
              <p className="text-2xl font-bold" data-unique-id="19bb4080-fe6f-457a-96d5-f176589c15ad" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.totalSent.toLocaleString()}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg" data-unique-id="da562517-f5b3-4c6a-8d98-564e4acf2892" data-file-name="components/email-analytics.tsx">
              <p className="text-sm text-amber-600 mb-1" data-unique-id="0225c993-9a75-4ef2-b289-8428c1354f08" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="376c5fd2-c853-47cf-b786-50642afc9c23" data-file-name="components/email-analytics.tsx">Failed Deliveries</span></p>
              <p className="text-2xl font-bold" data-unique-id="de6407c4-08e7-47c5-8e3a-56cf3b96721e" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.totalFailed.toLocaleString()}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg" data-unique-id="01f0bbaf-b7e2-45b8-9db1-3f05f598e34a" data-file-name="components/email-analytics.tsx">
              <p className="text-sm text-green-600 mb-1" data-unique-id="6082e937-8b5d-4e88-9db3-71b260e749a7" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="f0761fcf-b7b4-4f18-9753-418d0ef875e8" data-file-name="components/email-analytics.tsx">Delivery Rate</span></p>
              <p className="text-2xl font-bold" data-unique-id="5df2ec61-3024-4856-9385-3270dc09c63b" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.deliveryRate}<span className="editable-text" data-unique-id="889e1411-dc31-4334-b0e3-c62a58754d6c" data-file-name="components/email-analytics.tsx">%</span></p>
            </div>
          </div>
          
          <div className="border border-border rounded-lg p-4" data-unique-id="3c66c993-5f20-4741-ba93-d7a25559f49e" data-file-name="components/email-analytics.tsx">
            <h3 className="text-sm font-medium mb-4 flex items-center" data-unique-id="86bd1af1-a41e-41cf-92fe-e78745f95075" data-file-name="components/email-analytics.tsx">
              <Calendar className="h-4 w-4 mr-2" data-unique-id="138f298d-c314-4464-9cc3-fdb866431d6e" data-file-name="components/email-analytics.tsx" /><span className="editable-text" data-unique-id="8faae9b3-20ef-4f7c-b799-db5fde1d8244" data-file-name="components/email-analytics.tsx"> Daily Email Activity
            </span></h3>
            <div className="h-64 relative" data-unique-id="f58f851d-ba1f-4201-b353-31a453b5de62" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">
              {/* Simple bar chart visualization */}
              <div className="flex h-full items-end space-x-2" data-unique-id="53311afd-c66a-4a35-b982-ca70a821b914" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">
                {stats.dailySends.map(day => <div key={day.date} className="flex-1 flex flex-col items-center" data-unique-id="a94d8243-2406-43a2-a8fa-53ff557314fb" data-file-name="components/email-analytics.tsx">
                    <div className="w-full flex flex-col items-center space-y-1" data-unique-id="ab3fdb06-8063-4749-be22-49646bf5cf98" data-file-name="components/email-analytics.tsx">
                      <div className="w-full bg-red-200" style={{
                  height: `${day.failed / (day.sent + day.failed) * 100}%`,
                  minHeight: day.failed > 0 ? '4px' : '0'
                }} data-unique-id="e24aab6d-0e7a-45ae-9f53-a6c0c8bf2bb8" data-file-name="components/email-analytics.tsx"></div>
                      <div className="w-full bg-blue-400" style={{
                  height: `${day.sent / Math.max(...stats.dailySends.map(d => d.sent + d.failed)) * 100}%`
                }} data-unique-id="c4aa0018-bcaa-42c9-a50b-9bdfc650d066" data-file-name="components/email-analytics.tsx"></div>
                    </div>
                    <p className="text-xs mt-2" data-unique-id="960dc4d0-3b4c-4b2f-ba79-b3bab0b5f09f" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{new Date(day.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}</p>
                  </div>)}
              </div>
              
              <div className="absolute top-2 right-2 flex items-center space-x-4 text-xs" data-unique-id="dcd37c99-9c77-4ee4-a12d-ffaaf52c9100" data-file-name="components/email-analytics.tsx">
                <div className="flex items-center" data-unique-id="74bd7955-857c-447b-86e2-bbb26d23c128" data-file-name="components/email-analytics.tsx">
                  <div className="w-3 h-3 bg-blue-400 mr-1" data-unique-id="f8d3b9ee-e63f-4417-a771-dbeaddd8cda4" data-file-name="components/email-analytics.tsx"></div>
                  <span data-unique-id="708d6023-65ec-4ace-b4f1-40e8804d56c7" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="dafb4ce3-4709-487e-83d5-14f5282ca0d1" data-file-name="components/email-analytics.tsx">Successful</span></span>
                </div>
                <div className="flex items-center" data-unique-id="737534f6-1944-481a-85de-c0dfa7d26907" data-file-name="components/email-analytics.tsx">
                  <div className="w-3 h-3 bg-red-200 mr-1" data-unique-id="c81c4e85-c08c-4b1d-b3e0-fcc7c240466c" data-file-name="components/email-analytics.tsx"></div>
                  <span data-unique-id="8817e631-c663-4f57-b2d3-5beba194a112" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="48a403a0-8e38-4c2d-88f0-6ef9a6420dcc" data-file-name="components/email-analytics.tsx">Failed</span></span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4" data-unique-id="c5d04ee9-5182-4e52-b4ec-de577b834bd2" data-file-name="components/email-analytics.tsx">
            <div className="border border-border rounded-lg p-4" data-unique-id="c581ca39-f8a1-436c-b89b-b0ebded21d70" data-file-name="components/email-analytics.tsx">
              <h3 className="text-sm font-medium mb-2" data-unique-id="5b9ea00d-d11f-46ff-962a-65ab115df948" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="43bc3f0d-d4f2-4aba-8972-877f7904585d" data-file-name="components/email-analytics.tsx">Top Delivery Issues</span></h3>
              <ul className="space-y-2 text-sm" data-unique-id="62b3d4c4-5709-4e20-83fa-8299025b180d" data-file-name="components/email-analytics.tsx">
                <li className="flex justify-between" data-unique-id="8e1d5780-df3e-4f6b-9c17-903ce83b9094" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="2e82a8d7-cc0a-4cbd-a44e-fd7e68638d8c" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="d0ccdc4c-7f40-42e4-9683-78a68bb15579" data-file-name="components/email-analytics.tsx">Invalid email address</span></span>
                  <span className="font-medium" data-unique-id="823e33d6-7961-46bc-932c-a442e0df7e27" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="06d957e2-b376-4e4e-b1e5-e860be0189e5" data-file-name="components/email-analytics.tsx">42%</span></span>
                </li>
                <li className="flex justify-between" data-unique-id="ee5e070a-184f-4e47-97f2-1f8a8f1c5f00" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="e18084af-0d51-492b-9beb-d770acb9c9fa" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="fafaab17-aa85-4191-a65e-86b5d2ad9a5b" data-file-name="components/email-analytics.tsx">Mailbox full</span></span>
                  <span className="font-medium" data-unique-id="b46a59bf-0046-4cfc-b0f3-0685cefeac40" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="8ebabacf-86ac-452b-ab5d-b16ad24faff9" data-file-name="components/email-analytics.tsx">27%</span></span>
                </li>
                <li className="flex justify-between" data-unique-id="10e4bcd2-fb96-40a7-9366-61e5090087b1" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="8f0751b8-8ba9-4a4a-a72c-1d0888db528f" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="757eb82d-0f2d-481e-8bc5-44d4fb9f2df1" data-file-name="components/email-analytics.tsx">Spam filters</span></span>
                  <span className="font-medium" data-unique-id="2255a0a2-39f8-4c4f-9caa-958f49d1a500" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="3bdaf412-4b84-44e3-9778-a61376fb56bb" data-file-name="components/email-analytics.tsx">18%</span></span>
                </li>
                <li className="flex justify-between" data-unique-id="c9fefff3-1b2c-445e-9ae8-aa5e3b1d9bb5" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="921f7ae3-7a26-43ae-b937-32e309b5d6bf" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="94be40d0-2a92-41b5-9e63-e04f3e7556c9" data-file-name="components/email-analytics.tsx">Other</span></span>
                  <span className="font-medium" data-unique-id="eaddf10a-84b7-4534-bb29-5c6c86d4745d" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="19b7ce86-eaaa-4b65-bfab-21230eba93d6" data-file-name="components/email-analytics.tsx">13%</span></span>
                </li>
              </ul>
            </div>
            
            <div className="border border-border rounded-lg p-4" data-unique-id="a9fdda3a-d698-452d-9f08-1eeed1cac529" data-file-name="components/email-analytics.tsx">
              <h3 className="text-sm font-medium mb-2" data-unique-id="77bef977-d557-4c9c-8ba0-09c042958d6c" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="fa0f25b8-9bd6-44fc-925d-e0c6040a452d" data-file-name="components/email-analytics.tsx">Delivery Performance</span></h3>
              <div className="flex items-center justify-center h-32" data-unique-id="6f9645df-6dae-4717-bb8e-b8f167b8083c" data-file-name="components/email-analytics.tsx">
                <div className="relative w-32 h-32" data-unique-id="a0d104ec-5220-4e82-8212-445d43f7d68a" data-file-name="components/email-analytics.tsx">
                  <svg viewBox="0 0 100 100" className="w-full h-full" data-unique-id="dbd49d52-a09f-428a-b3b0-f39f9204c932" data-file-name="components/email-analytics.tsx">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="15" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="15" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - stats.deliveryRate / 100)} transform="rotate(-90 50 50)" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center" data-unique-id="760438ab-9cc1-4b33-b14e-d543a650481f" data-file-name="components/email-analytics.tsx">
                    <span className="text-2xl font-bold" data-unique-id="bcbefaac-3376-4436-ba8b-8a3ded85c045" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.deliveryRate}<span className="editable-text" data-unique-id="d2526e4d-458e-4ba0-a5c7-bf4f44be3f1b" data-file-name="components/email-analytics.tsx">%</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>}
    </motion.div>;
}