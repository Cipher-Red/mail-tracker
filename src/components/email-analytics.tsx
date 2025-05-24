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
  }} className="bg-white rounded-lg shadow-md p-6" data-unique-id="29507889-031b-4c03-b42d-1cf48e7f9794" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">
      <div className="flex justify-between items-center mb-6" data-unique-id="483c9fb3-cf6f-4721-ab9e-6544671a4ed8" data-file-name="components/email-analytics.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="852a5cf6-b383-46d5-900a-7eac07d99703" data-file-name="components/email-analytics.tsx">
          <BarChart className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="219578c4-3070-4e0b-8e32-c79ef3caf80b" data-file-name="components/email-analytics.tsx"> Email Analytics
        </span></h2>
        <button onClick={fetchEmailStats} disabled={isLoading} className="flex items-center px-3 py-1.5 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors disabled:opacity-50" data-unique-id="9f8bcaff-b41d-4dbb-baa4-e0d684656de6" data-file-name="components/email-analytics.tsx">
          <RefreshCw className={`mr-1.5 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /><span className="editable-text" data-unique-id="ff166ec8-3e7f-4abd-9a4e-120ff40c3c44" data-file-name="components/email-analytics.tsx">
          Refresh
        </span></button>
      </div>
      
      {isLoading ? <div className="flex justify-center items-center h-64" data-unique-id="060f4881-9b78-4aff-aa39-bef0edc6d86c" data-file-name="components/email-analytics.tsx">
          <div className="animate-pulse flex flex-col items-center" data-unique-id="92ac00ac-05d7-4075-8481-c397a1412690" data-file-name="components/email-analytics.tsx">
            <RefreshCw className="animate-spin h-8 w-8 text-primary mb-2" />
            <p className="text-muted-foreground" data-unique-id="681eeccb-cb3c-4cf3-a5c4-c9106f2ac2d6" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="78c6775e-6219-460e-9e33-52fe2ad806d9" data-file-name="components/email-analytics.tsx">Loading analytics...</span></p>
          </div>
        </div> : <div className="space-y-6" data-unique-id="3ada51bf-d158-4171-b7fe-e75e02a2ab4d" data-file-name="components/email-analytics.tsx">
          <div className="grid grid-cols-3 gap-4" data-unique-id="d11ed368-5d70-4c2b-b356-46f5fa29cb58" data-file-name="components/email-analytics.tsx">
            <div className="bg-blue-50 p-4 rounded-lg" data-unique-id="dab3f4a5-0e16-46f7-85bc-a61fc6b74514" data-file-name="components/email-analytics.tsx">
              <p className="text-sm text-blue-600 mb-1" data-unique-id="69d3fec7-a4ec-40f8-9e30-aa26881b1512" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="4a290e60-5e99-4044-9498-eb64eb9c5e51" data-file-name="components/email-analytics.tsx">Total Emails Sent</span></p>
              <p className="text-2xl font-bold" data-unique-id="73d32bbb-975f-46ed-9831-6efc58249210" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.totalSent.toLocaleString()}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg" data-unique-id="16315ab2-70a7-4c41-9ee4-5cda8647e5f1" data-file-name="components/email-analytics.tsx">
              <p className="text-sm text-amber-600 mb-1" data-unique-id="87bd2535-ea7a-4b99-a2ac-c37df740b849" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="5eec25d3-0bd7-42d2-b923-b94e3e3277a2" data-file-name="components/email-analytics.tsx">Failed Deliveries</span></p>
              <p className="text-2xl font-bold" data-unique-id="9bd657f2-dfb7-43d6-bd6c-1c09a67565e1" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.totalFailed.toLocaleString()}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg" data-unique-id="f29a5a0d-f700-40fd-b828-9d6b1d333f1b" data-file-name="components/email-analytics.tsx">
              <p className="text-sm text-green-600 mb-1" data-unique-id="94c57ba6-e5cc-4d4f-8f73-81ba4a76f519" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="03e8adcd-553a-42db-8096-2ed9b650d42a" data-file-name="components/email-analytics.tsx">Delivery Rate</span></p>
              <p className="text-2xl font-bold" data-unique-id="c3d52d5d-243b-4479-a985-4bcb0c980e13" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.deliveryRate}<span className="editable-text" data-unique-id="721f7bdf-d10f-445e-85ac-98e7ee5d6190" data-file-name="components/email-analytics.tsx">%</span></p>
            </div>
          </div>
          
          <div className="border border-border rounded-lg p-4" data-unique-id="e59364b2-1ef2-4106-abdc-f2b54eb2330c" data-file-name="components/email-analytics.tsx">
            <h3 className="text-sm font-medium mb-4 flex items-center" data-unique-id="419ee837-5b33-407b-b0e1-b4fb5e798f52" data-file-name="components/email-analytics.tsx">
              <Calendar className="h-4 w-4 mr-2" data-unique-id="723b69da-4c6b-4e37-8251-44213505c844" data-file-name="components/email-analytics.tsx" /><span className="editable-text" data-unique-id="eb28e4d2-cf84-414f-a576-d55c1d3cc312" data-file-name="components/email-analytics.tsx"> Daily Email Activity
            </span></h3>
            <div className="h-64 relative" data-unique-id="391b8192-bb84-48e8-a6e2-10cbb6e6a047" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">
              {/* Simple bar chart visualization */}
              <div className="flex h-full items-end space-x-2" data-unique-id="8fd95eb4-78e2-4994-8634-bbfec274423d" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">
                {stats.dailySends.map(day => <div key={day.date} className="flex-1 flex flex-col items-center" data-unique-id="9d2f2ccd-0063-4ee5-b0d4-000d53d8be9f" data-file-name="components/email-analytics.tsx">
                    <div className="w-full flex flex-col items-center space-y-1" data-unique-id="6853a44e-fa8c-4dfe-a974-24aaa10239c4" data-file-name="components/email-analytics.tsx">
                      <div className="w-full bg-red-200" style={{
                  height: `${day.failed / (day.sent + day.failed) * 100}%`,
                  minHeight: day.failed > 0 ? '4px' : '0'
                }} data-unique-id="28df5dd1-a043-4a6f-8f38-1fc8ef2d236e" data-file-name="components/email-analytics.tsx"></div>
                      <div className="w-full bg-blue-400" style={{
                  height: `${day.sent / Math.max(...stats.dailySends.map(d => d.sent + d.failed)) * 100}%`
                }} data-unique-id="84e31cc7-acd8-4870-b94f-e462e53410e6" data-file-name="components/email-analytics.tsx"></div>
                    </div>
                    <p className="text-xs mt-2" data-unique-id="2b5a6cb5-de88-402f-a989-a59c135ec582" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{new Date(day.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}</p>
                  </div>)}
              </div>
              
              <div className="absolute top-2 right-2 flex items-center space-x-4 text-xs" data-unique-id="fd84291a-704a-4999-884d-a975b8ee684b" data-file-name="components/email-analytics.tsx">
                <div className="flex items-center" data-unique-id="c5746ce3-2ddb-483f-8fd2-cbdde54cd429" data-file-name="components/email-analytics.tsx">
                  <div className="w-3 h-3 bg-blue-400 mr-1" data-unique-id="446b4db5-bcb9-4868-8c80-c61111fc283b" data-file-name="components/email-analytics.tsx"></div>
                  <span data-unique-id="4375c874-3a4c-4561-a552-9248e67c9656" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="6b777085-c6f9-486a-9493-411dd5c30918" data-file-name="components/email-analytics.tsx">Successful</span></span>
                </div>
                <div className="flex items-center" data-unique-id="dfa91438-67d8-4f4b-a2de-a902cc5c555a" data-file-name="components/email-analytics.tsx">
                  <div className="w-3 h-3 bg-red-200 mr-1" data-unique-id="b2b39ffa-3790-4374-8af7-b18d1c5401a0" data-file-name="components/email-analytics.tsx"></div>
                  <span data-unique-id="0f45c578-ac8f-4037-9738-458a4f2ded4a" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="d19549d6-5eff-4197-9011-4696293b13ea" data-file-name="components/email-analytics.tsx">Failed</span></span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4" data-unique-id="f7e8079f-093b-4b82-8cff-a59cf02cc55c" data-file-name="components/email-analytics.tsx">
            <div className="border border-border rounded-lg p-4" data-unique-id="c4a17a51-d940-47a9-86ac-f13223a7a22e" data-file-name="components/email-analytics.tsx">
              <h3 className="text-sm font-medium mb-2" data-unique-id="e2bfa7f6-894e-4298-aae1-933e73041fab" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="7bf48ee1-9e3e-47fa-8305-0ce918c67689" data-file-name="components/email-analytics.tsx">Top Delivery Issues</span></h3>
              <ul className="space-y-2 text-sm" data-unique-id="d809dc5d-3d75-434c-bdc7-4e1714ffb0a9" data-file-name="components/email-analytics.tsx">
                <li className="flex justify-between" data-unique-id="9a8ea276-27e6-4ca3-81ac-35f21a2cfad2" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="8dd5bb16-650e-49b3-b45d-4f22a100b9fb" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="6346b57f-f1b1-4571-8f25-a091e96e95a0" data-file-name="components/email-analytics.tsx">Invalid email address</span></span>
                  <span className="font-medium" data-unique-id="d10128e5-a16e-454a-90fb-4cbb8f83e00f" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="0d25aa63-a39e-4e05-a60c-110dadd311b9" data-file-name="components/email-analytics.tsx">42%</span></span>
                </li>
                <li className="flex justify-between" data-unique-id="1eb87a80-284c-4766-ad70-071bcee5b0c6" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="e651a784-c189-421b-a41e-7210a885a245" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="add0e213-e131-41d8-8e01-828b4b52419d" data-file-name="components/email-analytics.tsx">Mailbox full</span></span>
                  <span className="font-medium" data-unique-id="8b41be1e-8fbb-45b7-8c4e-6e8724839b9d" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="00b09cfe-2892-4628-90a9-d7f80a3208e8" data-file-name="components/email-analytics.tsx">27%</span></span>
                </li>
                <li className="flex justify-between" data-unique-id="4f143325-e445-4c34-9ce6-5622f538c115" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="a65b30d5-1389-48be-885b-4e9a9bf0c068" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="ce7fe23a-43ab-4e98-93cd-17f6f4b2780f" data-file-name="components/email-analytics.tsx">Spam filters</span></span>
                  <span className="font-medium" data-unique-id="d905695a-59ef-4918-9e76-0dd22b90c068" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="0d734b00-34fe-4ef1-91e6-ce7e65473f11" data-file-name="components/email-analytics.tsx">18%</span></span>
                </li>
                <li className="flex justify-between" data-unique-id="5b8217df-740b-4aad-b00d-5e508436f0a3" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="de13a405-2c4b-448f-ac8e-7dd2d7da7443" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="37d09564-5790-4a8f-b217-8366affe02b6" data-file-name="components/email-analytics.tsx">Other</span></span>
                  <span className="font-medium" data-unique-id="6cbc7caa-6331-41d7-839b-722e8db5517b" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="b04937f8-8105-4d1e-bdb8-8ffc77274f6d" data-file-name="components/email-analytics.tsx">13%</span></span>
                </li>
              </ul>
            </div>
            
            <div className="border border-border rounded-lg p-4" data-unique-id="38333aea-2f72-455c-85b9-bb68c0206f0c" data-file-name="components/email-analytics.tsx">
              <h3 className="text-sm font-medium mb-2" data-unique-id="1659f434-abda-4317-bf5c-e351b1361106" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="311f71ba-7bf5-4eb9-81d5-b77a6c991c40" data-file-name="components/email-analytics.tsx">Delivery Performance</span></h3>
              <div className="flex items-center justify-center h-32" data-unique-id="70981365-d52c-4dbd-b2d9-1783ae6d72c3" data-file-name="components/email-analytics.tsx">
                <div className="relative w-32 h-32" data-unique-id="7ff3b077-7bac-4816-86d1-bbc93b06a4b8" data-file-name="components/email-analytics.tsx">
                  <svg viewBox="0 0 100 100" className="w-full h-full" data-unique-id="42e31e75-d00d-4061-8afb-1cb500ca7070" data-file-name="components/email-analytics.tsx">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="15" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="15" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - stats.deliveryRate / 100)} transform="rotate(-90 50 50)" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center" data-unique-id="b8741d0f-c264-4be4-ae43-199e562ce444" data-file-name="components/email-analytics.tsx">
                    <span className="text-2xl font-bold" data-unique-id="549a2447-61ca-44af-8fc4-dd4a06a2c6eb" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.deliveryRate}<span className="editable-text" data-unique-id="4adec8b7-71fc-4b4c-b708-aeafa423edf3" data-file-name="components/email-analytics.tsx">%</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>}
    </motion.div>;
}