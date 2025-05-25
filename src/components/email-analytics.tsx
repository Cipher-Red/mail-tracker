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
  }} className="bg-white rounded-lg shadow-md p-6" data-unique-id="cc719164-59a1-404e-b55d-6485b77d1486" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">
      <div className="flex justify-between items-center mb-6" data-unique-id="6cccedf8-422a-40e4-ba57-aaea5337306f" data-file-name="components/email-analytics.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="fb01c80e-b40b-4c80-90e1-2c9b911de790" data-file-name="components/email-analytics.tsx">
          <BarChart className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="17d0bde4-a83a-48ed-b109-067c53016e2b" data-file-name="components/email-analytics.tsx"> Email Analytics
        </span></h2>
        <button onClick={fetchEmailStats} disabled={isLoading} className="flex items-center px-3 py-1.5 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors disabled:opacity-50" data-unique-id="1c545066-ffc8-4672-bbe0-634e82f0cef6" data-file-name="components/email-analytics.tsx">
          <RefreshCw className={`mr-1.5 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /><span className="editable-text" data-unique-id="ff91f3df-7e05-4fb2-8058-ad91b6ca1908" data-file-name="components/email-analytics.tsx">
          Refresh
        </span></button>
      </div>
      
      {isLoading ? <div className="flex justify-center items-center h-64" data-unique-id="f70b262d-a364-4494-bda7-2df62e2d5acf" data-file-name="components/email-analytics.tsx">
          <div className="animate-pulse flex flex-col items-center" data-unique-id="203e8031-a8c7-44b5-9ad8-939c154dcba3" data-file-name="components/email-analytics.tsx">
            <RefreshCw className="animate-spin h-8 w-8 text-primary mb-2" />
            <p className="text-muted-foreground" data-unique-id="989ffbda-1fd3-49f0-bdfc-0cae2df32db0" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="0e3ad244-2117-49b0-8567-4eea76a9e604" data-file-name="components/email-analytics.tsx">Loading analytics...</span></p>
          </div>
        </div> : <div className="space-y-6" data-unique-id="c1ce2215-23c7-4968-81d9-2224300e6024" data-file-name="components/email-analytics.tsx">
          <div className="grid grid-cols-3 gap-4" data-unique-id="ea665521-f28a-4a92-b3fc-ee71f603b09f" data-file-name="components/email-analytics.tsx">
            <div className="bg-blue-50 p-4 rounded-lg" data-unique-id="3e435237-6acc-4bae-8268-7b3a04e33122" data-file-name="components/email-analytics.tsx">
              <p className="text-sm text-blue-600 mb-1" data-unique-id="a73846b5-2694-4f00-8af9-ba5d9a2c3822" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="3331a56a-bcdf-4ab6-88c3-468f333ceac7" data-file-name="components/email-analytics.tsx">Total Emails Sent</span></p>
              <p className="text-2xl font-bold" data-unique-id="7101d816-dd7d-40d5-99ec-bee6decd780e" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.totalSent.toLocaleString()}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg" data-unique-id="ddc8ac6f-eb14-4d6c-a164-900ef886e650" data-file-name="components/email-analytics.tsx">
              <p className="text-sm text-amber-600 mb-1" data-unique-id="64d60a3f-f974-48e5-bb9e-25315b1a0ec9" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="65db2006-9954-412a-a409-9d8b4410cb07" data-file-name="components/email-analytics.tsx">Failed Deliveries</span></p>
              <p className="text-2xl font-bold" data-unique-id="bad8accb-7b9b-40c7-973f-f4df221bce01" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.totalFailed.toLocaleString()}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg" data-unique-id="65702d78-311c-4187-a078-90752fd4c6de" data-file-name="components/email-analytics.tsx">
              <p className="text-sm text-green-600 mb-1" data-unique-id="ac97b1c7-0113-41f6-8e59-d4f1f85b6f2c" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="f983be0f-d1a6-430b-b8e3-183dfc23abf6" data-file-name="components/email-analytics.tsx">Delivery Rate</span></p>
              <p className="text-2xl font-bold" data-unique-id="bcd6273e-20ea-46df-8775-ce74e67ef968" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.deliveryRate}<span className="editable-text" data-unique-id="68046a70-e481-4d6f-92df-312c12698f26" data-file-name="components/email-analytics.tsx">%</span></p>
            </div>
          </div>
          
          <div className="border border-border rounded-lg p-4" data-unique-id="f4c61618-6fad-4f63-b62a-746f2c25945f" data-file-name="components/email-analytics.tsx">
            <h3 className="text-sm font-medium mb-4 flex items-center" data-unique-id="e41b8dfa-862c-42eb-a1ba-d5b2f410b37b" data-file-name="components/email-analytics.tsx">
              <Calendar className="h-4 w-4 mr-2" data-unique-id="7b6b1c7c-f925-47c6-82a6-3e60722ec24d" data-file-name="components/email-analytics.tsx" /><span className="editable-text" data-unique-id="4e24385b-bae0-43af-84ac-05575ea797ec" data-file-name="components/email-analytics.tsx"> Daily Email Activity
            </span></h3>
            <div className="h-64 relative" data-unique-id="dfcb0622-55fb-4855-8364-ed0676b8f92c" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">
              {/* Simple bar chart visualization */}
              <div className="flex h-full items-end space-x-2" data-unique-id="39c633cf-ba98-4098-9933-c0afb9eb732f" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">
                {stats.dailySends.map(day => <div key={day.date} className="flex-1 flex flex-col items-center" data-unique-id="97e178c1-6bf0-4e46-a7b4-de9b8904bcd2" data-file-name="components/email-analytics.tsx">
                    <div className="w-full flex flex-col items-center space-y-1" data-unique-id="edca9315-bf64-44d3-8e7a-8e209aae29ec" data-file-name="components/email-analytics.tsx">
                      <div className="w-full bg-red-200" style={{
                  height: `${day.failed / (day.sent + day.failed) * 100 || 0}%`,
                  minHeight: day.failed > 0 ? '4px' : '0'
                }} data-unique-id="02dd8198-3503-47e0-9ddb-10b04130fe93" data-file-name="components/email-analytics.tsx"></div>
                      <div className="w-full bg-blue-400" style={{
                  height: `${day.sent / Math.max(...stats.dailySends.map(d => d.sent + d.failed || 1)) * 100 || 0}%`
                }} data-unique-id="73ab8557-4b06-443e-9524-ab09e124c251" data-file-name="components/email-analytics.tsx"></div>
                    </div>
                    <p className="text-xs mt-2" data-unique-id="7e1af59f-7882-4e89-868c-b29f0f209d3c" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{new Date(day.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}</p>
                  </div>)}
              </div>
              
              <div className="absolute top-2 right-2 flex items-center space-x-4 text-xs" data-unique-id="1573a040-aa86-496d-8660-c8febc6cc1e5" data-file-name="components/email-analytics.tsx">
                <div className="flex items-center" data-unique-id="0f1871cf-cfba-4e5e-b29b-286e2c16204c" data-file-name="components/email-analytics.tsx">
                  <div className="w-3 h-3 bg-blue-400 mr-1" data-unique-id="97734c03-47ed-4ee2-8c50-88811e10fd28" data-file-name="components/email-analytics.tsx"></div>
                  <span data-unique-id="a94b8cf7-a858-4065-adbc-2765bae4faa5" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="4a17ea2e-9e04-4c4f-8789-dbc1e9bff0d4" data-file-name="components/email-analytics.tsx">Successful</span></span>
                </div>
                <div className="flex items-center" data-unique-id="2c3e79a5-99b8-4270-9dcb-043fc34978eb" data-file-name="components/email-analytics.tsx">
                  <div className="w-3 h-3 bg-red-200 mr-1" data-unique-id="52cfbe67-4992-43b1-9ecc-4a0505c57bd5" data-file-name="components/email-analytics.tsx"></div>
                  <span data-unique-id="9a26d55f-b052-4293-9e86-f06355eb4d04" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="ac809ce0-224e-4352-9ef9-f0d15726be14" data-file-name="components/email-analytics.tsx">Failed</span></span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4" data-unique-id="b1d0377f-b022-4005-89bc-79a117376e4b" data-file-name="components/email-analytics.tsx">
            <div className="border border-border rounded-lg p-4" data-unique-id="3f11398f-969a-48ef-89f2-049462400289" data-file-name="components/email-analytics.tsx">
              <h3 className="text-sm font-medium mb-2" data-unique-id="9790890f-2ad9-4955-a178-937a97dd4e7d" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="0ff60d84-f5a8-4e55-aa56-eee1cb1455df" data-file-name="components/email-analytics.tsx">Top Delivery Issues</span></h3>
              <ul className="space-y-2 text-sm" data-unique-id="b648baab-29b6-4005-b1ba-05eaf61a2970" data-file-name="components/email-analytics.tsx">
                <li className="flex justify-between" data-unique-id="bf20c49f-10a8-4e93-ab93-6f55b87a32e1" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="b4846541-5a4f-41db-861c-6ef303bac361" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="9203436c-b8c4-4579-a5d5-39b8242cd3db" data-file-name="components/email-analytics.tsx">Invalid email address</span></span>
                  <span className="font-medium" data-unique-id="2e0f35a0-418e-4dc7-861e-92af4969a9cd" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="0a4eb0cc-57a6-4d02-a46e-a7eda35c59fa" data-file-name="components/email-analytics.tsx">42%</span></span>
                </li>
                <li className="flex justify-between" data-unique-id="86a7b29b-b05b-400f-9803-924eacf4d410" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="7a269737-7be6-401c-a875-9848fec55412" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="322dae44-5493-44d5-acb5-9d1f582686c6" data-file-name="components/email-analytics.tsx">Mailbox full</span></span>
                  <span className="font-medium" data-unique-id="0dfa647a-54a7-4c8b-9f4d-1d95c989e739" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="b206032e-10e1-4741-9aee-80e0270e710d" data-file-name="components/email-analytics.tsx">27%</span></span>
                </li>
                <li className="flex justify-between" data-unique-id="b3f868d2-48cf-4efd-a443-3278ebda6df9" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="438423a7-d7f5-4864-9aed-1ebdc5ee74e2" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="42c235ab-4d16-4a38-a0b8-d4b49cea28d3" data-file-name="components/email-analytics.tsx">Spam filters</span></span>
                  <span className="font-medium" data-unique-id="449be493-ca1d-42b3-839e-4040e64596c7" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="9d7fc5e4-145b-46fc-8afe-a89797cb9a53" data-file-name="components/email-analytics.tsx">18%</span></span>
                </li>
                <li className="flex justify-between" data-unique-id="1e2192f7-fca4-4aee-bc81-93df678f04e2" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="01bf5f4a-d2c6-48ed-89e1-1842caf6a1fe" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="f390f681-b772-4ca4-bcc1-bfb2e02523ad" data-file-name="components/email-analytics.tsx">Other</span></span>
                  <span className="font-medium" data-unique-id="c25067fc-98d7-4134-bdca-b59810060d65" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="07388d55-2577-4452-8257-2f34849ac078" data-file-name="components/email-analytics.tsx">13%</span></span>
                </li>
              </ul>
            </div>
            
            <div className="border border-border rounded-lg p-4" data-unique-id="323315de-6554-455e-b0cf-7c919648949c" data-file-name="components/email-analytics.tsx">
              <h3 className="text-sm font-medium mb-2" data-unique-id="78035ac7-f253-494f-a3fb-035b292ddd1b" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="8c7fbfc7-d902-4e09-9670-30c83f2e881b" data-file-name="components/email-analytics.tsx">Delivery Performance</span></h3>
              <div className="flex items-center justify-center h-32" data-unique-id="1fe279b9-4d9a-4064-b44d-305479970dad" data-file-name="components/email-analytics.tsx">
                <div className="relative w-32 h-32" data-unique-id="1e79bbb2-3ed4-4067-8289-41fc4f5d2b63" data-file-name="components/email-analytics.tsx">
                  <svg viewBox="0 0 100 100" className="w-full h-full" data-unique-id="5d987740-3d43-4af6-8cf2-a792f31d9066" data-file-name="components/email-analytics.tsx">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="15" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="15" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - stats.deliveryRate / 100)} transform="rotate(-90 50 50)" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center" data-unique-id="79ca77e8-f199-49e7-bd2e-0d2cadb6cce4" data-file-name="components/email-analytics.tsx">
                    <span className="text-2xl font-bold" data-unique-id="4ad3ea3d-67ce-4164-a558-2ead66712c8e" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.deliveryRate}<span className="editable-text" data-unique-id="79e42bbc-2456-4db5-9922-b20027a4831e" data-file-name="components/email-analytics.tsx">%</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>}
    </motion.div>;
}