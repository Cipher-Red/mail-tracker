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
  }} className="bg-card rounded-lg shadow-md p-6" data-unique-id="eb926a4b-1ac6-4447-b779-29b09d9b9232" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">
      <div className="flex justify-between items-center mb-6" data-unique-id="a53ad93f-2f34-440d-964f-0d951b43df1d" data-file-name="components/email-analytics.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="35daf1d6-d9b0-424c-a52f-0f6d7226fc4d" data-file-name="components/email-analytics.tsx">
          <BarChart className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="539c6bb5-53ff-475f-af1b-7cd535e6ba82" data-file-name="components/email-analytics.tsx"> Email Analytics
        </span></h2>
        <button onClick={fetchEmailStats} disabled={isLoading} className="flex items-center px-3 py-1.5 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors disabled:opacity-50" data-unique-id="43276079-5909-4d9a-81f8-2963e8d1361f" data-file-name="components/email-analytics.tsx">
          <RefreshCw className={`mr-1.5 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /><span className="editable-text" data-unique-id="e478a086-1823-40b3-a35e-b3574043602f" data-file-name="components/email-analytics.tsx">
          Refresh
        </span></button>
      </div>
      
      {isLoading ? <div className="flex justify-center items-center h-64" data-unique-id="ec45705e-8d3c-47bd-a8a1-86053f9d704a" data-file-name="components/email-analytics.tsx">
          <div className="animate-pulse flex flex-col items-center" data-unique-id="79a2fb4b-75e2-46e7-9d61-bafd3b4d5948" data-file-name="components/email-analytics.tsx">
            <RefreshCw className="animate-spin h-8 w-8 text-primary mb-2" />
            <p className="text-muted-foreground" data-unique-id="a0c2712b-d3c8-4d29-a94c-1991429bfc81" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="e6b60a30-0a97-4975-ad74-ea0dfa09f074" data-file-name="components/email-analytics.tsx">Loading analytics...</span></p>
          </div>
        </div> : <div className="space-y-6" data-unique-id="5bdc1cb8-32ad-4a61-ada7-fb0e14766f4a" data-file-name="components/email-analytics.tsx">
          <div className="grid grid-cols-3 gap-4" data-unique-id="60ccbb96-1349-4962-b005-d88cadb01e2b" data-file-name="components/email-analytics.tsx">
            <div className="bg-blue-50 p-4 rounded-lg" data-unique-id="b49527fa-272d-4466-bd47-98a6278936a6" data-file-name="components/email-analytics.tsx">
              <p className="text-sm text-blue-600 mb-1" data-unique-id="bd3d0024-c617-4111-91fc-fee166c84753" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="8bb5b461-dc24-4c80-883a-5432b6c43665" data-file-name="components/email-analytics.tsx">Total Emails Sent</span></p>
              <p className="text-2xl font-bold" data-unique-id="566b0435-1a1f-4191-bb69-3bdfaeaf663f" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.totalSent.toLocaleString()}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg" data-unique-id="3bcad3b4-0d7f-418c-8d5c-7d1997acf047" data-file-name="components/email-analytics.tsx">
              <p className="text-sm text-amber-600 mb-1" data-unique-id="9808e530-8cc2-415c-b914-8cf45770e7c3" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="9c976d5a-4d7c-453e-8341-fba2c470375f" data-file-name="components/email-analytics.tsx">Failed Deliveries</span></p>
              <p className="text-2xl font-bold" data-unique-id="57ceb184-f942-409e-b5c4-a6fde799a62a" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.totalFailed.toLocaleString()}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg" data-unique-id="aedfd204-b43b-4a62-9fc9-f957076b73d4" data-file-name="components/email-analytics.tsx">
              <p className="text-sm text-green-600 mb-1" data-unique-id="26b560b6-7a45-4933-a125-18083eb01c34" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="a7b176cf-037f-4fe4-9e9a-2b0e774de2a6" data-file-name="components/email-analytics.tsx">Delivery Rate</span></p>
              <p className="text-2xl font-bold" data-unique-id="982b9643-150a-4eef-91ef-250e11a76065" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.deliveryRate}<span className="editable-text" data-unique-id="67ea8fce-8223-4900-a242-5a1d1298f86c" data-file-name="components/email-analytics.tsx">%</span></p>
            </div>
          </div>
          
          <div className="border border-border rounded-lg p-4" data-unique-id="d0cd20ea-bdb5-4822-91bc-506772371a35" data-file-name="components/email-analytics.tsx">
            <h3 className="text-sm font-medium mb-4 flex items-center" data-unique-id="c98e4951-3017-4a1a-8fa1-fc499f306ed3" data-file-name="components/email-analytics.tsx">
              <Calendar className="h-4 w-4 mr-2" data-unique-id="5070920b-ae64-4eaf-8c29-47a2e6a47197" data-file-name="components/email-analytics.tsx" /><span className="editable-text" data-unique-id="0b996479-e881-42f7-9af8-436279bee3b2" data-file-name="components/email-analytics.tsx"> Daily Email Activity
            </span></h3>
            <div className="h-64 relative" data-unique-id="e88b994a-ae8e-4adf-8aa5-1fadb92c70dd" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">
              {/* Simple bar chart visualization */}
              <div className="flex h-full items-end space-x-2" data-unique-id="3fb836ed-3120-4280-af40-efee4e629479" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">
                {stats.dailySends.map(day => <div key={day.date} className="flex-1 flex flex-col items-center" data-unique-id="f7b2973c-8ecb-42c4-8588-c04d378dd16a" data-file-name="components/email-analytics.tsx">
                    <div className="w-full flex flex-col items-center space-y-1" data-unique-id="1a3ee1eb-2c1c-49c6-b10a-b6636b054535" data-file-name="components/email-analytics.tsx">
                      <div className="w-full bg-red-200" style={{
                  height: `${day.failed / (day.sent + day.failed) * 100 || 0}%`,
                  minHeight: day.failed > 0 ? '4px' : '0'
                }} data-unique-id="8398592e-72a5-47f0-a8c4-66bfad76a351" data-file-name="components/email-analytics.tsx"></div>
                      <div className="w-full bg-blue-400" style={{
                  height: `${day.sent / Math.max(...stats.dailySends.map(d => d.sent + d.failed || 1)) * 100 || 0}%`
                }} data-unique-id="a7e35c9a-3198-4c96-875e-6a3473612c23" data-file-name="components/email-analytics.tsx"></div>
                    </div>
                    <p className="text-xs mt-2" data-unique-id="2e0f53b7-e766-4590-b07a-ec9983bcdf03" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{new Date(day.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}</p>
                  </div>)}
              </div>
              
              <div className="absolute top-2 right-2 flex items-center space-x-4 text-xs" data-unique-id="ff14fb7f-15ab-4eb7-abf8-5630d961150a" data-file-name="components/email-analytics.tsx">
                <div className="flex items-center" data-unique-id="9b313068-c801-4344-8b30-a21f3ed194e5" data-file-name="components/email-analytics.tsx">
                  <div className="w-3 h-3 bg-blue-400 mr-1" data-unique-id="4df7f564-b957-479f-8db5-81526609ebac" data-file-name="components/email-analytics.tsx"></div>
                  <span data-unique-id="3cf15368-947b-430a-beeb-b00dcaf0e46a" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="c120ed46-625a-478a-a27c-c590dd85a0f6" data-file-name="components/email-analytics.tsx">Successful</span></span>
                </div>
                <div className="flex items-center" data-unique-id="a3baefad-41a1-445d-9393-6011430f612f" data-file-name="components/email-analytics.tsx">
                  <div className="w-3 h-3 bg-red-200 mr-1" data-unique-id="11861a14-962c-4dba-96ec-d1233ae403e7" data-file-name="components/email-analytics.tsx"></div>
                  <span data-unique-id="770be962-a278-43a7-97d1-2f411b6bd2d3" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="bd828b0f-2a39-41a5-a671-ac7f347a272a" data-file-name="components/email-analytics.tsx">Failed</span></span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4" data-unique-id="5b641956-8ed1-4ce5-84d2-838f78aa377d" data-file-name="components/email-analytics.tsx">
            <div className="border border-border rounded-lg p-4" data-unique-id="d3831b3d-da27-42c9-8efc-3da5bfaebfaf" data-file-name="components/email-analytics.tsx">
              <h3 className="text-sm font-medium mb-2" data-unique-id="43f2f31b-a44e-4f8f-b89a-3d9dcaab933b" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="930689b0-ea84-41be-9951-cdd4cb02ea11" data-file-name="components/email-analytics.tsx">Top Delivery Issues</span></h3>
              <ul className="space-y-2 text-sm" data-unique-id="3a899147-2584-4a96-9721-36f32a8f9dec" data-file-name="components/email-analytics.tsx">
                <li className="flex justify-between" data-unique-id="22ca62d4-86b0-4d40-a789-ba598951a67f" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="fc70fe76-b394-4b30-a4a3-8150f479b5d4" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="3703618b-ff61-4235-918e-a40fc12e6af8" data-file-name="components/email-analytics.tsx">Invalid email address</span></span>
                  <span className="font-medium" data-unique-id="9e207a1e-f1a0-4242-afa3-9f2c5b0db2f7" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="1ae4437c-5830-460b-973e-78a21a51aae8" data-file-name="components/email-analytics.tsx">42%</span></span>
                </li>
                <li className="flex justify-between" data-unique-id="8f34b081-3de2-4751-84de-d54b049d68b8" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="3fb8638b-35db-47e9-9f35-2e07113dc17b" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="30eee964-dd87-44c9-be50-f44ed14d7d5e" data-file-name="components/email-analytics.tsx">Mailbox full</span></span>
                  <span className="font-medium" data-unique-id="b3f8969d-44ba-405e-a3d7-2afa92763a0d" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="abc6beaa-3b48-4560-aeff-e162212ecf64" data-file-name="components/email-analytics.tsx">27%</span></span>
                </li>
                <li className="flex justify-between" data-unique-id="b55dc763-8e5e-4ea0-9553-1a7712a0e1f2" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="cf07299e-c443-4ed0-8e45-0e2f0f4811f6" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="eca72657-6cc8-475e-8b61-e5bc3f333ada" data-file-name="components/email-analytics.tsx">Spam filters</span></span>
                  <span className="font-medium" data-unique-id="96b81a09-6ca9-450e-9ac0-2d6be9b0d4c5" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="0b6d1f4d-b72a-4d3d-9a9d-bb073d6177b6" data-file-name="components/email-analytics.tsx">18%</span></span>
                </li>
                <li className="flex justify-between" data-unique-id="29025a05-5d1e-4898-8ec1-30a80dce4f53" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="3f1c4ad6-79c3-4be5-9a44-c53fe8bf9ead" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="f056a4fd-1e13-43c6-ae33-7d95142f2a98" data-file-name="components/email-analytics.tsx">Other</span></span>
                  <span className="font-medium" data-unique-id="16d21c0a-9f94-46e6-935c-acec98dd5305" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="d1099b85-23bf-4e91-8928-03add3f5c804" data-file-name="components/email-analytics.tsx">13%</span></span>
                </li>
              </ul>
            </div>
            
            <div className="border border-border rounded-lg p-4" data-unique-id="85a13e23-4093-43a3-b56f-b25bf17c3c22" data-file-name="components/email-analytics.tsx">
              <h3 className="text-sm font-medium mb-2" data-unique-id="80d3135c-737c-4173-bbbb-255612407404" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="f4e996e1-e7c0-45e7-8a0b-38f0287afe5c" data-file-name="components/email-analytics.tsx">Delivery Performance</span></h3>
              <div className="flex items-center justify-center h-32" data-unique-id="c793bd67-d11c-4a76-9951-4020b2c954b5" data-file-name="components/email-analytics.tsx">
                <div className="relative w-32 h-32" data-unique-id="8e073c68-b035-4ab4-9b4b-dc1dd0cb0d69" data-file-name="components/email-analytics.tsx">
                  <svg viewBox="0 0 100 100" className="w-full h-full" data-unique-id="81fc3b4b-73a5-42bc-b47e-5af7aa22fda9" data-file-name="components/email-analytics.tsx">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="15" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="15" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - stats.deliveryRate / 100)} transform="rotate(-90 50 50)" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center" data-unique-id="b480b156-efa9-4328-a0fc-002733ee07dc" data-file-name="components/email-analytics.tsx">
                    <span className="text-2xl font-bold" data-unique-id="fb7aa220-a294-489f-90db-393120aa2174" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.deliveryRate}<span className="editable-text" data-unique-id="d6e908e7-12d1-4761-a23d-9f58373f7151" data-file-name="components/email-analytics.tsx">%</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>}
    </motion.div>;
}