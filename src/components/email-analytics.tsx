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
  }} className="bg-card rounded-lg shadow-md p-6" data-unique-id="1e59c48a-c721-4dce-ba61-f79342daa8fd" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">
      <div className="flex justify-between items-center mb-6" data-unique-id="dafd3a82-9eca-450c-aab6-4b41cb238a1b" data-file-name="components/email-analytics.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="1308d4b6-b70c-4541-bd65-3ff59c96ece1" data-file-name="components/email-analytics.tsx">
          <BarChart className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="655a7544-67e1-4781-9986-8be0354c8b0e" data-file-name="components/email-analytics.tsx"> Email Analytics
        </span></h2>
        <button onClick={fetchEmailStats} disabled={isLoading} className="flex items-center px-3 py-1.5 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors disabled:opacity-50" data-unique-id="150087e5-92b8-4bde-bf6f-6adea1ac1962" data-file-name="components/email-analytics.tsx">
          <RefreshCw className={`mr-1.5 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /><span className="editable-text" data-unique-id="d64a7adc-7959-413e-99bf-a553cd929368" data-file-name="components/email-analytics.tsx">
          Refresh
        </span></button>
      </div>
      
      {isLoading ? <div className="flex justify-center items-center h-64" data-unique-id="65481ce6-7d96-4f19-ab8e-684a851e044a" data-file-name="components/email-analytics.tsx">
          <div className="animate-pulse flex flex-col items-center" data-unique-id="c1bb4437-0260-4333-aea7-2b5aa5305a8f" data-file-name="components/email-analytics.tsx">
            <RefreshCw className="animate-spin h-8 w-8 text-primary mb-2" />
            <p className="text-muted-foreground" data-unique-id="e272aafe-bfaf-44db-88f9-f2acbf8fa847" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="c57f4a74-2a4a-47ff-92a0-e55dd7280c84" data-file-name="components/email-analytics.tsx">Loading analytics...</span></p>
          </div>
        </div> : <div className="space-y-6" data-unique-id="744099bf-5698-49cb-ade5-fccaea1b3e0d" data-file-name="components/email-analytics.tsx">
          <div className="grid grid-cols-3 gap-4" data-unique-id="be404d46-6906-4d18-b0b3-5da40a68628a" data-file-name="components/email-analytics.tsx">
            <div className="bg-blue-50 p-4 rounded-lg" data-unique-id="1d9dbf52-ffff-44cc-9aa8-9b8f46b3e44a" data-file-name="components/email-analytics.tsx">
              <p className="text-sm text-blue-600 mb-1" data-unique-id="b979dbdb-2dcf-413d-a435-eec734771565" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="828030db-4827-4e5a-beac-ce1bfc6c4771" data-file-name="components/email-analytics.tsx">Total Emails Sent</span></p>
              <p className="text-2xl font-bold" data-unique-id="7fd67ef3-d461-476e-aec4-97eae14530b3" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.totalSent.toLocaleString()}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg" data-unique-id="387ec8c1-e542-4b28-9cd3-f61519b0555c" data-file-name="components/email-analytics.tsx">
              <p className="text-sm text-amber-600 mb-1" data-unique-id="f8ad6046-7fcb-4383-bb38-8b834c9c1876" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="53354e75-f5eb-4728-85e5-a24924fdbeea" data-file-name="components/email-analytics.tsx">Failed Deliveries</span></p>
              <p className="text-2xl font-bold" data-unique-id="2c935619-7c52-49f3-b7a6-6d70d3891bd4" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.totalFailed.toLocaleString()}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg" data-unique-id="1256f403-ab5c-4aa7-8737-276bbba8f5cb" data-file-name="components/email-analytics.tsx">
              <p className="text-sm text-green-600 mb-1" data-unique-id="e2d3ab5e-e2ff-4e4d-82e3-c933b235101f" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="87fedcf9-4d55-4c82-b5f7-86fa9462764f" data-file-name="components/email-analytics.tsx">Delivery Rate</span></p>
              <p className="text-2xl font-bold" data-unique-id="be6e40fe-5479-4072-b41c-ae03a6208cac" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.deliveryRate}<span className="editable-text" data-unique-id="2610c2d4-8159-41b7-b725-70c062922233" data-file-name="components/email-analytics.tsx">%</span></p>
            </div>
          </div>
          
          <div className="border border-border rounded-lg p-4" data-unique-id="1fbdf85f-2602-4e5c-9251-588a1c86cdb2" data-file-name="components/email-analytics.tsx">
            <h3 className="text-sm font-medium mb-4 flex items-center" data-unique-id="88654190-ec78-4989-a5b8-e33dd3513a3d" data-file-name="components/email-analytics.tsx">
              <Calendar className="h-4 w-4 mr-2" data-unique-id="ca4ec9a9-df2a-4f11-afaa-9b1685c2e669" data-file-name="components/email-analytics.tsx" /><span className="editable-text" data-unique-id="299901ce-ca28-4192-a5d0-8865b1e2f7ec" data-file-name="components/email-analytics.tsx"> Daily Email Activity
            </span></h3>
            <div className="h-64 relative" data-unique-id="39fb228a-5601-4ede-adf7-839d6f6cab47" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">
              {/* Simple bar chart visualization */}
              <div className="flex h-full items-end space-x-2" data-unique-id="509ce9f9-819a-4a3d-a8e9-05f05cdad564" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">
                {stats.dailySends.map(day => <div key={day.date} className="flex-1 flex flex-col items-center" data-unique-id="bde05503-3c2a-4337-8b92-edadf616e62e" data-file-name="components/email-analytics.tsx">
                    <div className="w-full flex flex-col items-center space-y-1" data-unique-id="cc1ce79f-7757-4c87-b217-264e40d76d91" data-file-name="components/email-analytics.tsx">
                      <div className="w-full bg-red-200" style={{
                  height: `${day.failed / (day.sent + day.failed) * 100 || 0}%`,
                  minHeight: day.failed > 0 ? '4px' : '0'
                }} data-unique-id="4a70955f-63dc-4910-a4a6-aeb5abd6136e" data-file-name="components/email-analytics.tsx"></div>
                      <div className="w-full bg-blue-400" style={{
                  height: `${day.sent / Math.max(...stats.dailySends.map(d => d.sent + d.failed || 1)) * 100 || 0}%`
                }} data-unique-id="4bc81893-3285-47cb-b5cb-66c06b7f00bb" data-file-name="components/email-analytics.tsx"></div>
                    </div>
                    <p className="text-xs mt-2" data-unique-id="d07d272d-310c-4e4f-9dce-2f276652ec95" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{new Date(day.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}</p>
                  </div>)}
              </div>
              
              <div className="absolute top-2 right-2 flex items-center space-x-4 text-xs" data-unique-id="ad73316b-ce1a-4249-98a4-0386bdbe0f4d" data-file-name="components/email-analytics.tsx">
                <div className="flex items-center" data-unique-id="5afe6ef4-8b8c-4019-a800-bddd1ff8fb6f" data-file-name="components/email-analytics.tsx">
                  <div className="w-3 h-3 bg-blue-400 mr-1" data-unique-id="4903e0f6-7933-4475-884a-6acf635782b7" data-file-name="components/email-analytics.tsx"></div>
                  <span data-unique-id="24053c60-6f17-466d-8a4a-776b9f72f721" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="6f5e5864-9c51-4351-9a04-be664647412c" data-file-name="components/email-analytics.tsx">Successful</span></span>
                </div>
                <div className="flex items-center" data-unique-id="898a8e1d-d122-4c83-b828-f0cbabfe2b82" data-file-name="components/email-analytics.tsx">
                  <div className="w-3 h-3 bg-red-200 mr-1" data-unique-id="43e401b5-6114-44a0-8c78-661761dee082" data-file-name="components/email-analytics.tsx"></div>
                  <span data-unique-id="1d599519-7c80-4a59-9b91-6247883cd6e3" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="cff70bd2-1c0e-42d2-8ab7-ec90fff870f9" data-file-name="components/email-analytics.tsx">Failed</span></span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4" data-unique-id="0a71b7ad-cacb-4ac5-b3b9-8b73cb6c1095" data-file-name="components/email-analytics.tsx">
            <div className="border border-border rounded-lg p-4" data-unique-id="48b49431-edd8-4a65-b842-40abb1723eca" data-file-name="components/email-analytics.tsx">
              <h3 className="text-sm font-medium mb-2" data-unique-id="21d32ddd-5c4e-47ce-ac37-ad30790542e4" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="76e7519c-ad11-484e-9d2a-ec846d750fc4" data-file-name="components/email-analytics.tsx">Top Delivery Issues</span></h3>
              <ul className="space-y-2 text-sm" data-unique-id="dd251091-ffd6-4793-b400-0dfb50a54228" data-file-name="components/email-analytics.tsx">
                <li className="flex justify-between" data-unique-id="8af35abd-256a-41e2-954e-c43336869719" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="03fe4ca2-ed75-48a4-ad1b-1baae6b2bc67" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="09b6e1a2-ef94-4064-aefc-b86d2fa8b6b0" data-file-name="components/email-analytics.tsx">Invalid email address</span></span>
                  <span className="font-medium" data-unique-id="5b06bbb3-3491-4540-8591-669674a490dd" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="213b7b9f-8bc5-4d77-8183-baf58fe58974" data-file-name="components/email-analytics.tsx">42%</span></span>
                </li>
                <li className="flex justify-between" data-unique-id="a033cfe9-eece-4abb-8c4e-d2d524acda96" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="49f3ba7f-b608-49d1-bbb0-0ab844e8c1ba" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="88d242d2-0f87-411e-bbf1-deb6575c31aa" data-file-name="components/email-analytics.tsx">Mailbox full</span></span>
                  <span className="font-medium" data-unique-id="884ca893-3a9f-4a42-a551-d32fabc7e6f9" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="41225cfa-7ffa-4ba5-9d5c-69a5777e6b28" data-file-name="components/email-analytics.tsx">27%</span></span>
                </li>
                <li className="flex justify-between" data-unique-id="af61f009-645a-405a-9ec1-d3f6be421aef" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="3081b657-5b2d-4a45-9d26-563d0c97cd64" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="0d333847-2997-437e-ad2f-1e7d77d3a7ae" data-file-name="components/email-analytics.tsx">Spam filters</span></span>
                  <span className="font-medium" data-unique-id="98644cdc-a22b-48ab-a746-d52f874f27bc" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="5ac7e070-2cfd-48d3-9b12-ce5e3493608c" data-file-name="components/email-analytics.tsx">18%</span></span>
                </li>
                <li className="flex justify-between" data-unique-id="423d2611-1244-429a-8578-46fb7bdc0cdc" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="cb7a3e72-6cc9-43df-9649-84a7d51b7248" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="d1249208-60be-4cda-ad07-71ecc9e8829e" data-file-name="components/email-analytics.tsx">Other</span></span>
                  <span className="font-medium" data-unique-id="06e9dc21-a8e6-4ac0-9946-b101f20e7004" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="5e557ea1-3648-4e1b-b295-94fcc4aaa732" data-file-name="components/email-analytics.tsx">13%</span></span>
                </li>
              </ul>
            </div>
            
            <div className="border border-border rounded-lg p-4" data-unique-id="f7799a51-ffee-44c5-a8df-0f0b61816a1a" data-file-name="components/email-analytics.tsx">
              <h3 className="text-sm font-medium mb-2" data-unique-id="6861e39d-312e-4f6d-ab69-047f048484e0" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="d81aa188-7fa0-40d8-a4b5-f4520856ebd3" data-file-name="components/email-analytics.tsx">Delivery Performance</span></h3>
              <div className="flex items-center justify-center h-32" data-unique-id="780df1cf-0e76-4e7a-afed-b21cff1b9797" data-file-name="components/email-analytics.tsx">
                <div className="relative w-32 h-32" data-unique-id="1930c3ce-9485-4a9c-b6ff-66313646ddf8" data-file-name="components/email-analytics.tsx">
                  <svg viewBox="0 0 100 100" className="w-full h-full" data-unique-id="94569d06-b758-445f-8eb2-0bea7e2284b6" data-file-name="components/email-analytics.tsx">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="15" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="15" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - stats.deliveryRate / 100)} transform="rotate(-90 50 50)" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center" data-unique-id="a97c5998-c090-4484-832c-0748ade4b638" data-file-name="components/email-analytics.tsx">
                    <span className="text-2xl font-bold" data-unique-id="4a631b3c-c937-40a0-a487-15904c37c5fe" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.deliveryRate}<span className="editable-text" data-unique-id="26bbe0a3-e593-498c-a410-6702668f7c5d" data-file-name="components/email-analytics.tsx">%</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>}
    </motion.div>;
}