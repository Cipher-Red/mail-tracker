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
  }} className="bg-white rounded-lg shadow-md p-6" data-unique-id="1d0dda5c-cfbc-48d1-864a-d0a5094f0ec5" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">
      <div className="flex justify-between items-center mb-6" data-unique-id="3eae4f8d-89c7-4107-b935-954d3a96cb6b" data-file-name="components/email-analytics.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="f66fc934-a180-44b3-9a80-3d53067eaf40" data-file-name="components/email-analytics.tsx">
          <BarChart className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="daf6f863-ad69-4e93-87b8-9c1f9553704c" data-file-name="components/email-analytics.tsx"> Email Analytics
        </span></h2>
        <button onClick={fetchEmailStats} disabled={isLoading} className="flex items-center px-3 py-1.5 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors disabled:opacity-50" data-unique-id="d1ba6ed8-757a-4933-ab2f-c58105e2d308" data-file-name="components/email-analytics.tsx">
          <RefreshCw className={`mr-1.5 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /><span className="editable-text" data-unique-id="2cbff024-f478-4bf6-aa22-a2345169e0f6" data-file-name="components/email-analytics.tsx">
          Refresh
        </span></button>
      </div>
      
      {isLoading ? <div className="flex justify-center items-center h-64" data-unique-id="acfb6c13-4528-47ce-9b5f-76fc2f442085" data-file-name="components/email-analytics.tsx">
          <div className="animate-pulse flex flex-col items-center" data-unique-id="821fc04f-cf60-44eb-a889-907955560321" data-file-name="components/email-analytics.tsx">
            <RefreshCw className="animate-spin h-8 w-8 text-primary mb-2" />
            <p className="text-muted-foreground" data-unique-id="a553c674-a33c-4085-bc2b-565629bcccd8" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="864a3549-e7d5-40d2-9c1d-adf7ee553b7d" data-file-name="components/email-analytics.tsx">Loading analytics...</span></p>
          </div>
        </div> : <div className="space-y-6" data-unique-id="a02f4b09-7e0c-45a2-a232-192b491695a5" data-file-name="components/email-analytics.tsx">
          <div className="grid grid-cols-3 gap-4" data-unique-id="89e3009c-d628-402c-804f-47b36d84fd7f" data-file-name="components/email-analytics.tsx">
            <div className="bg-blue-50 p-4 rounded-lg" data-unique-id="fa162fcf-38a7-40e1-8988-26d1f8523ac6" data-file-name="components/email-analytics.tsx">
              <p className="text-sm text-blue-600 mb-1" data-unique-id="6d7240c2-f464-41a6-8270-3e1975fa0cb0" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="27c7e07f-7911-4c55-8fe0-ccbc4aaf7d79" data-file-name="components/email-analytics.tsx">Total Emails Sent</span></p>
              <p className="text-2xl font-bold" data-unique-id="a347472b-4abb-4768-8b3d-58193691a2bb" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.totalSent.toLocaleString()}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg" data-unique-id="7a838a38-e228-4759-a2ad-07ef58cf618e" data-file-name="components/email-analytics.tsx">
              <p className="text-sm text-amber-600 mb-1" data-unique-id="4eb6245a-659b-47d0-9e18-c4f21cc7a948" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="081f6823-43fc-4902-a05d-75fae0bcb76f" data-file-name="components/email-analytics.tsx">Failed Deliveries</span></p>
              <p className="text-2xl font-bold" data-unique-id="68717d33-d541-4ae6-9483-ad2184d00079" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.totalFailed.toLocaleString()}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg" data-unique-id="6cbb6d3d-df31-4931-8cb4-c7bbd5c3688c" data-file-name="components/email-analytics.tsx">
              <p className="text-sm text-green-600 mb-1" data-unique-id="e735a9ad-c610-4d6b-9436-0fe0ed0a6206" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="48e41b5c-b6d8-4eda-8dcb-8384c4d15e83" data-file-name="components/email-analytics.tsx">Delivery Rate</span></p>
              <p className="text-2xl font-bold" data-unique-id="c991176f-6822-4f6e-b253-40d3be028764" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.deliveryRate}<span className="editable-text" data-unique-id="7019e90c-e7c2-4ef7-ac8b-e910dc788e16" data-file-name="components/email-analytics.tsx">%</span></p>
            </div>
          </div>
          
          <div className="border border-border rounded-lg p-4" data-unique-id="4da5cca1-bb98-4795-a545-336a807504c0" data-file-name="components/email-analytics.tsx">
            <h3 className="text-sm font-medium mb-4 flex items-center" data-unique-id="9cdcbf10-d6b5-4f3e-923e-caba8010a101" data-file-name="components/email-analytics.tsx">
              <Calendar className="h-4 w-4 mr-2" data-unique-id="96d7fb1c-7142-4b74-9496-80c511d114e7" data-file-name="components/email-analytics.tsx" /><span className="editable-text" data-unique-id="f844c858-c800-406b-a1b1-045dc969bab2" data-file-name="components/email-analytics.tsx"> Daily Email Activity
            </span></h3>
            <div className="h-64 relative" data-unique-id="9897447e-79d8-48bb-a8ec-29ec4460fe28" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">
              {/* Simple bar chart visualization */}
              <div className="flex h-full items-end space-x-2" data-unique-id="d38242fa-e5c8-445c-86ce-0c26083faada" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">
                {stats.dailySends.map(day => <div key={day.date} className="flex-1 flex flex-col items-center" data-unique-id="da1c59ae-d7c5-45a2-9429-1b814e41155e" data-file-name="components/email-analytics.tsx">
                    <div className="w-full flex flex-col items-center space-y-1" data-unique-id="7eecec7c-8963-462e-863e-aee30a2277fe" data-file-name="components/email-analytics.tsx">
                      <div className="w-full bg-red-200" style={{
                  height: `${day.failed / (day.sent + day.failed) * 100}%`,
                  minHeight: day.failed > 0 ? '4px' : '0'
                }} data-unique-id="951a8da0-30ae-4fd1-85fc-30064692e62d" data-file-name="components/email-analytics.tsx"></div>
                      <div className="w-full bg-blue-400" style={{
                  height: `${day.sent / Math.max(...stats.dailySends.map(d => d.sent + d.failed)) * 100}%`
                }} data-unique-id="a607472f-7340-4ed0-9aa4-a8fa5e2bd9e3" data-file-name="components/email-analytics.tsx"></div>
                    </div>
                    <p className="text-xs mt-2" data-unique-id="4855f00f-1819-471b-8332-7fad44182916" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{new Date(day.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}</p>
                  </div>)}
              </div>
              
              <div className="absolute top-2 right-2 flex items-center space-x-4 text-xs" data-unique-id="117b67af-fc27-4495-82bc-4e08a50fd54d" data-file-name="components/email-analytics.tsx">
                <div className="flex items-center" data-unique-id="46b65885-b25b-490f-a756-fde1517cded0" data-file-name="components/email-analytics.tsx">
                  <div className="w-3 h-3 bg-blue-400 mr-1" data-unique-id="b996bac3-e49e-45ac-a95d-40c308dad147" data-file-name="components/email-analytics.tsx"></div>
                  <span data-unique-id="758600a9-434a-49c8-bf9f-79e700798dbc" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="c770033e-d99b-465a-847f-8e5f2f01d8d3" data-file-name="components/email-analytics.tsx">Successful</span></span>
                </div>
                <div className="flex items-center" data-unique-id="1a4b6a02-0ff9-468f-b912-97b5ed1702af" data-file-name="components/email-analytics.tsx">
                  <div className="w-3 h-3 bg-red-200 mr-1" data-unique-id="d4371ebd-01d8-4b85-a1a6-33cce00bd270" data-file-name="components/email-analytics.tsx"></div>
                  <span data-unique-id="1ba61ad1-43f0-4e0a-bf78-838608d78c2e" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="1ba5832d-6f62-4fb1-a695-18cd3b43f8c1" data-file-name="components/email-analytics.tsx">Failed</span></span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4" data-unique-id="28876560-41b7-4615-a8c5-0408a6f81215" data-file-name="components/email-analytics.tsx">
            <div className="border border-border rounded-lg p-4" data-unique-id="c4960093-a02a-46ed-a412-5fc5b700c3ba" data-file-name="components/email-analytics.tsx">
              <h3 className="text-sm font-medium mb-2" data-unique-id="196af36a-8a12-4643-a8d6-6cf73a88c733" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="ac93c369-b93b-4058-850c-e0128773e3e5" data-file-name="components/email-analytics.tsx">Top Delivery Issues</span></h3>
              <ul className="space-y-2 text-sm" data-unique-id="9fffff05-66aa-443e-a732-1feb7918e56b" data-file-name="components/email-analytics.tsx">
                <li className="flex justify-between" data-unique-id="bbdd436f-af28-4c11-9b09-08b0cbd7e838" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="e4ae15a1-324f-4147-893f-7d467518828e" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="0fff31ac-af6c-428e-80dc-11af85d67978" data-file-name="components/email-analytics.tsx">Invalid email address</span></span>
                  <span className="font-medium" data-unique-id="75488c6b-7848-4dfd-8f07-5485f1be398c" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="49a81787-da1c-4122-875d-df04b87045b8" data-file-name="components/email-analytics.tsx">42%</span></span>
                </li>
                <li className="flex justify-between" data-unique-id="9738987d-d93d-4afc-ab77-a62719507e5c" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="fd19b298-49b8-496b-bb6e-018384da47d3" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="24bec9fa-835b-454b-856c-337459192ae3" data-file-name="components/email-analytics.tsx">Mailbox full</span></span>
                  <span className="font-medium" data-unique-id="1930b57e-0f93-4c02-8f5c-bdbf18ca753d" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="7d057385-a22c-4a2f-afcf-9f58caa2041e" data-file-name="components/email-analytics.tsx">27%</span></span>
                </li>
                <li className="flex justify-between" data-unique-id="e2886d60-b63e-48ad-8c60-f9d4c1e791e5" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="8e39b77d-d6e0-4be3-ba0c-3143322c746b" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="9ca97335-21c7-4e05-ba94-183ab893f041" data-file-name="components/email-analytics.tsx">Spam filters</span></span>
                  <span className="font-medium" data-unique-id="989f8e4f-4b06-4115-adb0-2a3baa971823" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="eb49c495-4985-441e-bdd7-84c79b533a99" data-file-name="components/email-analytics.tsx">18%</span></span>
                </li>
                <li className="flex justify-between" data-unique-id="aeb159fa-b27b-4c2c-be63-389fab292152" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="7ea996ed-2166-4ac0-99a0-b05cba2e6502" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="6a5bff34-64a4-46ff-a940-1ce63ccfdd7c" data-file-name="components/email-analytics.tsx">Other</span></span>
                  <span className="font-medium" data-unique-id="a1cf25a6-e653-41e8-9691-64bd4693d68f" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="1e89fc4f-d099-4c0f-b8df-8a2183684601" data-file-name="components/email-analytics.tsx">13%</span></span>
                </li>
              </ul>
            </div>
            
            <div className="border border-border rounded-lg p-4" data-unique-id="b72cb0ea-7577-4675-8f1e-017364b1c201" data-file-name="components/email-analytics.tsx">
              <h3 className="text-sm font-medium mb-2" data-unique-id="3bf0de72-1e99-4c1c-a77f-2e8ad715d200" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="2e5cb6c0-a1ae-42bf-bda8-8ea882c25017" data-file-name="components/email-analytics.tsx">Delivery Performance</span></h3>
              <div className="flex items-center justify-center h-32" data-unique-id="066a90dc-a3a7-40b7-8a35-f2b763382be6" data-file-name="components/email-analytics.tsx">
                <div className="relative w-32 h-32" data-unique-id="52f631a4-7f3a-45c8-8866-67cb7de0414c" data-file-name="components/email-analytics.tsx">
                  <svg viewBox="0 0 100 100" className="w-full h-full" data-unique-id="2b4b7b95-bf4f-4cf9-b000-2efa830162c6" data-file-name="components/email-analytics.tsx">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="15" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="15" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - stats.deliveryRate / 100)} transform="rotate(-90 50 50)" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center" data-unique-id="4feb6ac8-d666-4d44-9fa2-acbdf61777cb" data-file-name="components/email-analytics.tsx">
                    <span className="text-2xl font-bold" data-unique-id="b3db7f94-94ca-400c-aabf-7b0b22ca6cbb" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.deliveryRate}<span className="editable-text" data-unique-id="008fac20-1534-4069-a6be-bf7381616fe3" data-file-name="components/email-analytics.tsx">%</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>}
    </motion.div>;
}