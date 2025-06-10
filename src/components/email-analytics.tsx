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
  }} className="bg-card rounded-lg shadow-md p-6" data-unique-id="aec876c6-ceae-4fa9-9433-9ed99b3eac53" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">
      <div className="flex justify-between items-center mb-6" data-unique-id="ce988e10-18c7-44c3-b588-530231bd22eb" data-file-name="components/email-analytics.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="cc6b0ff6-5b98-4454-b538-a80e921c7133" data-file-name="components/email-analytics.tsx">
          <BarChart className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="25cdb6e4-db27-4414-bb1b-00b20bc8d14b" data-file-name="components/email-analytics.tsx"> Email Analytics
        </span></h2>
        <button onClick={fetchEmailStats} disabled={isLoading} className="flex items-center px-3 py-1.5 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors disabled:opacity-50" data-unique-id="3864cfa2-16f8-411e-9d06-6de562e9e70a" data-file-name="components/email-analytics.tsx">
          <RefreshCw className={`mr-1.5 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /><span className="editable-text" data-unique-id="5da916f3-ff01-4392-aa79-55a688cd28a2" data-file-name="components/email-analytics.tsx">
          Refresh
        </span></button>
      </div>
      
      {isLoading ? <div className="flex justify-center items-center h-64" data-unique-id="18caea80-55c2-495b-9a10-9370d0077933" data-file-name="components/email-analytics.tsx">
          <div className="animate-pulse flex flex-col items-center" data-unique-id="ca6f1deb-3a62-4574-8b97-5b50dee878ad" data-file-name="components/email-analytics.tsx">
            <RefreshCw className="animate-spin h-8 w-8 text-primary mb-2" />
            <p className="text-muted-foreground" data-unique-id="918dfd41-e2d8-46da-ad20-a1746aae4913" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="0e6c7b44-b3ce-4628-ba86-4591db07b176" data-file-name="components/email-analytics.tsx">Loading analytics...</span></p>
          </div>
        </div> : <div className="space-y-6" data-unique-id="08f17c20-906a-4b39-aeab-49770e4c60da" data-file-name="components/email-analytics.tsx">
          <div className="grid grid-cols-3 gap-4" data-unique-id="584f809b-5dfd-4eae-a54d-691d5b9df149" data-file-name="components/email-analytics.tsx">
            <div className="bg-blue-50 p-4 rounded-lg" data-unique-id="365c7a5b-d54a-49f8-a185-f9de7860bf09" data-file-name="components/email-analytics.tsx">
              <p className="text-sm text-blue-600 mb-1" data-unique-id="44ca9b49-263a-4036-ac85-2d26a07493a8" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="fac42082-afaa-4f2d-aa55-1773149adde6" data-file-name="components/email-analytics.tsx">Total Emails Sent</span></p>
              <p className="text-2xl font-bold" data-unique-id="6071eb96-25cf-40d2-a982-e8e54794c550" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.totalSent.toLocaleString()}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg" data-unique-id="24c21f1b-63d2-45f9-81a6-46713398e4f3" data-file-name="components/email-analytics.tsx">
              <p className="text-sm text-amber-600 mb-1" data-unique-id="2fbadbd6-e743-41ff-aeb3-b00d44dab391" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="f66102ab-b3d8-4ee3-a500-1cfa6ec8b7d1" data-file-name="components/email-analytics.tsx">Failed Deliveries</span></p>
              <p className="text-2xl font-bold" data-unique-id="7a519e8c-e4f5-4522-bdd9-a1658f2336c0" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.totalFailed.toLocaleString()}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg" data-unique-id="1473d112-d2e0-457b-8ecf-3ad4e549911f" data-file-name="components/email-analytics.tsx">
              <p className="text-sm text-green-600 mb-1" data-unique-id="5ba2ecd7-7168-4d9a-9882-9e79e671b93a" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="9169ebc7-75f8-436b-b100-7a4448261b2c" data-file-name="components/email-analytics.tsx">Delivery Rate</span></p>
              <p className="text-2xl font-bold" data-unique-id="3c190e62-c53c-413f-b122-bb91098c4472" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.deliveryRate}<span className="editable-text" data-unique-id="aad497c4-65e9-4dcb-a632-e36989398f4f" data-file-name="components/email-analytics.tsx">%</span></p>
            </div>
          </div>
          
          <div className="border border-border rounded-lg p-4" data-unique-id="1c37d41e-b360-4eca-9fe8-8d20b60e830d" data-file-name="components/email-analytics.tsx">
            <h3 className="text-sm font-medium mb-4 flex items-center" data-unique-id="b766c0f5-3172-4f64-b634-f24d6662fdd0" data-file-name="components/email-analytics.tsx">
              <Calendar className="h-4 w-4 mr-2" data-unique-id="cc0d6041-9562-48af-aa5d-a4c68a9d9f06" data-file-name="components/email-analytics.tsx" /><span className="editable-text" data-unique-id="c50f8317-a8ab-468d-ba6c-dedf6fca08aa" data-file-name="components/email-analytics.tsx"> Daily Email Activity
            </span></h3>
            <div className="h-64 relative" data-unique-id="9c36f9ef-2f42-4559-95cc-afa4037ba655" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">
              {/* Simple bar chart visualization */}
              <div className="flex h-full items-end space-x-2" data-unique-id="a9e01431-0730-464a-a88a-b44d4c6bf300" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">
                {stats.dailySends.map(day => <div key={day.date} className="flex-1 flex flex-col items-center" data-unique-id="49fafb6b-2265-4650-8afe-c2f71fa707e9" data-file-name="components/email-analytics.tsx">
                    <div className="w-full flex flex-col items-center space-y-1" data-unique-id="ac1c9c06-d713-4eb5-a2b2-687b7e291947" data-file-name="components/email-analytics.tsx">
                      <div className="w-full bg-red-200" style={{
                  height: `${day.failed / (day.sent + day.failed) * 100 || 0}%`,
                  minHeight: day.failed > 0 ? '4px' : '0'
                }} data-unique-id="de5b522a-d889-4460-b496-dad3fa1743d3" data-file-name="components/email-analytics.tsx"></div>
                      <div className="w-full bg-blue-400" style={{
                  height: `${day.sent / Math.max(...stats.dailySends.map(d => d.sent + d.failed || 1)) * 100 || 0}%`
                }} data-unique-id="8276f764-06a5-4dad-92f0-a96af31edf32" data-file-name="components/email-analytics.tsx"></div>
                    </div>
                    <p className="text-xs mt-2" data-unique-id="20b066aa-80ad-470a-be7e-acf7a7c49024" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{new Date(day.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}</p>
                  </div>)}
              </div>
              
              <div className="absolute top-2 right-2 flex items-center space-x-4 text-xs" data-unique-id="3cf00485-7b1b-42a0-b31d-103aa6d9dd1b" data-file-name="components/email-analytics.tsx">
                <div className="flex items-center" data-unique-id="a7284509-d143-4f2b-8ff1-77cc2de8dafe" data-file-name="components/email-analytics.tsx">
                  <div className="w-3 h-3 bg-blue-400 mr-1" data-unique-id="87aa7acd-faf7-4ca9-bbf5-d9a7e6678c11" data-file-name="components/email-analytics.tsx"></div>
                  <span data-unique-id="6ac50e1a-0472-4fb0-9e18-ff1241bd087d" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="717c9d7d-31cf-4391-8b65-030d2431aead" data-file-name="components/email-analytics.tsx">Successful</span></span>
                </div>
                <div className="flex items-center" data-unique-id="81f76325-460e-4ed0-b145-762587b457ff" data-file-name="components/email-analytics.tsx">
                  <div className="w-3 h-3 bg-red-200 mr-1" data-unique-id="20596ef3-b37d-4c38-aa01-2526e0e4ff44" data-file-name="components/email-analytics.tsx"></div>
                  <span data-unique-id="513f137f-2809-4475-8f41-6b6731fcfe07" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="2c6cdc9f-40fe-41fe-bcf1-53c65ee0e343" data-file-name="components/email-analytics.tsx">Failed</span></span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4" data-unique-id="f02de18c-8842-454f-8504-1744570bf75a" data-file-name="components/email-analytics.tsx">
            <div className="border border-border rounded-lg p-4" data-unique-id="b8a71c45-700f-41e5-a744-1770654e6afa" data-file-name="components/email-analytics.tsx">
              <h3 className="text-sm font-medium mb-2" data-unique-id="2ca29f2f-53bb-47d5-998f-b3f942005052" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="55f46e93-dc1d-4f77-bdff-4ee0978954c3" data-file-name="components/email-analytics.tsx">Top Delivery Issues</span></h3>
              <ul className="space-y-2 text-sm" data-unique-id="8fd50489-7d93-4d00-ae4a-738c58d11b66" data-file-name="components/email-analytics.tsx">
                <li className="flex justify-between" data-unique-id="ea2df132-2680-4583-b64f-61d04543189e" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="8f54f196-a0ab-4318-9bfc-74606e418e9a" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="365285e3-e3a6-485e-9157-ce66081fbf37" data-file-name="components/email-analytics.tsx">Invalid email address</span></span>
                  <span className="font-medium" data-unique-id="17d62925-f784-45dc-af8c-4f01f1333c3e" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="672babb3-faa4-4c8e-99b2-8dd24b41c925" data-file-name="components/email-analytics.tsx">42%</span></span>
                </li>
                <li className="flex justify-between" data-unique-id="9594fb45-2c53-4a3b-856b-c2f40f282b1d" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="0d582751-0438-402d-9106-3290a63ba6a2" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="72fce640-1e06-4d4e-854c-b67f7940bf57" data-file-name="components/email-analytics.tsx">Mailbox full</span></span>
                  <span className="font-medium" data-unique-id="76708c9d-28c5-4cc8-a8ed-67e925c3537e" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="369b2d7d-02c4-4a01-bab2-6370bd6ca18c" data-file-name="components/email-analytics.tsx">27%</span></span>
                </li>
                <li className="flex justify-between" data-unique-id="76bfec13-f6f8-41b1-b698-70d75b041e20" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="6cc5a6c5-62ba-474a-975f-e9e787cafed9" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="025aebfb-be2f-4105-abb2-e21a8a9ed1f0" data-file-name="components/email-analytics.tsx">Spam filters</span></span>
                  <span className="font-medium" data-unique-id="e090e79d-155c-4c09-90e5-1f64a2ce544d" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="75bda349-e334-41f4-9054-167a3455c2dc" data-file-name="components/email-analytics.tsx">18%</span></span>
                </li>
                <li className="flex justify-between" data-unique-id="8d409997-ce6a-4d94-9531-4ffbb739e044" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="b5d3b1c2-9065-49e3-af78-712ea2bccf21" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="bbaf5ff2-30c5-4fca-b90d-c2b0f0f04557" data-file-name="components/email-analytics.tsx">Other</span></span>
                  <span className="font-medium" data-unique-id="90bfb6e5-f19c-4c95-a1bf-ddfd6b4dd802" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="67f016f5-a3c1-4a5d-82b9-2b1f5a00212e" data-file-name="components/email-analytics.tsx">13%</span></span>
                </li>
              </ul>
            </div>
            
            <div className="border border-border rounded-lg p-4" data-unique-id="e416298e-44f8-4646-95b6-d2dc7c2aa7c7" data-file-name="components/email-analytics.tsx">
              <h3 className="text-sm font-medium mb-2" data-unique-id="73a84986-529d-4d31-a825-dc13e4212191" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="f2ca7f08-3169-408a-b2db-cb8e46ba4e17" data-file-name="components/email-analytics.tsx">Delivery Performance</span></h3>
              <div className="flex items-center justify-center h-32" data-unique-id="8e90dfc5-a0b5-470b-beb8-f9406fedd217" data-file-name="components/email-analytics.tsx">
                <div className="relative w-32 h-32" data-unique-id="d1da30da-84a4-4b2b-b632-202807524881" data-file-name="components/email-analytics.tsx">
                  <svg viewBox="0 0 100 100" className="w-full h-full" data-unique-id="cb646cc5-082c-48b2-834e-63c18af80dc1" data-file-name="components/email-analytics.tsx">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="15" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="15" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - stats.deliveryRate / 100)} transform="rotate(-90 50 50)" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center" data-unique-id="044a0cf7-3fa2-40ff-b141-e7863c880c99" data-file-name="components/email-analytics.tsx">
                    <span className="text-2xl font-bold" data-unique-id="e3d6a9c9-15be-49ca-9a8d-38d64aa11c03" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.deliveryRate}<span className="editable-text" data-unique-id="54d920d1-7c88-42a5-a3ef-3a0d9e05f2a4" data-file-name="components/email-analytics.tsx">%</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>}
    </motion.div>;
}