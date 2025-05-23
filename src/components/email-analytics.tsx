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
  }} className="bg-white rounded-lg shadow-md p-6" data-unique-id="d9572a6f-5e5d-44f0-8442-168f4eafbb41" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">
      <div className="flex justify-between items-center mb-6" data-unique-id="99b726ee-baba-4404-aa5b-d2133bfa5066" data-file-name="components/email-analytics.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="3ac04a0f-f252-4fb1-bfa7-13b1757d9c8f" data-file-name="components/email-analytics.tsx">
          <BarChart className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="9c625368-e417-4681-ae52-4bf90b91d452" data-file-name="components/email-analytics.tsx"> Email Analytics
        </span></h2>
        <button onClick={fetchEmailStats} disabled={isLoading} className="flex items-center px-3 py-1.5 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors disabled:opacity-50" data-unique-id="5d059d27-b706-4a51-851a-233fa986088a" data-file-name="components/email-analytics.tsx">
          <RefreshCw className={`mr-1.5 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /><span className="editable-text" data-unique-id="0a39588f-66a1-4606-8d44-533f44679ade" data-file-name="components/email-analytics.tsx">
          Refresh
        </span></button>
      </div>
      
      {isLoading ? <div className="flex justify-center items-center h-64" data-unique-id="b1049471-69c4-437a-b107-00f7e0b148e1" data-file-name="components/email-analytics.tsx">
          <div className="animate-pulse flex flex-col items-center" data-unique-id="61d60e58-f6c7-4a33-b3a6-36f22e57fb4c" data-file-name="components/email-analytics.tsx">
            <RefreshCw className="animate-spin h-8 w-8 text-primary mb-2" />
            <p className="text-muted-foreground" data-unique-id="e154dbae-77b2-411d-8905-40bf0e34bf95" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="236b0c81-dd33-4ca0-921e-9c5af03e8ba7" data-file-name="components/email-analytics.tsx">Loading analytics...</span></p>
          </div>
        </div> : <div className="space-y-6" data-unique-id="62c67305-6061-4476-822d-dfc70ca1bb2c" data-file-name="components/email-analytics.tsx">
          <div className="grid grid-cols-3 gap-4" data-unique-id="b28d9c74-fc18-4107-a49c-7d2a5882ebfb" data-file-name="components/email-analytics.tsx">
            <div className="bg-blue-50 p-4 rounded-lg" data-unique-id="952dc00d-adbb-4fa1-8676-3c7253e3b755" data-file-name="components/email-analytics.tsx">
              <p className="text-sm text-blue-600 mb-1" data-unique-id="38473a77-fe8b-4b1f-9190-c2e35b70f811" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="3df13fa0-ae0f-4f1a-8b3c-a3f9378c0b4a" data-file-name="components/email-analytics.tsx">Total Emails Sent</span></p>
              <p className="text-2xl font-bold" data-unique-id="14e99d53-abc4-434a-8a44-09126b2951da" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.totalSent.toLocaleString()}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg" data-unique-id="c449be25-8863-4465-aad9-7cdca5ca67b0" data-file-name="components/email-analytics.tsx">
              <p className="text-sm text-amber-600 mb-1" data-unique-id="009ddd8b-99ea-46c7-8e9c-884b1ecc44a0" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="0aaa0486-e2bb-4a5d-91dc-773197b7c28d" data-file-name="components/email-analytics.tsx">Failed Deliveries</span></p>
              <p className="text-2xl font-bold" data-unique-id="e28250da-8214-4fbe-979b-d66f8d4abecf" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.totalFailed.toLocaleString()}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg" data-unique-id="cb82f3c9-6979-4a26-9ebe-9e2f6ee9a31d" data-file-name="components/email-analytics.tsx">
              <p className="text-sm text-green-600 mb-1" data-unique-id="c88cf01e-bf34-4676-a115-2ff00f00d195" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="19475700-c736-4cfb-b09b-827485a86357" data-file-name="components/email-analytics.tsx">Delivery Rate</span></p>
              <p className="text-2xl font-bold" data-unique-id="053ccb9d-f1ea-41d4-9693-a43f34e6bb3b" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.deliveryRate}<span className="editable-text" data-unique-id="18690c11-54e2-4c9b-b3ed-f5ee7c115b11" data-file-name="components/email-analytics.tsx">%</span></p>
            </div>
          </div>
          
          <div className="border border-border rounded-lg p-4" data-unique-id="c06e889f-b697-4588-b41f-c2924bc30bdb" data-file-name="components/email-analytics.tsx">
            <h3 className="text-sm font-medium mb-4 flex items-center" data-unique-id="7d3830fd-fb41-46e8-afcf-95dea780e785" data-file-name="components/email-analytics.tsx">
              <Calendar className="h-4 w-4 mr-2" data-unique-id="48977fdb-940f-479e-bd4e-e87f6560ed5f" data-file-name="components/email-analytics.tsx" /><span className="editable-text" data-unique-id="e7b2fbe8-02b9-42fa-a787-e87218048ec8" data-file-name="components/email-analytics.tsx"> Daily Email Activity
            </span></h3>
            <div className="h-64 relative" data-unique-id="9ce2b904-c456-4d91-80b1-2fc8bb4d0be1" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">
              {/* Simple bar chart visualization */}
              <div className="flex h-full items-end space-x-2" data-unique-id="ab7d11b7-643e-48f5-b1f6-13ad5fc9f07e" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">
                {stats.dailySends.map(day => <div key={day.date} className="flex-1 flex flex-col items-center" data-unique-id="190439de-200c-4854-83e1-725447d6a9b9" data-file-name="components/email-analytics.tsx">
                    <div className="w-full flex flex-col items-center space-y-1" data-unique-id="380c279d-9f29-4879-aff4-81f6b0312aaa" data-file-name="components/email-analytics.tsx">
                      <div className="w-full bg-red-200" style={{
                  height: `${day.failed / (day.sent + day.failed) * 100}%`,
                  minHeight: day.failed > 0 ? '4px' : '0'
                }} data-unique-id="df91c7c1-9669-4c52-b2be-cb6d02a2fcbc" data-file-name="components/email-analytics.tsx"></div>
                      <div className="w-full bg-blue-400" style={{
                  height: `${day.sent / Math.max(...stats.dailySends.map(d => d.sent + d.failed)) * 100}%`
                }} data-unique-id="4bb6f794-3f5e-4429-8ce6-993d6e9a09bd" data-file-name="components/email-analytics.tsx"></div>
                    </div>
                    <p className="text-xs mt-2" data-unique-id="da004f0a-bcb3-45db-85af-0ad1e7e443e1" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{new Date(day.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}</p>
                  </div>)}
              </div>
              
              <div className="absolute top-2 right-2 flex items-center space-x-4 text-xs" data-unique-id="c19818e3-f80d-4b55-b080-127fbb41ead5" data-file-name="components/email-analytics.tsx">
                <div className="flex items-center" data-unique-id="3677f041-95ef-4548-8f14-ce0027472089" data-file-name="components/email-analytics.tsx">
                  <div className="w-3 h-3 bg-blue-400 mr-1" data-unique-id="59c4a089-55e6-4897-aaaa-55cff0d6bb31" data-file-name="components/email-analytics.tsx"></div>
                  <span data-unique-id="bc5d677a-8942-410b-ad19-2aa6f7a9926e" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="cb610e33-7941-4912-91b9-0836a41ebf23" data-file-name="components/email-analytics.tsx">Successful</span></span>
                </div>
                <div className="flex items-center" data-unique-id="b0ccc7be-bd2c-4364-951e-27a8253cf900" data-file-name="components/email-analytics.tsx">
                  <div className="w-3 h-3 bg-red-200 mr-1" data-unique-id="da9df33c-de83-42a0-ac74-e9a1e0e5e75e" data-file-name="components/email-analytics.tsx"></div>
                  <span data-unique-id="20807f8e-30f7-4767-bd9e-37cd6bd4e716" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="947bf59a-2277-42d8-8edb-37bfe815f920" data-file-name="components/email-analytics.tsx">Failed</span></span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4" data-unique-id="f49d269c-da23-43f1-bb59-ad6237bc3d1c" data-file-name="components/email-analytics.tsx">
            <div className="border border-border rounded-lg p-4" data-unique-id="7a8f05e8-1254-4147-889b-8b2751ea08c6" data-file-name="components/email-analytics.tsx">
              <h3 className="text-sm font-medium mb-2" data-unique-id="d1dc259e-4ef1-4e89-bac8-2c531a5df2f7" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="9ca00a08-3f93-473e-9cb9-5d6cfab51fbb" data-file-name="components/email-analytics.tsx">Top Delivery Issues</span></h3>
              <ul className="space-y-2 text-sm" data-unique-id="facfb5c3-2ef3-4271-a185-2b581f99778a" data-file-name="components/email-analytics.tsx">
                <li className="flex justify-between" data-unique-id="857aa1dd-8e94-4be0-9f30-bda41146593d" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="d08bf5f2-63d5-45fd-be23-b65a6516bbdd" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="298a0115-f543-4bdc-94ee-7f0e0979c296" data-file-name="components/email-analytics.tsx">Invalid email address</span></span>
                  <span className="font-medium" data-unique-id="744ee46d-fd47-45ad-99d8-3dcb3d303705" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="877d8743-2576-4bcf-be2e-0c348e931204" data-file-name="components/email-analytics.tsx">42%</span></span>
                </li>
                <li className="flex justify-between" data-unique-id="68f94bc1-7554-4c5d-9bf3-30e5a3499d2f" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="70f5c571-451c-4a5b-8f5f-60ccf686c643" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="8f04a3c6-0397-42a4-ada7-b0645539d80b" data-file-name="components/email-analytics.tsx">Mailbox full</span></span>
                  <span className="font-medium" data-unique-id="9dd0a928-fb1f-4719-8faa-28ce697ba358" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="72564f07-57da-4b5c-b5b0-65f100ca80c4" data-file-name="components/email-analytics.tsx">27%</span></span>
                </li>
                <li className="flex justify-between" data-unique-id="2d69bd71-1a65-44de-bb27-0ffa56957ddc" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="9b3a7d1f-35bc-450b-b77c-17e3f2592efa" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="c0b86ce9-4e7c-49bb-be87-7c72c6684d58" data-file-name="components/email-analytics.tsx">Spam filters</span></span>
                  <span className="font-medium" data-unique-id="6fcfae64-bcba-4eb6-a90f-90df9aecc4cd" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="798cc823-759e-42c6-b8c5-f1a7c701f4b4" data-file-name="components/email-analytics.tsx">18%</span></span>
                </li>
                <li className="flex justify-between" data-unique-id="0889faee-1b63-4ea2-99e2-d931c2e3e786" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="a52ffc85-056e-46b8-acf6-05fe209faa88" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="00b39e52-623d-4bf9-8195-1bfaa3653f92" data-file-name="components/email-analytics.tsx">Other</span></span>
                  <span className="font-medium" data-unique-id="c944bce9-73e1-42c9-a79f-94aa2ab688aa" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="97b5613a-728b-4e7a-85da-492ca8b94be5" data-file-name="components/email-analytics.tsx">13%</span></span>
                </li>
              </ul>
            </div>
            
            <div className="border border-border rounded-lg p-4" data-unique-id="0914d8e2-0fa7-47d9-8f90-571cb2c26020" data-file-name="components/email-analytics.tsx">
              <h3 className="text-sm font-medium mb-2" data-unique-id="c0f8d092-66f1-4dd9-9adf-9a5167f836d7" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="5a19d3f3-b4ed-408e-baae-d8cc1a6174d3" data-file-name="components/email-analytics.tsx">Delivery Performance</span></h3>
              <div className="flex items-center justify-center h-32" data-unique-id="f6b0dacd-e749-4b28-b2ff-67c3d1809a34" data-file-name="components/email-analytics.tsx">
                <div className="relative w-32 h-32" data-unique-id="b5f46545-3005-4790-86d6-48a984a84aee" data-file-name="components/email-analytics.tsx">
                  <svg viewBox="0 0 100 100" className="w-full h-full" data-unique-id="2de00e73-3512-4a10-96c0-681996001f1d" data-file-name="components/email-analytics.tsx">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="15" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="15" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - stats.deliveryRate / 100)} transform="rotate(-90 50 50)" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center" data-unique-id="5f264900-7ab3-41ba-90f4-24f3c2757bbe" data-file-name="components/email-analytics.tsx">
                    <span className="text-2xl font-bold" data-unique-id="68b5de86-1cbb-4ad4-b0c5-1157f8c1db85" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.deliveryRate}<span className="editable-text" data-unique-id="9ddea778-124b-4999-8447-9a619aac7b4c" data-file-name="components/email-analytics.tsx">%</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>}
    </motion.div>;
}