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
  }} className="bg-white rounded-lg shadow-md p-6" data-unique-id="f1a8bf99-92df-4f2c-9957-8b9b1fd75459" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">
      <div className="flex justify-between items-center mb-6" data-unique-id="2ef843dc-4934-4bbd-a098-f06616542864" data-file-name="components/email-analytics.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="70f1dbb3-8399-49fb-ac5b-39895297d93c" data-file-name="components/email-analytics.tsx">
          <BarChart className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="838b2d28-cc65-447b-a724-9b01d651190d" data-file-name="components/email-analytics.tsx"> Email Analytics
        </span></h2>
        <button onClick={fetchEmailStats} disabled={isLoading} className="flex items-center px-3 py-1.5 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors disabled:opacity-50" data-unique-id="875e581f-eb62-4a26-bbe2-8ab90a8e878a" data-file-name="components/email-analytics.tsx">
          <RefreshCw className={`mr-1.5 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /><span className="editable-text" data-unique-id="1d4e94f0-0ea1-4d3e-87f0-6d2bb490caca" data-file-name="components/email-analytics.tsx">
          Refresh
        </span></button>
      </div>
      
      {isLoading ? <div className="flex justify-center items-center h-64" data-unique-id="f9c39db2-45f1-4f00-a474-84759354113f" data-file-name="components/email-analytics.tsx">
          <div className="animate-pulse flex flex-col items-center" data-unique-id="6faa098d-fd67-416a-be93-429f9f28244e" data-file-name="components/email-analytics.tsx">
            <RefreshCw className="animate-spin h-8 w-8 text-primary mb-2" />
            <p className="text-muted-foreground" data-unique-id="8c1d0ebf-d185-4129-a682-7b6a8a7abaa3" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="e898fbce-82e8-4f8b-b007-35b7761b21d7" data-file-name="components/email-analytics.tsx">Loading analytics...</span></p>
          </div>
        </div> : <div className="space-y-6" data-unique-id="a3f9a6aa-e4a0-4a11-935f-65c591b8f7fd" data-file-name="components/email-analytics.tsx">
          <div className="grid grid-cols-3 gap-4" data-unique-id="8947e48d-df35-4483-b773-4715964821cf" data-file-name="components/email-analytics.tsx">
            <div className="bg-blue-50 p-4 rounded-lg" data-unique-id="2b5f04c0-cd0f-4f1f-9fe0-e9aa4f6bcae1" data-file-name="components/email-analytics.tsx">
              <p className="text-sm text-blue-600 mb-1" data-unique-id="96880dd0-e8ef-4448-9daf-68c9cbf4fee0" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="4358ea50-1402-4ff4-a57c-1c7e9d73ae1d" data-file-name="components/email-analytics.tsx">Total Emails Sent</span></p>
              <p className="text-2xl font-bold" data-unique-id="fb751cce-d7ef-4262-a4d1-d891d1fc48af" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.totalSent.toLocaleString()}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg" data-unique-id="387330c6-7a69-4fff-b4e3-45671d1a273c" data-file-name="components/email-analytics.tsx">
              <p className="text-sm text-amber-600 mb-1" data-unique-id="3c7d529b-e075-4376-9f0c-961d61d52318" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="55094d22-7d15-4e70-a045-1ebf6b3df29f" data-file-name="components/email-analytics.tsx">Failed Deliveries</span></p>
              <p className="text-2xl font-bold" data-unique-id="c0de361d-7c2b-4bf0-87c9-f6997da43739" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.totalFailed.toLocaleString()}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg" data-unique-id="55559432-d19c-4262-a7c7-57354129e272" data-file-name="components/email-analytics.tsx">
              <p className="text-sm text-green-600 mb-1" data-unique-id="d3dc7bf3-ba16-46e4-9256-6aa75b863e40" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="b5d00d2b-296b-4835-a000-7a4b9dac1460" data-file-name="components/email-analytics.tsx">Delivery Rate</span></p>
              <p className="text-2xl font-bold" data-unique-id="ad9b86ee-7758-4236-9ceb-c0d67fa4a73d" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.deliveryRate}<span className="editable-text" data-unique-id="3d71fa4e-8704-46c1-9ce7-4faca26cc827" data-file-name="components/email-analytics.tsx">%</span></p>
            </div>
          </div>
          
          <div className="border border-border rounded-lg p-4" data-unique-id="e30dbd5e-3cc8-4e2e-b5f8-84026e320815" data-file-name="components/email-analytics.tsx">
            <h3 className="text-sm font-medium mb-4 flex items-center" data-unique-id="2f3f9325-19b4-426c-8a23-9323ab30d530" data-file-name="components/email-analytics.tsx">
              <Calendar className="h-4 w-4 mr-2" data-unique-id="9595bfb0-d017-49e5-8e40-82c977a5063c" data-file-name="components/email-analytics.tsx" /><span className="editable-text" data-unique-id="1c419a6f-ebe0-44f8-9a32-e1537fbc8004" data-file-name="components/email-analytics.tsx"> Daily Email Activity
            </span></h3>
            <div className="h-64 relative" data-unique-id="6ac5544f-7ef4-446d-9852-39330fc388c6" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">
              {/* Simple bar chart visualization */}
              <div className="flex h-full items-end space-x-2" data-unique-id="1e9ea471-2541-44dc-9943-24bfefaf7c7b" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">
                {stats.dailySends.map(day => <div key={day.date} className="flex-1 flex flex-col items-center" data-unique-id="bb051617-beb6-4fd1-af44-236367d2eeed" data-file-name="components/email-analytics.tsx">
                    <div className="w-full flex flex-col items-center space-y-1" data-unique-id="a9879d9c-5ae3-4bd3-9999-9d21c575c283" data-file-name="components/email-analytics.tsx">
                      <div className="w-full bg-red-200" style={{
                  height: `${day.failed / (day.sent + day.failed) * 100}%`,
                  minHeight: day.failed > 0 ? '4px' : '0'
                }} data-unique-id="9b2e95e1-4858-48ea-bf24-69e9ae3b795b" data-file-name="components/email-analytics.tsx"></div>
                      <div className="w-full bg-blue-400" style={{
                  height: `${day.sent / Math.max(...stats.dailySends.map(d => d.sent + d.failed)) * 100}%`
                }} data-unique-id="e0860ef4-ac88-4def-b7fe-52826e2b5da0" data-file-name="components/email-analytics.tsx"></div>
                    </div>
                    <p className="text-xs mt-2" data-unique-id="57c46bd9-ff22-411e-a1c3-eab8933f4b32" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{new Date(day.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}</p>
                  </div>)}
              </div>
              
              <div className="absolute top-2 right-2 flex items-center space-x-4 text-xs" data-unique-id="afb842ad-ca62-437e-9a92-482accb3a8a7" data-file-name="components/email-analytics.tsx">
                <div className="flex items-center" data-unique-id="93de5c18-80a4-4c8d-a76a-5a064e21e081" data-file-name="components/email-analytics.tsx">
                  <div className="w-3 h-3 bg-blue-400 mr-1" data-unique-id="46bd1292-df86-4102-a86e-6001c30283d0" data-file-name="components/email-analytics.tsx"></div>
                  <span data-unique-id="ce87a43e-eca3-4835-a90c-2f2770ae9ca1" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="6fd758e7-e929-4a30-80b4-16d864ddea20" data-file-name="components/email-analytics.tsx">Successful</span></span>
                </div>
                <div className="flex items-center" data-unique-id="73c0d7f3-09ad-42bc-a493-cc1fb1a463a8" data-file-name="components/email-analytics.tsx">
                  <div className="w-3 h-3 bg-red-200 mr-1" data-unique-id="617fddf0-86d8-4b38-88a9-7bb407025a7b" data-file-name="components/email-analytics.tsx"></div>
                  <span data-unique-id="b9b1f148-2d7b-4242-9b96-2a3716bb217a" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="95283a62-8a45-43e6-9435-bfbbb9a70891" data-file-name="components/email-analytics.tsx">Failed</span></span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4" data-unique-id="469b36af-2f29-429d-993a-d48624ebc6e9" data-file-name="components/email-analytics.tsx">
            <div className="border border-border rounded-lg p-4" data-unique-id="09717ed6-7bfc-4af3-881a-e9347a1fe5b7" data-file-name="components/email-analytics.tsx">
              <h3 className="text-sm font-medium mb-2" data-unique-id="36eef0e2-1718-408e-9f1d-db4cffb51143" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="309fb791-1934-44e3-be4d-0c57dd7ffc98" data-file-name="components/email-analytics.tsx">Top Delivery Issues</span></h3>
              <ul className="space-y-2 text-sm" data-unique-id="dfc847c8-34ca-4ea6-acf0-1c9c41ca1dac" data-file-name="components/email-analytics.tsx">
                <li className="flex justify-between" data-unique-id="803b0d42-e6d6-4d44-aed1-0c41e047a77b" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="3ae4d35a-7dd7-4064-a1d4-b90139b1300e" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="d86802ef-3591-440b-bdd3-15bdd33fd974" data-file-name="components/email-analytics.tsx">Invalid email address</span></span>
                  <span className="font-medium" data-unique-id="259ea771-8a1a-4903-9747-5c1d354a82b9" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="71a2b22c-cc04-4a62-ada9-dbfac9083cd4" data-file-name="components/email-analytics.tsx">42%</span></span>
                </li>
                <li className="flex justify-between" data-unique-id="69e2080f-0dcd-4074-9fa2-3d14180fc83f" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="cc81499f-53f1-465b-8940-9f5c22dcc9bd" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="916237f4-2b49-4d82-b921-7a03ed68f09f" data-file-name="components/email-analytics.tsx">Mailbox full</span></span>
                  <span className="font-medium" data-unique-id="915ed9ff-a6bb-49ef-b7d9-45c40df52e07" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="e7c9f6f1-4d7b-4445-8023-404a4e0276cc" data-file-name="components/email-analytics.tsx">27%</span></span>
                </li>
                <li className="flex justify-between" data-unique-id="ae7cb463-009c-438d-b749-25032ba1ecf5" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="9bfe79c1-c249-466b-89cd-a1ba48789c7c" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="f9319585-8660-41ac-8c69-de125fb2faa4" data-file-name="components/email-analytics.tsx">Spam filters</span></span>
                  <span className="font-medium" data-unique-id="dc4c0f49-6640-46ac-90c7-bfa6194108c6" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="c9c4dca3-2456-4895-b096-0f84bd02bb72" data-file-name="components/email-analytics.tsx">18%</span></span>
                </li>
                <li className="flex justify-between" data-unique-id="c36611d0-6487-4024-9b3e-5ac12e156eb1" data-file-name="components/email-analytics.tsx">
                  <span data-unique-id="a59bdd0a-86e9-46df-b1d4-91bd716d3eda" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="458f3894-cdfb-471c-9f5d-f37b4f4375dd" data-file-name="components/email-analytics.tsx">Other</span></span>
                  <span className="font-medium" data-unique-id="744e0aa3-bbb7-42fe-b5be-3174bae34f80" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="2ac28164-dbaa-46d5-913c-eb26be3acc1b" data-file-name="components/email-analytics.tsx">13%</span></span>
                </li>
              </ul>
            </div>
            
            <div className="border border-border rounded-lg p-4" data-unique-id="575eb620-2c07-4a35-944f-f2004729ebd1" data-file-name="components/email-analytics.tsx">
              <h3 className="text-sm font-medium mb-2" data-unique-id="a62ed9c5-e452-4b85-b936-76a8aa55e5dc" data-file-name="components/email-analytics.tsx"><span className="editable-text" data-unique-id="92201cc6-04eb-4051-bd57-d90e2327d4e0" data-file-name="components/email-analytics.tsx">Delivery Performance</span></h3>
              <div className="flex items-center justify-center h-32" data-unique-id="3e2de42e-b9b0-4291-a700-50fa582bdae4" data-file-name="components/email-analytics.tsx">
                <div className="relative w-32 h-32" data-unique-id="c90bcc2f-c794-4007-8645-65c11afc001a" data-file-name="components/email-analytics.tsx">
                  <svg viewBox="0 0 100 100" className="w-full h-full" data-unique-id="0c057a5a-2049-41dc-8cc2-0c506142ad6a" data-file-name="components/email-analytics.tsx">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="15" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="15" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - stats.deliveryRate / 100)} transform="rotate(-90 50 50)" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center" data-unique-id="725aea49-cbdd-4495-8e77-9bfe0aefa40d" data-file-name="components/email-analytics.tsx">
                    <span className="text-2xl font-bold" data-unique-id="01118569-8f46-4a49-8bd1-126c1a17a031" data-file-name="components/email-analytics.tsx" data-dynamic-text="true">{stats.deliveryRate}<span className="editable-text" data-unique-id="9d39ec3a-fb24-480c-8cef-1e6997df4674" data-file-name="components/email-analytics.tsx">%</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>}
    </motion.div>;
}