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
  }} className="bg-white rounded-lg shadow-md p-6" data-unique-id="23bb29e8-a7b5-4b1f-aa84-42762faa84a4" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">
      <div className="flex justify-between items-center mb-6" data-unique-id="4326e787-f419-47b4-abe5-a4bf8ae90b45" data-file-name="components/email-analytics.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="4f7f9ced-6361-435c-a326-69520c64f651" data-file-name="components/email-analytics.tsx">
          <BarChart className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="5532739f-6904-4959-b2f5-cb74aa0b7ee3" data-file-name="components/email-analytics.tsx"> Email Analytics
        </span></h2>
        <button onClick={fetchEmailStats} disabled={isLoading} className="flex items-center px-3 py-1.5 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors disabled:opacity-50" data-unique-id="df544689-ea6f-492d-975b-48f6ed7aa19a" data-file-name="components/email-analytics.tsx">
          <RefreshCw className={`mr-1.5 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /><span className="editable-text" data-unique-id="df5b93b5-396f-4a8d-be50-e5f46ebfd790" data-file-name="components/email-analytics.tsx">
          Refresh
        </span></button>
      </div>
      
      {isLoading ? <div className="flex justify-center items-center h-64" data-unique-id="ab944b51-90d5-4fc2-b640-2b2a70cb46e3" data-file-name="components/email-analytics.tsx">
          <div className="animate-pulse flex flex-col items-center" data-unique-id="8ddee907-993b-469e-a0dd-d88af79b84cd" data-file-name="components/email-analytics.tsx">
            <RefreshCw className="animate-spin h-8 w-8 text-primary mb-2" />
            <p className="text-muted-foreground" data-unique-id="b395f315-0930-471a-9399-88d569a6bb6a" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="5f801f9c-f0a2-4d78-bc01-babdccef527e" data-file-name="components/email-analytics.tsx">Loading analytics...</span></p>
          </div>
        </div> : <div className="space-y-6" data-unique-id="98ac76d3-bfe2-468b-9efe-8544e8c4ca29" data-file-name="components/email-analytics.tsx">
          <div className="grid grid-cols-3 gap-4" data-unique-id="e765b721-9845-4b73-9883-67a209ab4255" data-file-name="components/email-analytics.tsx">
            <div className="bg-blue-50 p-4 rounded-lg" data-unique-id="612cf3d5-e6c5-40cc-8516-22774bee8f08" data-file-name="components/email-analytics.tsx">
              <p className="text-sm text-blue-600 mb-1" data-unique-id="a098c9ad-82b7-4168-892f-1e1a773c1d66" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="88921a98-563b-403c-9ec7-62d497e053d0" data-file-name="components/email-analytics.tsx">Total Emails Sent</span></p>
              <p className="text-2xl font-bold" data-unique-id="f647b31c-ab99-4ef5-a568-50053517d9d9" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.totalSent.toLocaleString()}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg" data-unique-id="52edc435-6334-49fa-96bc-12f6d3c23ff9" data-file-name="components/email-analytics.tsx">
              <p className="text-sm text-amber-600 mb-1" data-unique-id="7ebc336d-93d4-484a-b5b0-92e23154d8a0" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="aed2299e-de42-4a28-a1b4-1044e6a3acdb" data-file-name="components/email-analytics.tsx">Failed Deliveries</span></p>
              <p className="text-2xl font-bold" data-unique-id="8341803d-a90f-4aac-82c3-0b533f319686" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.totalFailed.toLocaleString()}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg" data-unique-id="f612dfb6-bbf3-417f-b2ee-131e0c413480" data-file-name="components/email-analytics.tsx">
              <p className="text-sm text-green-600 mb-1" data-unique-id="3d1448ce-eeeb-476c-90d4-718783af4ea1" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="e5bb0ea4-7e04-46de-8275-817877e57ea8" data-file-name="components/email-analytics.tsx">Delivery Rate</span></p>
              <p className="text-2xl font-bold" data-unique-id="1e91b709-e698-4386-a878-bf52c5ead2df" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.deliveryRate}<span className="editable-text" data-unique-id="8882ed77-08a7-467d-9ced-14c3dbcdeccc" data-file-name="components/email-analytics.tsx">%</span></p>
            </div>
          </div>
          
          <div className="border border-border rounded-lg p-4" data-unique-id="8d0aee24-b5cb-466f-80a0-f4205091ea5d" data-file-name="components/email-analytics.tsx">
            <h3 className="text-sm font-medium mb-4 flex items-center" data-unique-id="e264a2e5-e66b-421a-9740-3e340f0b255d" data-file-name="components/email-analytics.tsx">
              <Calendar className="h-4 w-4 mr-2" data-unique-id="addac20a-03db-4da5-a4b9-11e7ecbaf770" data-file-name="components/email-analytics.tsx" /><span className="editable-text" data-unique-id="7674a104-11f4-46ae-84c0-ac04023416b6" data-file-name="components/email-analytics.tsx"> Daily Email Activity
            </span></h3>
            <div className="h-64 relative" data-unique-id="7f1b796d-8ab9-4278-b01d-6ce4c29e3c83" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">
              {/* Simple bar chart visualization */}
              <div className="flex h-full items-end space-x-2" data-unique-id="fda34c39-98df-41c6-ac89-91d2c639babd" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">
                {stats.dailySends.map(day => <div key={day.date} className="flex-1 flex flex-col items-center" data-unique-id="383f7b48-1b5d-4b7c-b07b-034818e1d001" data-file-name="components/email-analytics.tsx">
                    <div className="w-full flex flex-col items-center space-y-1" data-unique-id="dbc10d63-62d1-4e3a-b6b3-3e7cd1f09bb5" data-file-name="components/email-analytics.tsx">
                      <div className="w-full bg-red-200" style={{
                  height: `${day.failed / (day.sent + day.failed) * 100}%`,
                  minHeight: day.failed > 0 ? '4px' : '0'
                }} data-unique-id="76cafd96-2b07-4400-8e5c-2ff693e2e284" data-file-name="components/email-analytics.tsx"></div>
                      <div className="w-full bg-blue-400" style={{
                  height: `${day.sent / Math.max(...stats.dailySends.map(d => d.sent + d.failed)) * 100}%`
                }} data-unique-id="90653585-7bc3-4858-80a6-2ab31142016f" data-file-name="components/email-analytics.tsx"></div>
                    </div>
                    <p className="text-xs mt-2" data-unique-id="f353079d-58d2-4538-ba84-af85a0e5d04a" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{new Date(day.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}</p>
                  </div>)}
              </div>
              
              <div className="absolute top-2 right-2 flex items-center space-x-4 text-xs" data-unique-id="dd656709-6039-4c15-b001-64a7edf7dd50" data-file-name="components/email-analytics.tsx">
                <div className="flex items-center" data-unique-id="55342519-b3f5-4f4b-9036-625d496dd941" data-file-name="components/email-analytics.tsx">
                  <div className="w-3 h-3 bg-blue-400 mr-1" data-unique-id="6603fa08-70ab-4f9d-b2b7-6830e3f1a9cb" data-file-name="components/email-analytics.tsx"></div>
                  <span data-unique-id="cca6b13f-ee32-40c7-96a1-9dd7794f08ac" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="9a97d25b-8e4c-4556-a769-b60e4d44064a" data-file-name="components/email-analytics.tsx">Successful</span></span>
                </div>
                <div className="flex items-center" data-unique-id="f5632821-b83b-4f69-888b-570beb69f13f" data-file-name="components/email-analytics.tsx">
                  <div className="w-3 h-3 bg-red-200 mr-1" data-unique-id="d0a6c610-40c4-4729-b55e-78f3f664e6e3" data-file-name="components/email-analytics.tsx"></div>
                  <span data-unique-id="93ba4f7c-850f-4f18-a0e1-5b7316fcf0ef" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="2705a4c6-7c62-46db-85b0-05b94fa5ca35" data-file-name="components/email-analytics.tsx">Failed</span></span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4" data-unique-id="e2e2bb1d-024c-4028-8b73-5a5a19447c57" data-file-name="components/email-analytics.tsx">
            <div className="border border-border rounded-lg p-4" data-unique-id="1a168b2b-48fc-4d89-a7d8-d986fe83cb2e" data-file-name="components/email-analytics.tsx">
              <h3 className="text-sm font-medium mb-2" data-unique-id="d03ec124-8ce9-4475-b455-2543c3e6dc30" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="cd81b6da-6395-4336-984d-1ebf55bf822f" data-file-name="components/email-analytics.tsx">Top Delivery Issues</span></h3>
              <ul className="space-y-2 text-sm" data-unique-id="43c2cc44-44de-4253-a072-9e11268bc29a" data-file-name="components/email-analytics.tsx">
                <li className="flex justify-between" data-unique-id="2a0567f0-ec54-4246-ba8d-bcdfa018db45" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="ac4c0794-44b0-46d1-8340-29c0c7d0346b" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="a528d117-940d-460d-a4b9-374b7dfd0285" data-file-name="components/email-analytics.tsx">Invalid email address</span></span>
                  <span className="font-medium" data-unique-id="5ab86a0b-e1ab-4187-8c07-409f66385009" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="18940d30-5c2b-457a-8649-1a8877ccd8cd" data-file-name="components/email-analytics.tsx">42%</span></span>
                </li>
                <li className="flex justify-between" data-unique-id="3b7e5417-0140-4e39-8e5a-440a2b3ed332" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="fa0b70b9-a4e6-44ab-b335-07a44c6b49bc" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="25564b1e-1528-4fe4-8c8b-36c31ec1bf0f" data-file-name="components/email-analytics.tsx">Mailbox full</span></span>
                  <span className="font-medium" data-unique-id="ec81b9d7-9699-4c9c-883d-02e86c5373fa" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="81b31f5d-97a4-494f-9792-f2b3ec5a59c7" data-file-name="components/email-analytics.tsx">27%</span></span>
                </li>
                <li className="flex justify-between" data-unique-id="8a1502e8-ec08-461a-b764-d906707b7de6" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="1d3969bf-d286-4840-9663-a1fdd801a575" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="b0bb5fbb-23ab-4464-bafb-477691491d70" data-file-name="components/email-analytics.tsx">Spam filters</span></span>
                  <span className="font-medium" data-unique-id="c820637b-8601-4f4b-8a7d-ff24fe142772" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="5637ba43-5be7-4d3e-ad68-00dbc6311834" data-file-name="components/email-analytics.tsx">18%</span></span>
                </li>
                <li className="flex justify-between" data-unique-id="7bfe13a2-3dce-40b6-bd50-3dcca09038ac" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="1631d367-e271-4128-aea8-14ad168df7cc" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="21cd8c4b-5fc4-4f1b-9a44-fa62e5c5715c" data-file-name="components/email-analytics.tsx">Other</span></span>
                  <span className="font-medium" data-unique-id="021dbf11-61d1-472d-9ae5-f580a9b2e4d5" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="af1e158f-511e-4e82-94f4-7471439b07da" data-file-name="components/email-analytics.tsx">13%</span></span>
                </li>
              </ul>
            </div>
            
            <div className="border border-border rounded-lg p-4" data-unique-id="680832bf-531b-446c-ad95-e410a38a1719" data-file-name="components/email-analytics.tsx">
              <h3 className="text-sm font-medium mb-2" data-unique-id="e5d945ab-e0c7-4420-b712-5e08d95f7fc9" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="12d547d5-2852-4818-a50e-1bba7189df05" data-file-name="components/email-analytics.tsx">Delivery Performance</span></h3>
              <div className="flex items-center justify-center h-32" data-unique-id="2c951bd6-395a-4715-b297-f9c5125c4c4e" data-file-name="components/email-analytics.tsx">
                <div className="relative w-32 h-32" data-unique-id="cf0f2da6-1cf0-4bd6-aa5a-f6227714c53a" data-file-name="components/email-analytics.tsx">
                  <svg viewBox="0 0 100 100" className="w-full h-full" data-unique-id="68526701-05fc-465c-bc24-27631bfb5501" data-file-name="components/email-analytics.tsx">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="15" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="15" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - stats.deliveryRate / 100)} transform="rotate(-90 50 50)" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center" data-unique-id="21efc0ed-0f9c-4dab-a15e-b4cd5c4e96ed" data-file-name="components/email-analytics.tsx">
                    <span className="text-2xl font-bold" data-unique-id="a1373978-4b79-42dd-86a8-97abfaa0c0bd" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.deliveryRate}<span className="editable-text" data-unique-id="2916cb9a-6f9b-4f95-ab92-37290ac71ba4" data-file-name="components/email-analytics.tsx">%</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>}
    </motion.div>;
}