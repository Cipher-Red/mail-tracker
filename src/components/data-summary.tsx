'use client';

import { motion } from 'framer-motion';
import { useDataExplorerStore } from '@/lib/data-explorer-store';
import { BarChart3, ArrowUp, ArrowDown, Users, TrendingUp, Download } from 'lucide-react';
export default function DataSummary() {
  const {
    getSummary,
    filteredItems
  } = useDataExplorerStore();
  const summary = getSummary ? getSummary() : {
    totalEntries: 0,
    pushCount: 0,
    pullCount: 0,
    teamSummary: {},
    progressSummary: {}
  };
  const exportSummary = () => {
    const csvData = [['Summary Report'], ['Generated on:', new Date().toLocaleDateString()], [''], ['Overall Statistics'], ['Total Entries:', summary.totalEntries], ['Push Actions:', summary.pushCount], ['Pull Actions:', summary.pullCount], [''], ['Team Breakdown'], ['Team', 'Push', 'Pull', 'Total']];
    Object.entries(summary.teamSummary).forEach(([team, stats]) => {
      csvData.push([team, stats.push.toString(), stats.pull.toString(), (stats.push + stats.pull).toString()]);
    });
    csvData.push([''], ['Progress Distribution']);
    Object.entries(summary.progressSummary).forEach(([progress, count]) => {
      csvData.push([progress, count.toString()]);
    });
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], {
      type: 'text/csv'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data-summary-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return <motion.div initial={{
    opacity: 0,
    y: 10
  }} animate={{
    opacity: 1,
    y: 0
  }} className="bg-card border border-border rounded-lg p-6 shadow-md" data-unique-id="ce719e4a-3f7b-42da-ba27-0c3d847d3025" data-file-name="components/data-summary.tsx" data-dynamic-text="true">
      <div className="flex justify-between items-center mb-6" data-unique-id="48df6a8e-da01-4e1e-864a-d6b770e2d567" data-file-name="components/data-summary.tsx">
        <div className="flex items-center" data-unique-id="7f8f7cac-02a4-441f-9fac-453735586459" data-file-name="components/data-summary.tsx">
          <BarChart3 className="h-5 w-5 text-primary mr-2" />
          <h3 className="text-lg font-medium" data-unique-id="ad13e3bf-56a6-4e5f-98a5-d99fed8df03b" data-file-name="components/data-summary.tsx"><span className="editable-text" data-unique-id="421c0588-67ef-4fe2-bf58-111dec16c310" data-file-name="components/data-summary.tsx">Data Summary</span></h3>
        </div>
        <button onClick={exportSummary} className="flex items-center px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors" data-unique-id="c1bc8f58-095d-4685-a012-4ccf1abdd5da" data-file-name="components/data-summary.tsx">
          <Download className="h-4 w-4 mr-1" /><span className="editable-text" data-unique-id="166ec900-eaf6-4bd0-97ca-ecb19760ee18" data-file-name="components/data-summary.tsx">
          Export
        </span></button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6" data-unique-id="36102fb7-a0e8-409f-9db7-44bd475fa219" data-file-name="components/data-summary.tsx">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200" data-unique-id="ee5c9ee1-deab-4fcc-b307-4ff37876c869" data-file-name="components/data-summary.tsx">
          <div className="flex items-center justify-between" data-unique-id="4ad075a3-6849-4245-b397-388842fff0f6" data-file-name="components/data-summary.tsx">
            <div data-unique-id="be4076fd-44fb-4571-bac1-fe9fd76c0858" data-file-name="components/data-summary.tsx">
              <p className="text-xs text-blue-600 font-medium" data-unique-id="24f2a79b-ad13-4cbb-9ccd-938077c11850" data-file-name="components/data-summary.tsx"><span className="editable-text" data-unique-id="2e124917-9c14-41e0-b108-198a7daae5fc" data-file-name="components/data-summary.tsx">Total Entries</span></p>
              <p className="text-2xl font-bold text-blue-800" data-unique-id="f32a87be-80d2-401c-8ef8-292e139a4ed3" data-file-name="components/data-summary.tsx" data-dynamic-text="true">{summary.totalEntries}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200" data-unique-id="0ca7f78c-f334-418d-843c-3a698b568ef8" data-file-name="components/data-summary.tsx">
          <div className="flex items-center justify-between" data-unique-id="a0e32f79-3c4e-45c4-b571-fca339ee02db" data-file-name="components/data-summary.tsx">
            <div data-unique-id="10c21e04-6cdf-4ce6-b0bc-75e33f211024" data-file-name="components/data-summary.tsx">
              <p className="text-xs text-green-600 font-medium" data-unique-id="c72fc95b-e495-4d75-89e1-345ea8d3722b" data-file-name="components/data-summary.tsx"><span className="editable-text" data-unique-id="ced3409f-d487-4d53-9435-aae607dbd4da" data-file-name="components/data-summary.tsx">Push Actions</span></p>
              <p className="text-2xl font-bold text-green-800" data-unique-id="2bab09fd-353a-4882-ba70-6fda5af9525d" data-file-name="components/data-summary.tsx" data-dynamic-text="true">{summary.pushCount}</p>
            </div>
            <ArrowUp className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200" data-unique-id="36504b04-6c61-4baa-9241-95adf2b07ef6" data-file-name="components/data-summary.tsx">
          <div className="flex items-center justify-between" data-unique-id="753b9991-4520-4d33-a913-2bfef2357429" data-file-name="components/data-summary.tsx">
            <div data-unique-id="ede41879-d530-4323-8288-7adeba640f23" data-file-name="components/data-summary.tsx">
              <p className="text-xs text-purple-600 font-medium" data-unique-id="3412d133-3ead-42ac-8049-980d133f56c7" data-file-name="components/data-summary.tsx"><span className="editable-text" data-unique-id="ba47ec2d-dc68-43b6-b4da-6a5a05d46105" data-file-name="components/data-summary.tsx">Pull Actions</span></p>
              <p className="text-2xl font-bold text-purple-800" data-unique-id="4534e862-cd21-4a78-9535-440e1e395c5c" data-file-name="components/data-summary.tsx" data-dynamic-text="true">{summary.pullCount}</p>
            </div>
            <ArrowDown className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200" data-unique-id="470704ba-c9a3-47b9-ae83-de9e8f884c5c" data-file-name="components/data-summary.tsx">
          <div className="flex items-center justify-between" data-unique-id="bf18df60-33c8-46f0-b4c1-4841749c2909" data-file-name="components/data-summary.tsx">
            <div data-unique-id="a8c05c75-1f9f-43b5-a81b-78722b40fc0a" data-file-name="components/data-summary.tsx">
              <p className="text-xs text-orange-600 font-medium" data-unique-id="2563accd-ea86-4408-8be1-404c1f944dc1" data-file-name="components/data-summary.tsx"><span className="editable-text" data-unique-id="7cb66614-186d-4991-bfae-b4ae6ac7febd" data-file-name="components/data-summary.tsx">Active Teams</span></p>
              <p className="text-2xl font-bold text-orange-800" data-unique-id="ffcabc8f-23d9-468d-9a15-4271a46bef2a" data-file-name="components/data-summary.tsx" data-dynamic-text="true">{Object.keys(summary.teamSummary).length}</p>
            </div>
            <Users className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Team Breakdown */}
      <div className="mb-6" data-unique-id="5417c326-6899-4a3c-81eb-20b2b0a513d9" data-file-name="components/data-summary.tsx">
        <h4 className="text-sm font-medium mb-3 flex items-center" data-unique-id="c70b7b11-aceb-4b84-8d08-13daf990c3a1" data-file-name="components/data-summary.tsx">
          <Users className="h-4 w-4 mr-2 text-primary" /><span className="editable-text" data-unique-id="d495a00d-e447-4bb3-815e-7d585ee583fb" data-file-name="components/data-summary.tsx">
          Team Performance
        </span></h4>
        <div className="space-y-2" data-unique-id="70df5974-e7b0-498d-9cb6-dcd34507d3ed" data-file-name="components/data-summary.tsx" data-dynamic-text="true">
          {Object.entries(summary.teamSummary).map(([team, stats]) => {
          const total = stats.push + stats.pull;
          const pushPercentage = total > 0 ? stats.push / total * 100 : 0;
          const pullPercentage = total > 0 ? stats.pull / total * 100 : 0;
          return <div key={team} className="bg-gray-50 p-3 rounded-md" data-unique-id="7097fd79-7b22-4555-8ab9-6c509e0475d1" data-file-name="components/data-summary.tsx">
                <div className="flex justify-between items-center mb-2" data-unique-id="d85a3c85-f941-4315-bfc5-cd0d4301827a" data-file-name="components/data-summary.tsx">
                  <span className="font-medium text-sm" data-unique-id="43283a7a-a625-4e27-8910-7b7b509e2f7d" data-file-name="components/data-summary.tsx" data-dynamic-text="true">{team}</span>
                  <span className="text-xs text-muted-foreground" data-unique-id="f9f1ad8b-300c-4d5b-9d65-ef819fa6acb0" data-file-name="components/data-summary.tsx" data-dynamic-text="true">
                    {stats.push}<span className="editable-text" data-unique-id="b387d4ac-0066-4a79-aacd-b5a14af519c1" data-file-name="components/data-summary.tsx"> Push, </span>{stats.pull}<span className="editable-text" data-unique-id="1ab87334-72a9-4e51-9228-a998c304c5d8" data-file-name="components/data-summary.tsx"> Pull
                  </span></span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden" data-unique-id="e963d206-0efd-4231-8079-47c8f51132b5" data-file-name="components/data-summary.tsx">
                  <div className="h-full flex" data-unique-id="1a64fab5-fd08-4bdf-948a-36864fc2f3df" data-file-name="components/data-summary.tsx">
                    <div className="bg-green-500" style={{
                  width: `${pushPercentage}%`
                }} data-unique-id="22d3152b-b43e-466e-8026-4c442543805d" data-file-name="components/data-summary.tsx"></div>
                    <div className="bg-blue-500" style={{
                  width: `${pullPercentage}%`
                }} data-unique-id="117030d5-4645-4544-9c9b-d0ecbf7894a3" data-file-name="components/data-summary.tsx"></div>
                  </div>
                </div>
              </div>;
        })}
        </div>
      </div>

      {/* Progress Distribution */}
      <div data-unique-id="30fb812a-66c5-4d82-9113-141045b3b5b2" data-file-name="components/data-summary.tsx">
        <h4 className="text-sm font-medium mb-3 flex items-center" data-unique-id="aab4a8b7-12cd-4083-8877-309067a3c6a9" data-file-name="components/data-summary.tsx">
          <TrendingUp className="h-4 w-4 mr-2 text-primary" /><span className="editable-text" data-unique-id="f831c98e-85ee-4723-8c46-467cd4400233" data-file-name="components/data-summary.tsx">
          Progress Distribution
        </span></h4>
        <div className="grid grid-cols-2 gap-2" data-unique-id="4818ca12-3e12-4aaf-9305-805d056c2a7e" data-file-name="components/data-summary.tsx" data-dynamic-text="true">
          {Object.entries(summary.progressSummary).map(([progress, count]) => <div key={progress} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm" data-unique-id="e38d96ea-245a-4ad4-86f0-2b8056fbfa50" data-file-name="components/data-summary.tsx">
              <span data-unique-id="0aa2139f-9414-4619-8344-921ae41653fe" data-file-name="components/data-summary.tsx" data-dynamic-text="true">{progress}</span>
              <span className="font-medium" data-unique-id="f672a55a-0bf4-418a-9730-a1c06c2eba0d" data-file-name="components/data-summary.tsx" data-dynamic-text="true">{count as number}</span>
            </div>)}
        </div>
      </div>
    </motion.div>;
}