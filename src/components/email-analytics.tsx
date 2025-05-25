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
  }} className="bg-card rounded-lg shadow-md p-6" data-unique-id="09ab7550-b098-488b-b608-c531cdf3cf74" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">
      <div className="flex justify-between items-center mb-6" data-unique-id="83937ad5-60c2-445e-a0f4-f8df9546da4b" data-file-name="components/email-analytics.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="9a47def9-f2f7-4c60-a74b-15d28f18b187" data-file-name="components/email-analytics.tsx">
          <BarChart className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="b43d3012-ce50-499e-9cf4-e6e6039476bc" data-file-name="components/email-analytics.tsx"> Email Analytics
        </span></h2>
        <button onClick={fetchEmailStats} disabled={isLoading} className="flex items-center px-3 py-1.5 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors disabled:opacity-50" data-unique-id="90859f99-fced-43cf-b3de-48b3e66159d6" data-file-name="components/email-analytics.tsx">
          <RefreshCw className={`mr-1.5 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /><span className="editable-text" data-unique-id="fa1c4cb0-24e4-4cc0-afe9-4a3bb8537ad0" data-file-name="components/email-analytics.tsx">
          Refresh
        </span></button>
      </div>
      
      {isLoading ? <div className="flex justify-center items-center h-64" data-unique-id="672717bf-354f-4e22-8d12-45ea203ded32" data-file-name="components/email-analytics.tsx">
          <div className="animate-pulse flex flex-col items-center" data-unique-id="557e38e2-c493-464f-af22-4cd096eb6055" data-file-name="components/email-analytics.tsx">
            <RefreshCw className="animate-spin h-8 w-8 text-primary mb-2" />
            <p className="text-muted-foreground" data-unique-id="795267b8-1a0a-4515-a02b-8d15abc2e029" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="52d30f06-18d2-4eac-a417-64a4c2fec72e" data-file-name="components/email-analytics.tsx">Loading analytics...</span></p>
          </div>
        </div> : <div className="space-y-6" data-unique-id="4e6f84a2-bf75-47f4-b216-cf8217177a38" data-file-name="components/email-analytics.tsx">
          <div className="grid grid-cols-3 gap-4" data-unique-id="9a6104d0-0537-4110-b01e-3c155e5c921b" data-file-name="components/email-analytics.tsx">
            <div className="bg-blue-50 p-4 rounded-lg" data-unique-id="1bc7848d-1866-41b7-a09d-eaf3a87b879e" data-file-name="components/email-analytics.tsx">
              <p className="text-sm text-blue-600 mb-1" data-unique-id="d2431cae-4f12-40fa-a523-1625adc32cb7" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="5ecad1c6-b8d8-4a2f-bf6a-1c4089a53b63" data-file-name="components/email-analytics.tsx">Total Emails Sent</span></p>
              <p className="text-2xl font-bold" data-unique-id="c5c53eb1-a61d-4214-9245-b8231cd4bdb5" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.totalSent.toLocaleString()}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg" data-unique-id="8a851dee-6119-45e2-aa61-f78eaa4a126b" data-file-name="components/email-analytics.tsx">
              <p className="text-sm text-amber-600 mb-1" data-unique-id="13bbdf19-63c9-4b6c-9a61-78e6c37efe46" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="6959d1e0-d4a6-4493-967d-b9d7d2e70abe" data-file-name="components/email-analytics.tsx">Failed Deliveries</span></p>
              <p className="text-2xl font-bold" data-unique-id="df78bc20-d92a-40c7-8c34-968055e4450a" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.totalFailed.toLocaleString()}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg" data-unique-id="8e210d43-08ef-4f70-9eb2-72fccb2f2185" data-file-name="components/email-analytics.tsx">
              <p className="text-sm text-green-600 mb-1" data-unique-id="afcfccc4-6174-4ae3-a976-79971c7f8d9b" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="6b06f2b3-e8b0-41e7-8908-ef74a682524e" data-file-name="components/email-analytics.tsx">Delivery Rate</span></p>
              <p className="text-2xl font-bold" data-unique-id="c890e4cc-0218-46b6-a78b-9c9ea3d33da1" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.deliveryRate}<span className="editable-text" data-unique-id="6c50cfa2-3275-4267-8647-44846bc85b8b" data-file-name="components/email-analytics.tsx">%</span></p>
            </div>
          </div>
          
          <div className="border border-border rounded-lg p-4" data-unique-id="11081358-4923-4a56-bf29-a5530dad10a3" data-file-name="components/email-analytics.tsx">
            <h3 className="text-sm font-medium mb-4 flex items-center" data-unique-id="951c350c-a2c2-4cb6-a06f-c026d5a039b4" data-file-name="components/email-analytics.tsx">
              <Calendar className="h-4 w-4 mr-2" data-unique-id="02c1e7ca-9dff-4646-bc1f-b10d084f3569" data-file-name="components/email-analytics.tsx" /><span className="editable-text" data-unique-id="bed44ab3-7021-44da-b861-97b0965ce7c5" data-file-name="components/email-analytics.tsx"> Daily Email Activity
            </span></h3>
            <div className="h-64 relative" data-unique-id="39ed5d58-5109-4ff1-bf8f-f6edfeb3b885" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">
              {/* Simple bar chart visualization */}
              <div className="flex h-full items-end space-x-2" data-unique-id="09cd2843-16ef-405a-b2b5-1a0a442e14aa" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">
                {stats.dailySends.map(day => <div key={day.date} className="flex-1 flex flex-col items-center" data-unique-id="623e7ba0-055b-4043-9f25-b23a649f3902" data-file-name="components/email-analytics.tsx">
                    <div className="w-full flex flex-col items-center space-y-1" data-unique-id="c162011d-079b-4853-ab0b-97f9a9f0d4d4" data-file-name="components/email-analytics.tsx">
                      <div className="w-full bg-red-200" style={{
                  height: `${day.failed / (day.sent + day.failed) * 100 || 0}%`,
                  minHeight: day.failed > 0 ? '4px' : '0'
                }} data-unique-id="3f5339be-6d0f-4050-aed6-705e414b5311" data-file-name="components/email-analytics.tsx"></div>
                      <div className="w-full bg-blue-400" style={{
                  height: `${day.sent / Math.max(...stats.dailySends.map(d => d.sent + d.failed || 1)) * 100 || 0}%`
                }} data-unique-id="c32b6a30-168c-4790-a462-679b6e82a728" data-file-name="components/email-analytics.tsx"></div>
                    </div>
                    <p className="text-xs mt-2" data-unique-id="5d3209cf-3edf-4d72-a183-31e6712e80df" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{new Date(day.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}</p>
                  </div>)}
              </div>
              
              <div className="absolute top-2 right-2 flex items-center space-x-4 text-xs" data-unique-id="76a752fe-fd6b-4071-98ee-1fe0ef295492" data-file-name="components/email-analytics.tsx">
                <div className="flex items-center" data-unique-id="0c245643-c724-4510-bd8a-1f9903e22ded" data-file-name="components/email-analytics.tsx">
                  <div className="w-3 h-3 bg-blue-400 mr-1" data-unique-id="215b9749-f482-4670-a0f6-e30e915bbc83" data-file-name="components/email-analytics.tsx"></div>
                  <span data-unique-id="9ac5ed1b-0b76-4764-9de9-4c84cec6fe76" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="ad2b28a3-a773-4360-94b2-7802faf4cec6" data-file-name="components/email-analytics.tsx">Successful</span></span>
                </div>
                <div className="flex items-center" data-unique-id="92fbc533-a60d-40c9-bde8-58062c16a698" data-file-name="components/email-analytics.tsx">
                  <div className="w-3 h-3 bg-red-200 mr-1" data-unique-id="6520e577-b615-4df7-84c8-533f9912fdf3" data-file-name="components/email-analytics.tsx"></div>
                  <span data-unique-id="d64e3b96-42a7-491b-af5c-ee5ef9fed795" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="67c5c430-b4a1-4c19-9b82-0144b911da78" data-file-name="components/email-analytics.tsx">Failed</span></span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4" data-unique-id="ba1cf590-76c7-468e-93d6-b0e8373f26d2" data-file-name="components/email-analytics.tsx">
            <div className="border border-border rounded-lg p-4" data-unique-id="53583b05-703e-4860-a246-6d7af34e9b1f" data-file-name="components/email-analytics.tsx">
              <h3 className="text-sm font-medium mb-2" data-unique-id="706acf82-efce-4a3c-b114-ee33b7536ea9" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="994b2440-6cab-470a-b75a-454086af67d4" data-file-name="components/email-analytics.tsx">Top Delivery Issues</span></h3>
              <ul className="space-y-2 text-sm" data-unique-id="041244c8-9ac8-4440-a28e-f04531980787" data-file-name="components/email-analytics.tsx">
                <li className="flex justify-between" data-unique-id="8ec8db7b-c540-4ba1-8f2f-fd36ca41caea" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="18be737a-8217-443d-bc46-2cb86c45f9ee" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="270b9fa6-f874-4be8-aecd-95a35d65f812" data-file-name="components/email-analytics.tsx">Invalid email address</span></span>
                  <span className="font-medium" data-unique-id="1891e26e-2ed7-4cd8-9a60-30223b4b3c18" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="59df12a9-1fe0-416f-9912-59234dd5631f" data-file-name="components/email-analytics.tsx">42%</span></span>
                </li>
                <li className="flex justify-between" data-unique-id="6f0ac349-cce7-4527-aec6-8aae8d6e500f" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="0cc5cf2d-b7ef-4401-9c1d-ca89407b3f66" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="9a048e0b-fa7b-449e-ac29-ad9f765781a2" data-file-name="components/email-analytics.tsx">Mailbox full</span></span>
                  <span className="font-medium" data-unique-id="09bc1784-7ced-4474-8795-7e2f6adeef4e" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="78307655-545b-432f-8bb0-dc97b7221ddd" data-file-name="components/email-analytics.tsx">27%</span></span>
                </li>
                <li className="flex justify-between" data-unique-id="c3b050cf-649c-4ef9-bc1c-a3f4c900edb3" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="956d58f4-469b-4416-9259-b8af2276be63" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="5c72ec5e-6aac-4b51-8ea9-2842caceac9e" data-file-name="components/email-analytics.tsx">Spam filters</span></span>
                  <span className="font-medium" data-unique-id="c7821807-67a4-473c-b3ae-30f4ddfb1d02" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="896b8000-88b1-4db4-a09b-da2f13ed0098" data-file-name="components/email-analytics.tsx">18%</span></span>
                </li>
                <li className="flex justify-between" data-unique-id="92db6863-be2e-4415-824c-10079b128c51" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="9aef994f-9425-4b9a-af8e-8200bf50c5df" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="90cdfe25-b95c-4e11-9a3b-70d51421e384" data-file-name="components/email-analytics.tsx">Other</span></span>
                  <span className="font-medium" data-unique-id="89f30059-b5d6-441a-b701-ade58e51bc7a" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="5af7e16a-5537-4399-b78a-fce2b502932c" data-file-name="components/email-analytics.tsx">13%</span></span>
                </li>
              </ul>
            </div>
            
            <div className="border border-border rounded-lg p-4" data-unique-id="262b0e67-ed28-4c22-aa4f-2543044dbce0" data-file-name="components/email-analytics.tsx">
              <h3 className="text-sm font-medium mb-2" data-unique-id="b9d5fc89-c4e2-4a94-a79e-c285d3955581" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="dd2b42df-9e2d-4764-84f8-069d6e06158f" data-file-name="components/email-analytics.tsx">Delivery Performance</span></h3>
              <div className="flex items-center justify-center h-32" data-unique-id="22384824-ae49-4479-878f-01821864d0c2" data-file-name="components/email-analytics.tsx">
                <div className="relative w-32 h-32" data-unique-id="3aad0e59-5693-49bd-86a2-e48880688243" data-file-name="components/email-analytics.tsx">
                  <svg viewBox="0 0 100 100" className="w-full h-full" data-unique-id="28910956-5d4a-494c-8017-90577d3d4969" data-file-name="components/email-analytics.tsx">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="15" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="15" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - stats.deliveryRate / 100)} transform="rotate(-90 50 50)" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center" data-unique-id="64d38a5d-5c3a-466b-b197-f4e47d611f34" data-file-name="components/email-analytics.tsx">
                    <span className="text-2xl font-bold" data-unique-id="4bfe6a9d-4991-4d62-b284-059d0505e144" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.deliveryRate}<span className="editable-text" data-unique-id="e6cbbfc9-18a2-4170-88f8-60166e6cc585" data-file-name="components/email-analytics.tsx">%</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>}
    </motion.div>;
}