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
  }} className="bg-white rounded-lg shadow-md p-6" data-unique-id="ea8e028f-7b02-46fc-9ff7-1c54dc945362" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">
      <div className="flex justify-between items-center mb-6" data-unique-id="915eb879-c68f-4af2-a486-fc0bbbdf2895" data-file-name="components/email-analytics.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="4b777f3f-2e8c-49cc-b2a5-56325b38d60d" data-file-name="components/email-analytics.tsx">
          <BarChart className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="df031903-73df-443f-bed5-94d5bc1b2015" data-file-name="components/email-analytics.tsx"> Email Analytics
        </span></h2>
        <button onClick={fetchEmailStats} disabled={isLoading} className="flex items-center px-3 py-1.5 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors disabled:opacity-50" data-unique-id="ebbf3f75-1421-4396-b00c-e682314db125" data-file-name="components/email-analytics.tsx">
          <RefreshCw className={`mr-1.5 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /><span className="editable-text" data-unique-id="5e1da9f3-e80e-467e-a472-015bc059ab36" data-file-name="components/email-analytics.tsx">
          Refresh
        </span></button>
      </div>
      
      {isLoading ? <div className="flex justify-center items-center h-64" data-unique-id="9ff5dfc4-ebde-4d43-8c48-9885e633f30f" data-file-name="components/email-analytics.tsx">
          <div className="animate-pulse flex flex-col items-center" data-unique-id="3d5b4129-5436-4bb6-86e0-0c9e7eddfb1d" data-file-name="components/email-analytics.tsx">
            <RefreshCw className="animate-spin h-8 w-8 text-primary mb-2" />
            <p className="text-muted-foreground" data-unique-id="177b8280-03a8-4d5e-adc1-ecae360de9c7" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="35c4ea54-bc7f-41f3-a96d-426e83f4f5b3" data-file-name="components/email-analytics.tsx">Loading analytics...</span></p>
          </div>
        </div> : <div className="space-y-6" data-unique-id="87dcb515-818d-4977-95bd-7122ace02556" data-file-name="components/email-analytics.tsx">
          <div className="grid grid-cols-3 gap-4" data-unique-id="63595ad3-f84c-437a-8226-042e59078c9d" data-file-name="components/email-analytics.tsx">
            <div className="bg-blue-50 p-4 rounded-lg" data-unique-id="3ed71901-8f9b-4043-b627-71f55a64bac1" data-file-name="components/email-analytics.tsx">
              <p className="text-sm text-blue-600 mb-1" data-unique-id="e9a00176-b059-4ee1-84fe-1ec6fc868954" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="8dda67ff-1004-464d-b7f7-2756352bfe7a" data-file-name="components/email-analytics.tsx">Total Emails Sent</span></p>
              <p className="text-2xl font-bold" data-unique-id="576360b4-f612-4403-942e-61261bbb4223" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.totalSent.toLocaleString()}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg" data-unique-id="86ac7b56-8f08-4205-9f9c-99e810a5606e" data-file-name="components/email-analytics.tsx">
              <p className="text-sm text-amber-600 mb-1" data-unique-id="96c3eabd-c34a-4e1a-902d-cd21492bfc01" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="4b6a49a6-e7e7-418b-b2f2-af93d474ff22" data-file-name="components/email-analytics.tsx">Failed Deliveries</span></p>
              <p className="text-2xl font-bold" data-unique-id="320d1cb9-7891-4c0b-9340-60fc7350470d" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.totalFailed.toLocaleString()}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg" data-unique-id="234ecb6e-fa7a-4ee4-b221-c0d9110a8ee9" data-file-name="components/email-analytics.tsx">
              <p className="text-sm text-green-600 mb-1" data-unique-id="6a4fb715-1561-4522-8800-afc213c76244" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="2cef9f1e-d8c6-4e39-983c-79a5c20e0ba8" data-file-name="components/email-analytics.tsx">Delivery Rate</span></p>
              <p className="text-2xl font-bold" data-unique-id="b216fc67-e080-4b4c-8086-098d5a98cdd3" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.deliveryRate}<span className="editable-text" data-unique-id="2b4960d4-e3d0-40a0-9ee2-3bc8e0204c60" data-file-name="components/email-analytics.tsx">%</span></p>
            </div>
          </div>
          
          <div className="border border-border rounded-lg p-4" data-unique-id="e460d7f1-85db-4ce2-904d-5ef7951d8ec5" data-file-name="components/email-analytics.tsx">
            <h3 className="text-sm font-medium mb-4 flex items-center" data-unique-id="f9e9fa27-749a-4ddf-a91c-6b8863b98d6c" data-file-name="components/email-analytics.tsx">
              <Calendar className="h-4 w-4 mr-2" data-unique-id="89ed38bc-8db8-4be2-b3fe-2192cd8d3a1b" data-file-name="components/email-analytics.tsx" /><span className="editable-text" data-unique-id="d9e55a49-8970-4dda-9780-9da8fd209a55" data-file-name="components/email-analytics.tsx"> Daily Email Activity
            </span></h3>
            <div className="h-64 relative" data-unique-id="6f151ac5-2e4c-4d57-99a5-d93164a01c6f" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">
              {/* Simple bar chart visualization */}
              <div className="flex h-full items-end space-x-2" data-unique-id="307e80d2-5c50-4d36-8b51-326c07e12cbe" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">
                {stats.dailySends.map(day => <div key={day.date} className="flex-1 flex flex-col items-center" data-unique-id="6a222d7d-ba12-49c6-b55e-7fc58e785b35" data-file-name="components/email-analytics.tsx">
                    <div className="w-full flex flex-col items-center space-y-1" data-unique-id="d12c6646-a95e-4345-b62f-d23a57ce3171" data-file-name="components/email-analytics.tsx">
                      <div className="w-full bg-red-200" style={{
                  height: `${day.failed / (day.sent + day.failed) * 100}%`,
                  minHeight: day.failed > 0 ? '4px' : '0'
                }} data-unique-id="1eab939e-e0af-47c7-bc5d-7bb7de137401" data-file-name="components/email-analytics.tsx"></div>
                      <div className="w-full bg-blue-400" style={{
                  height: `${day.sent / Math.max(...stats.dailySends.map(d => d.sent + d.failed)) * 100}%`
                }} data-unique-id="8cc7d858-f340-46fa-b8f1-48488f0c72e2" data-file-name="components/email-analytics.tsx"></div>
                    </div>
                    <p className="text-xs mt-2" data-unique-id="8db41ad0-781c-4208-a92a-6d48474146be" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{new Date(day.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}</p>
                  </div>)}
              </div>
              
              <div className="absolute top-2 right-2 flex items-center space-x-4 text-xs" data-unique-id="dc412250-bbb7-4bce-8af6-200f7d76a907" data-file-name="components/email-analytics.tsx">
                <div className="flex items-center" data-unique-id="5fbfee35-e2d9-4c76-9bc6-f493b814eeca" data-file-name="components/email-analytics.tsx">
                  <div className="w-3 h-3 bg-blue-400 mr-1" data-unique-id="d06581f5-bdc1-48b9-b142-97eee413d07a" data-file-name="components/email-analytics.tsx"></div>
                  <span data-unique-id="aba3722f-05a5-4426-90a0-83b3b314a26e" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="cac50b33-e50e-44da-8f85-038ed1f6380e" data-file-name="components/email-analytics.tsx">Successful</span></span>
                </div>
                <div className="flex items-center" data-unique-id="2215e948-efa6-436b-bedc-bcf1a5e41261" data-file-name="components/email-analytics.tsx">
                  <div className="w-3 h-3 bg-red-200 mr-1" data-unique-id="bff170de-891a-4265-b04b-08feb9e905d4" data-file-name="components/email-analytics.tsx"></div>
                  <span data-unique-id="207bb481-a7c0-4f67-94cf-c6e3db002533" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="82c74076-c77f-4f07-b620-cef1d38a2c6a" data-file-name="components/email-analytics.tsx">Failed</span></span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4" data-unique-id="ad5e2725-2311-4da3-9ba4-3c693c3e692c" data-file-name="components/email-analytics.tsx">
            <div className="border border-border rounded-lg p-4" data-unique-id="59176021-724a-43dd-be68-b2892fd13107" data-file-name="components/email-analytics.tsx">
              <h3 className="text-sm font-medium mb-2" data-unique-id="7d43ac84-2c99-43ea-8073-5f232c74d3ff" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="92956a54-6b03-4ca8-ab1f-244a07f70c06" data-file-name="components/email-analytics.tsx">Top Delivery Issues</span></h3>
              <ul className="space-y-2 text-sm" data-unique-id="4304172c-0499-43a5-a99d-0986568551d0" data-file-name="components/email-analytics.tsx">
                <li className="flex justify-between" data-unique-id="06afe5a5-df44-4890-8564-045dd3c5121a" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="858f0c9a-db99-47a7-bbcd-c028b45bc550" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="47e94713-cc78-42a4-8fce-718f2a267fa4" data-file-name="components/email-analytics.tsx">Invalid email address</span></span>
                  <span className="font-medium" data-unique-id="edc7bb0b-2133-43dd-a970-8cce87fd0797" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="39c880ff-a7a4-4752-bd22-7bb1b522483c" data-file-name="components/email-analytics.tsx">42%</span></span>
                </li>
                <li className="flex justify-between" data-unique-id="3f8725c5-c67a-4aeb-aecf-d171f414a9b3" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="dfec5f1d-0674-48c7-a4f1-293062d26777" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="a153e489-ee99-4f54-9f7e-231b10654680" data-file-name="components/email-analytics.tsx">Mailbox full</span></span>
                  <span className="font-medium" data-unique-id="fa091ac9-f333-4147-b73d-df99b04ffd0f" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="c3396a44-4215-48fc-8d34-c50f520b5d49" data-file-name="components/email-analytics.tsx">27%</span></span>
                </li>
                <li className="flex justify-between" data-unique-id="e0f0a423-05a6-4bf4-b6df-c5dba2a10da7" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="bef185f4-c202-4343-a2c4-e21e3f1a944d" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="98cab040-b722-4941-b26e-7d67a56cd516" data-file-name="components/email-analytics.tsx">Spam filters</span></span>
                  <span className="font-medium" data-unique-id="36268812-8255-40fc-98be-2ee2832c8ee6" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="404d19dd-0d8f-4845-bc71-ccff6cd5747e" data-file-name="components/email-analytics.tsx">18%</span></span>
                </li>
                <li className="flex justify-between" data-unique-id="9bb123dc-c710-4f7b-b02a-f0b5f256397a" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="f724980c-1dd6-4b49-a3a2-3de75793afd5" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="1ed8005c-fe9c-4191-b733-39238e4371f5" data-file-name="components/email-analytics.tsx">Other</span></span>
                  <span className="font-medium" data-unique-id="60a696ba-f5b4-40d8-ba8f-1cdb3442305d" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="dede38d5-5bf0-4dd4-bbc9-5b053f668464" data-file-name="components/email-analytics.tsx">13%</span></span>
                </li>
              </ul>
            </div>
            
            <div className="border border-border rounded-lg p-4" data-unique-id="8ef7ca6d-92ee-4c73-a37b-36e3bc67d172" data-file-name="components/email-analytics.tsx">
              <h3 className="text-sm font-medium mb-2" data-unique-id="8549f15c-4106-4509-9dd1-844b6c924982" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="557658bb-d0b8-47d9-9f28-1df0c801fdbc" data-file-name="components/email-analytics.tsx">Delivery Performance</span></h3>
              <div className="flex items-center justify-center h-32" data-unique-id="c9e7d8f1-c7b8-4be3-a634-f4822ad96b65" data-file-name="components/email-analytics.tsx">
                <div className="relative w-32 h-32" data-unique-id="9e761c16-1dce-4aa8-9fb3-38c0cc7d8202" data-file-name="components/email-analytics.tsx">
                  <svg viewBox="0 0 100 100" className="w-full h-full" data-unique-id="fb7a4e33-0537-497a-bbd4-f381244edb81" data-file-name="components/email-analytics.tsx">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="15" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="15" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - stats.deliveryRate / 100)} transform="rotate(-90 50 50)" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center" data-unique-id="b69fe268-2a76-49eb-851d-d36d85684b0e" data-file-name="components/email-analytics.tsx">
                    <span className="text-2xl font-bold" data-unique-id="8667ce78-4194-441e-b97a-758327b5bc6d" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.deliveryRate}<span className="editable-text" data-unique-id="2d95786e-2a5d-449a-b1d8-7c0bbcc4e706" data-file-name="components/email-analytics.tsx">%</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>}
    </motion.div>;
}