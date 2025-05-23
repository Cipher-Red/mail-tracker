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
  }} className="bg-white rounded-lg shadow-md p-6" data-unique-id="02d81498-e1da-461d-9937-e779cd941f1e" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">
      <div className="flex justify-between items-center mb-6" data-unique-id="0e38e710-7152-496a-961a-7de3a504e538" data-file-name="components/email-analytics.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="ad5cbc3f-211f-4cca-85d0-4d1fbd211ca3" data-file-name="components/email-analytics.tsx">
          <BarChart className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="c81b14eb-b2ee-463e-8df5-e0ff111be093" data-file-name="components/email-analytics.tsx"> Email Analytics
        </span></h2>
        <button onClick={fetchEmailStats} disabled={isLoading} className="flex items-center px-3 py-1.5 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors disabled:opacity-50" data-unique-id="800be720-364a-42d7-90e2-4b6f9339c412" data-file-name="components/email-analytics.tsx">
          <RefreshCw className={`mr-1.5 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /><span className="editable-text" data-unique-id="4e52856b-b9e5-4dae-ac88-e319b6157dfb" data-file-name="components/email-analytics.tsx">
          Refresh
        </span></button>
      </div>
      
      {isLoading ? <div className="flex justify-center items-center h-64" data-unique-id="e2890ef8-49ce-42ce-94f7-59cc80ba55ed" data-file-name="components/email-analytics.tsx">
          <div className="animate-pulse flex flex-col items-center" data-unique-id="67e773b6-7877-4c3c-8d3c-4efefec2bbaf" data-file-name="components/email-analytics.tsx">
            <RefreshCw className="animate-spin h-8 w-8 text-primary mb-2" />
            <p className="text-muted-foreground" data-unique-id="18a15d95-519b-4112-9889-4c6ae2a5a3d0" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="bd994924-ba5f-4628-bb54-785af6b3b22d" data-file-name="components/email-analytics.tsx">Loading analytics...</span></p>
          </div>
        </div> : <div className="space-y-6" data-unique-id="e5e26cbc-4287-4cf9-9ee8-58df7d68bcf8" data-file-name="components/email-analytics.tsx">
          <div className="grid grid-cols-3 gap-4" data-unique-id="3f69df3b-dc80-4735-b23c-7df2d30f7785" data-file-name="components/email-analytics.tsx">
            <div className="bg-blue-50 p-4 rounded-lg" data-unique-id="37f91f22-6443-4410-8f56-c8b227227e87" data-file-name="components/email-analytics.tsx">
              <p className="text-sm text-blue-600 mb-1" data-unique-id="cfe85c3f-ac54-4a86-aa08-7b8591c21634" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="bb6e0e31-7fd2-4c79-81ff-870759ea51ba" data-file-name="components/email-analytics.tsx">Total Emails Sent</span></p>
              <p className="text-2xl font-bold" data-unique-id="6251db26-bae9-4c26-b959-4c58460d0b7e" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.totalSent.toLocaleString()}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg" data-unique-id="cd13b28e-0970-4499-ba8c-1f178b02f2aa" data-file-name="components/email-analytics.tsx">
              <p className="text-sm text-amber-600 mb-1" data-unique-id="5ad42dcd-48fd-4156-abb7-68af50c7f87b" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="9407d6f3-535d-4394-af16-c7c2163d22d6" data-file-name="components/email-analytics.tsx">Failed Deliveries</span></p>
              <p className="text-2xl font-bold" data-unique-id="3e3a11ff-8ba0-4300-939d-f2dc673d6c95" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.totalFailed.toLocaleString()}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg" data-unique-id="d98d36c3-2ddb-4469-ba4c-6fea6ab9bc2c" data-file-name="components/email-analytics.tsx">
              <p className="text-sm text-green-600 mb-1" data-unique-id="c3a6f08a-c479-4db5-bc6f-ba34733d1b6d" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="da513e26-89b9-4139-80bd-68823b3066c6" data-file-name="components/email-analytics.tsx">Delivery Rate</span></p>
              <p className="text-2xl font-bold" data-unique-id="782dbba4-e687-4391-bee7-fe0524ff285e" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.deliveryRate}<span className="editable-text" data-unique-id="0c95d408-6af2-4ce4-98bc-2fd48803b2a7" data-file-name="components/email-analytics.tsx">%</span></p>
            </div>
          </div>
          
          <div className="border border-border rounded-lg p-4" data-unique-id="e025df5b-e5b3-4e67-a8b6-98f78d401c9e" data-file-name="components/email-analytics.tsx">
            <h3 className="text-sm font-medium mb-4 flex items-center" data-unique-id="9be05b18-44c1-4023-bd3a-c40d908764bc" data-file-name="components/email-analytics.tsx">
              <Calendar className="h-4 w-4 mr-2" data-unique-id="4864874f-0590-4fd1-ba4a-c6870b85eb36" data-file-name="components/email-analytics.tsx" /><span className="editable-text" data-unique-id="46be262f-6115-46d2-a923-1af3643f00f5" data-file-name="components/email-analytics.tsx"> Daily Email Activity
            </span></h3>
            <div className="h-64 relative" data-unique-id="84b6e5a9-5537-4db8-aaff-f0645715f826" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">
              {/* Simple bar chart visualization */}
              <div className="flex h-full items-end space-x-2" data-unique-id="975fac40-bae3-4e72-b3d5-8d63ee1f7776" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">
                {stats.dailySends.map(day => <div key={day.date} className="flex-1 flex flex-col items-center" data-unique-id="77d8964c-7863-4532-8b2d-841c749d8273" data-file-name="components/email-analytics.tsx">
                    <div className="w-full flex flex-col items-center space-y-1" data-unique-id="5fa3b18e-3ade-45c7-967a-64cf08a24417" data-file-name="components/email-analytics.tsx">
                      <div className="w-full bg-red-200" style={{
                  height: `${day.failed / (day.sent + day.failed) * 100}%`,
                  minHeight: day.failed > 0 ? '4px' : '0'
                }} data-unique-id="d4a345c4-759c-461b-a6e5-38ff8ca6fea0" data-file-name="components/email-analytics.tsx"></div>
                      <div className="w-full bg-blue-400" style={{
                  height: `${day.sent / Math.max(...stats.dailySends.map(d => d.sent + d.failed)) * 100}%`
                }} data-unique-id="f89a86db-471b-41dc-93a9-79f121b52bb0" data-file-name="components/email-analytics.tsx"></div>
                    </div>
                    <p className="text-xs mt-2" data-unique-id="d684498f-f00f-4197-b360-914ca8bb280f" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{new Date(day.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}</p>
                  </div>)}
              </div>
              
              <div className="absolute top-2 right-2 flex items-center space-x-4 text-xs" data-unique-id="9b571fc4-3746-4af9-8748-f1ee994d495b" data-file-name="components/email-analytics.tsx">
                <div className="flex items-center" data-unique-id="5b32365b-906c-48aa-a095-175e67fb4a46" data-file-name="components/email-analytics.tsx">
                  <div className="w-3 h-3 bg-blue-400 mr-1" data-unique-id="df480b45-aec0-43d8-9f89-7a1ed65a06b4" data-file-name="components/email-analytics.tsx"></div>
                  <span data-unique-id="a8a0eeea-58af-409a-b978-8a7e3689ef4b" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="de025b65-a1e3-4294-9325-2f88543f8615" data-file-name="components/email-analytics.tsx">Successful</span></span>
                </div>
                <div className="flex items-center" data-unique-id="a0a0e554-f4a4-45df-a4af-db3ffaf68d63" data-file-name="components/email-analytics.tsx">
                  <div className="w-3 h-3 bg-red-200 mr-1" data-unique-id="09ea700e-b389-43e9-985d-4db10db69b10" data-file-name="components/email-analytics.tsx"></div>
                  <span data-unique-id="f1fcf903-b480-4330-8285-587808414913" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="e1ab7846-d4bd-4da6-9ee4-53b0820ff354" data-file-name="components/email-analytics.tsx">Failed</span></span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4" data-unique-id="92fa3b6a-3b31-4730-9dcd-5f806d8e40f6" data-file-name="components/email-analytics.tsx">
            <div className="border border-border rounded-lg p-4" data-unique-id="da456212-a54c-4f5e-926e-e0da5c5113b4" data-file-name="components/email-analytics.tsx">
              <h3 className="text-sm font-medium mb-2" data-unique-id="a6da1480-e34a-445a-8631-956768af5121" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="8307f831-00cc-4d5c-ab37-938a388ddb16" data-file-name="components/email-analytics.tsx">Top Delivery Issues</span></h3>
              <ul className="space-y-2 text-sm" data-unique-id="4d607a95-35f8-414f-8def-3e3a7a4e0220" data-file-name="components/email-analytics.tsx">
                <li className="flex justify-between" data-unique-id="e8c0bc13-afae-474c-9a41-0300983f7239" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="e3b47baa-5676-4a5c-8b04-048745a537bf" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="2ec625d5-72af-4327-9114-08626b6356c1" data-file-name="components/email-analytics.tsx">Invalid email address</span></span>
                  <span className="font-medium" data-unique-id="abd56299-2889-4ae9-acd6-4a6800a5ddba" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="f467d442-a30f-4700-8313-f4ee42f3c034" data-file-name="components/email-analytics.tsx">42%</span></span>
                </li>
                <li className="flex justify-between" data-unique-id="fb0ce8f2-a0ee-4bc1-b615-76e8a4ec795e" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="b46e4d36-6354-4203-8580-8b7db8b82266" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="145bb003-05fe-4634-a9c8-287d666c0870" data-file-name="components/email-analytics.tsx">Mailbox full</span></span>
                  <span className="font-medium" data-unique-id="16f3bb29-9b4a-4ce8-8d20-c06bd7547a46" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="a672ca9d-e1ad-40ac-8a9a-833d2e7ca264" data-file-name="components/email-analytics.tsx">27%</span></span>
                </li>
                <li className="flex justify-between" data-unique-id="70a0649e-8b3e-422f-83d0-eeba61439f7a" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="1006345e-008c-4933-95a5-47173e30f36c" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="d87320c3-bc70-4b6c-9997-931350db1345" data-file-name="components/email-analytics.tsx">Spam filters</span></span>
                  <span className="font-medium" data-unique-id="0016ced1-70b8-49e5-ac0d-50071f7584f3" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="a67d3fe1-bd6d-4544-837f-e4382b476622" data-file-name="components/email-analytics.tsx">18%</span></span>
                </li>
                <li className="flex justify-between" data-unique-id="5316daa9-033a-4b49-8689-3b65444d1387" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="61f4d4ec-0c44-42ac-86f3-6db3922ff4b2" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="c8bed017-017f-4888-9f5f-54774a977059" data-file-name="components/email-analytics.tsx">Other</span></span>
                  <span className="font-medium" data-unique-id="6e1b3126-65ef-4379-a69a-e34bec28a94d" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="1c6f6205-883d-4d33-b0f8-42111ec8bca0" data-file-name="components/email-analytics.tsx">13%</span></span>
                </li>
              </ul>
            </div>
            
            <div className="border border-border rounded-lg p-4" data-unique-id="0aac5e06-67fb-45f3-a282-d9fa37c768e7" data-file-name="components/email-analytics.tsx">
              <h3 className="text-sm font-medium mb-2" data-unique-id="0d302df4-b5f5-42ae-9d18-2d92f24ca3c6" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="befb0a3c-ee2e-46ad-b33e-5eeb9fa8a657" data-file-name="components/email-analytics.tsx">Delivery Performance</span></h3>
              <div className="flex items-center justify-center h-32" data-unique-id="e0c43214-78ea-4e3e-8a4b-d2dc01b8607c" data-file-name="components/email-analytics.tsx">
                <div className="relative w-32 h-32" data-unique-id="cbe37244-629d-41d8-b9c4-84642715619c" data-file-name="components/email-analytics.tsx">
                  <svg viewBox="0 0 100 100" className="w-full h-full" data-unique-id="1f43723c-c581-4ad8-9e6b-964cab7054e4" data-file-name="components/email-analytics.tsx">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="15" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="15" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - stats.deliveryRate / 100)} transform="rotate(-90 50 50)" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center" data-unique-id="65944ca0-3e89-4f98-8a94-7aa965a0e4d6" data-file-name="components/email-analytics.tsx">
                    <span className="text-2xl font-bold" data-unique-id="ba25ecf9-e379-45c2-8f58-c1dffe8369ab" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.deliveryRate}<span className="editable-text" data-unique-id="ede78b8d-d19d-48c3-8867-294c8af3b05b" data-file-name="components/email-analytics.tsx">%</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>}
    </motion.div>;
}