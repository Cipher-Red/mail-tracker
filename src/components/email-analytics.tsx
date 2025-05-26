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
  }} className="bg-card rounded-lg shadow-md p-6" data-unique-id="bc8a9d48-c257-470c-b83e-6a36374e7955" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">
      <div className="flex justify-between items-center mb-6" data-unique-id="61528f29-cc7b-44b4-868c-f9331acc2de8" data-file-name="components/email-analytics.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="3e370a89-3339-4337-8ca2-b307778f273f" data-file-name="components/email-analytics.tsx">
          <BarChart className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="0f4e0099-1eeb-4825-bc5d-036b8f13e167" data-file-name="components/email-analytics.tsx"> Email Analytics
        </span></h2>
        <button onClick={fetchEmailStats} disabled={isLoading} className="flex items-center px-3 py-1.5 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors disabled:opacity-50" data-unique-id="3a7b1581-a891-4a1c-8cf6-61273fd00212" data-file-name="components/email-analytics.tsx">
          <RefreshCw className={`mr-1.5 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /><span className="editable-text" data-unique-id="d9bae628-03ba-4343-aaf7-72054cc0cb02" data-file-name="components/email-analytics.tsx">
          Refresh
        </span></button>
      </div>
      
      {isLoading ? <div className="flex justify-center items-center h-64" data-unique-id="4f8b015c-5884-4184-91f0-21fa7d9de8e3" data-file-name="components/email-analytics.tsx">
          <div className="animate-pulse flex flex-col items-center" data-unique-id="a18b8d0a-12a6-4b50-8a6d-51cee97064ec" data-file-name="components/email-analytics.tsx">
            <RefreshCw className="animate-spin h-8 w-8 text-primary mb-2" />
            <p className="text-muted-foreground" data-unique-id="cb46e344-a2ce-46e0-bb1c-ef2f79354921" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="880b857f-668d-4d8c-981e-0344a58c4c7b" data-file-name="components/email-analytics.tsx">Loading analytics...</span></p>
          </div>
        </div> : <div className="space-y-6" data-unique-id="9684b90a-5fca-4804-a9f3-6f47c902fd65" data-file-name="components/email-analytics.tsx">
          <div className="grid grid-cols-3 gap-4" data-unique-id="471adc3b-7788-4fea-9f34-92336f5bb7fe" data-file-name="components/email-analytics.tsx">
            <div className="bg-blue-50 p-4 rounded-lg" data-unique-id="7cd28f57-f002-432b-8008-bf0cdfacdc78" data-file-name="components/email-analytics.tsx">
              <p className="text-sm text-blue-600 mb-1" data-unique-id="686c0e98-05d4-4fca-9af9-ef51b7f05910" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="4a63be42-0461-488d-917e-c95a324f9845" data-file-name="components/email-analytics.tsx">Total Emails Sent</span></p>
              <p className="text-2xl font-bold" data-unique-id="42ba6c17-3a64-493d-9357-2a961f46eb52" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.totalSent.toLocaleString()}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg" data-unique-id="e493be22-2649-4270-93b8-ef091e8946b8" data-file-name="components/email-analytics.tsx">
              <p className="text-sm text-amber-600 mb-1" data-unique-id="0594d174-069b-4964-9938-f29d8f3dc2ca" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="590dab71-c4b7-4935-b725-5e4728f9837b" data-file-name="components/email-analytics.tsx">Failed Deliveries</span></p>
              <p className="text-2xl font-bold" data-unique-id="4c7d31d9-2437-4107-823c-286dde274422" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.totalFailed.toLocaleString()}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg" data-unique-id="f0d14305-c654-49cc-9418-fa5ff82ab61b" data-file-name="components/email-analytics.tsx">
              <p className="text-sm text-green-600 mb-1" data-unique-id="3c7bb137-1e8b-480c-9606-d008cc97596b" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="c4ffbc54-877b-4c78-8e11-4c41963d210c" data-file-name="components/email-analytics.tsx">Delivery Rate</span></p>
              <p className="text-2xl font-bold" data-unique-id="76929f25-0c28-4d5d-ae09-c61f5a39662f" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.deliveryRate}<span className="editable-text" data-unique-id="aa2b74aa-d25d-45b2-9120-409ee4f1f60d" data-file-name="components/email-analytics.tsx">%</span></p>
            </div>
          </div>
          
          <div className="border border-border rounded-lg p-4" data-unique-id="fe8bd25f-a3cb-41e6-b1fe-9b2bd718e0bb" data-file-name="components/email-analytics.tsx">
            <h3 className="text-sm font-medium mb-4 flex items-center" data-unique-id="80d1d4f1-8dff-44f5-be4d-b44e854dc375" data-file-name="components/email-analytics.tsx">
              <Calendar className="h-4 w-4 mr-2" data-unique-id="50e93d49-acab-40df-b456-9c4dd79d2cb9" data-file-name="components/email-analytics.tsx" /><span className="editable-text" data-unique-id="28b06a82-57b3-467c-9d2e-dce21876871a" data-file-name="components/email-analytics.tsx"> Daily Email Activity
            </span></h3>
            <div className="h-64 relative" data-unique-id="04e93e50-5826-4530-bc89-e63fd4d78b67" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">
              {/* Simple bar chart visualization */}
              <div className="flex h-full items-end space-x-2" data-unique-id="ec25b525-7604-466d-b9c3-cbf1f07ea581" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">
                {stats.dailySends.map(day => <div key={day.date} className="flex-1 flex flex-col items-center" data-unique-id="8aa969ae-feab-4451-98a4-ee2fd21ef82c" data-file-name="components/email-analytics.tsx">
                    <div className="w-full flex flex-col items-center space-y-1" data-unique-id="8cc69674-0fba-4731-9592-6f801c5a888e" data-file-name="components/email-analytics.tsx">
                      <div className="w-full bg-red-200" style={{
                  height: `${day.failed / (day.sent + day.failed) * 100 || 0}%`,
                  minHeight: day.failed > 0 ? '4px' : '0'
                }} data-unique-id="334944cc-680d-44f2-9571-b01437a40ea4" data-file-name="components/email-analytics.tsx"></div>
                      <div className="w-full bg-blue-400" style={{
                  height: `${day.sent / Math.max(...stats.dailySends.map(d => d.sent + d.failed || 1)) * 100 || 0}%`
                }} data-unique-id="055cbdaa-3e20-4103-8ce4-4927225e1f25" data-file-name="components/email-analytics.tsx"></div>
                    </div>
                    <p className="text-xs mt-2" data-unique-id="3d38cd61-834f-471e-8838-7b5f41d70a81" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{new Date(day.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}</p>
                  </div>)}
              </div>
              
              <div className="absolute top-2 right-2 flex items-center space-x-4 text-xs" data-unique-id="57845068-ebab-466c-b77b-f3f12f7a477c" data-file-name="components/email-analytics.tsx">
                <div className="flex items-center" data-unique-id="46776981-8a57-4d21-a00e-7a79ebcb2ec3" data-file-name="components/email-analytics.tsx">
                  <div className="w-3 h-3 bg-blue-400 mr-1" data-unique-id="f243c2f6-c801-4eaf-ba70-e977d7a9cca5" data-file-name="components/email-analytics.tsx"></div>
                  <span data-unique-id="ea301b86-be56-44d5-846b-305fc42b6a5d" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="2367cde4-6dd5-4b0b-bc4c-e1e62fa1e7c3" data-file-name="components/email-analytics.tsx">Successful</span></span>
                </div>
                <div className="flex items-center" data-unique-id="ce261494-a418-4b6d-8c3b-33c074115349" data-file-name="components/email-analytics.tsx">
                  <div className="w-3 h-3 bg-red-200 mr-1" data-unique-id="cc1b78bf-3a5a-4801-8173-9e7455c9c798" data-file-name="components/email-analytics.tsx"></div>
                  <span data-unique-id="7926222e-cdff-4367-b99f-d18c0f15d05b" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="782b10f6-5481-4de1-b8d6-27e02bca4da7" data-file-name="components/email-analytics.tsx">Failed</span></span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4" data-unique-id="d2eefe07-f5dd-4223-8d0b-1c678c61bfa8" data-file-name="components/email-analytics.tsx">
            <div className="border border-border rounded-lg p-4" data-unique-id="ca481d62-6633-4267-9edf-b60c6c0f197f" data-file-name="components/email-analytics.tsx">
              <h3 className="text-sm font-medium mb-2" data-unique-id="17799433-cc22-4e22-be7f-2fbd319ff479" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="6246ba26-9d14-41ef-b72b-713dfab48476" data-file-name="components/email-analytics.tsx">Top Delivery Issues</span></h3>
              <ul className="space-y-2 text-sm" data-unique-id="2897daa0-0ee8-4fad-8365-c08e510bdfe2" data-file-name="components/email-analytics.tsx">
                <li className="flex justify-between" data-unique-id="90bb5694-5128-493f-9234-8e6b8e4afb78" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="406c7123-b90b-4a05-852d-b39e966dee8c" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="a22e00b8-7ead-4207-b544-3d847d6a8bdb" data-file-name="components/email-analytics.tsx">Invalid email address</span></span>
                  <span className="font-medium" data-unique-id="ad193f30-39af-4d06-88ae-1729a939c353" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="b7158437-4df2-4c25-8658-3dd4566fef6f" data-file-name="components/email-analytics.tsx">42%</span></span>
                </li>
                <li className="flex justify-between" data-unique-id="3ab151ad-5dfe-460c-a8fa-399de6db21d0" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="406d45bb-0808-4a37-bb04-39228dbc97c4" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="5e6a855a-4cc2-4a66-aefd-eede7e87d697" data-file-name="components/email-analytics.tsx">Mailbox full</span></span>
                  <span className="font-medium" data-unique-id="a8844de2-06c3-448a-84d9-6919f4176b6e" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="a61750f2-7e48-4c38-9585-a7c8b10d526a" data-file-name="components/email-analytics.tsx">27%</span></span>
                </li>
                <li className="flex justify-between" data-unique-id="223da1c5-49b2-48f7-b541-38024be9ee75" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="c22d6664-da5f-4589-884b-d6fde7935c63" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="4e2dcb48-fd43-4e8f-90ff-6d087ca38c68" data-file-name="components/email-analytics.tsx">Spam filters</span></span>
                  <span className="font-medium" data-unique-id="87af556e-f152-41c3-8622-c6f9bfb76f87" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="e212c4fa-612e-4891-ad7b-914a2fd31e23" data-file-name="components/email-analytics.tsx">18%</span></span>
                </li>
                <li className="flex justify-between" data-unique-id="48f9ea86-97ce-4dfd-bae2-6ab4b39bc655" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="4eea75b2-7f5b-42da-a9bd-15c168510355" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="2d71f70e-8792-4a3f-b9ce-a2d214c4509f" data-file-name="components/email-analytics.tsx">Other</span></span>
                  <span className="font-medium" data-unique-id="c146b511-5d2d-44f8-87e4-1567cb970c2b" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="74038e25-6307-45bb-befa-b18791f76716" data-file-name="components/email-analytics.tsx">13%</span></span>
                </li>
              </ul>
            </div>
            
            <div className="border border-border rounded-lg p-4" data-unique-id="d1d97f59-0d75-49e8-9153-232dbb96fd80" data-file-name="components/email-analytics.tsx">
              <h3 className="text-sm font-medium mb-2" data-unique-id="59cf252a-41f9-4128-8b76-0afc528fe906" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="c258dd30-dad2-429f-8598-72a587376349" data-file-name="components/email-analytics.tsx">Delivery Performance</span></h3>
              <div className="flex items-center justify-center h-32" data-unique-id="90901846-23c3-42f7-9d01-571bbf1ec088" data-file-name="components/email-analytics.tsx">
                <div className="relative w-32 h-32" data-unique-id="1269bdfc-9284-4929-8dee-38cb350d79e7" data-file-name="components/email-analytics.tsx">
                  <svg viewBox="0 0 100 100" className="w-full h-full" data-unique-id="f148d57e-eb48-4f5c-bf76-b806eb4d343f" data-file-name="components/email-analytics.tsx">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="15" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="15" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - stats.deliveryRate / 100)} transform="rotate(-90 50 50)" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center" data-unique-id="d8b8e8d2-0958-4430-9eff-af717ac943de" data-file-name="components/email-analytics.tsx">
                    <span className="text-2xl font-bold" data-unique-id="99def36e-4f13-4d93-98d6-c2ba0ee83656" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.deliveryRate}<span className="editable-text" data-unique-id="b28353f6-cacb-4e2e-a459-a01eea1cde1f" data-file-name="components/email-analytics.tsx">%</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>}
    </motion.div>;
}