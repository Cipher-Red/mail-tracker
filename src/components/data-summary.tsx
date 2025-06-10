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
  }} className="bg-card border border-border rounded-lg p-6 shadow-md" data-unique-id="91cb3ecb-4d50-4680-8bc7-1fc677d478b9" data-file-name="components/data-summary.tsx" data-dynamic-text="true">
      <div className="flex justify-between items-center mb-6" data-unique-id="c8bef5cb-3d96-4113-8650-6b0d2d283955" data-file-name="components/data-summary.tsx">
        <div className="flex items-center" data-unique-id="6f992b25-d2bd-4d1a-887a-fb0b97382b58" data-file-name="components/data-summary.tsx">
          <BarChart3 className="h-5 w-5 text-primary mr-2" />
          <h3 className="text-lg font-medium" data-unique-id="f1884d1b-cc55-4caf-9dce-9fdc59c56a85" data-file-name="components/data-summary.tsx"><span className="editable-text" data-unique-id="1b4cd75a-19bb-47d6-a786-9cb72f600cf3" data-file-name="components/data-summary.tsx">Data Summary</span></h3>
        </div>
        <button onClick={exportSummary} className="flex items-center px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors" data-unique-id="4419f44f-8651-4857-9215-ac6870b47b9d" data-file-name="components/data-summary.tsx">
          <Download className="h-4 w-4 mr-1" /><span className="editable-text" data-unique-id="740efaa1-39b3-460c-9f3a-b0a028c6966e" data-file-name="components/data-summary.tsx">
          Export
        </span></button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6" data-unique-id="900b2b85-aab8-4a79-9ec2-3279bdcc504c" data-file-name="components/data-summary.tsx">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200" data-unique-id="aaedeaf7-7ee7-4133-a0a6-8b096deef0e4" data-file-name="components/data-summary.tsx">
          <div className="flex items-center justify-between" data-unique-id="b7d4f943-3e27-49cc-a0a3-ad6b0dc7034d" data-file-name="components/data-summary.tsx">
            <div data-unique-id="1a636c44-95de-40f0-a1f9-aeeaae88701b" data-file-name="components/data-summary.tsx">
              <p className="text-xs text-blue-600 font-medium" data-unique-id="d993b85d-f062-44ba-8515-a7cb4e05d2c3" data-file-name="components/data-summary.tsx"><span className="editable-text" data-unique-id="19a19cc2-4424-4d6d-89ec-4199605eeab6" data-file-name="components/data-summary.tsx">Total Entries</span></p>
              <p className="text-2xl font-bold text-blue-800" data-unique-id="e1138f95-a0ee-41e0-9d10-b1933ce87cd7" data-file-name="components/data-summary.tsx" data-dynamic-text="true">{summary.totalEntries}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200" data-unique-id="65655178-3134-4a30-9bc5-48675762634c" data-file-name="components/data-summary.tsx">
          <div className="flex items-center justify-between" data-unique-id="0690cb9b-e901-4663-b915-89acc1011f5c" data-file-name="components/data-summary.tsx">
            <div data-unique-id="1f1cdbd5-0345-4b70-ae9f-2f13fe83ab68" data-file-name="components/data-summary.tsx">
              <p className="text-xs text-green-600 font-medium" data-unique-id="3d828813-463c-41b6-a054-23c4eac2e2e4" data-file-name="components/data-summary.tsx"><span className="editable-text" data-unique-id="272a50a0-ce34-4cce-8312-1b2487de95f9" data-file-name="components/data-summary.tsx">Push Actions</span></p>
              <p className="text-2xl font-bold text-green-800" data-unique-id="a9ef274e-ae92-42d3-8b56-af1850902608" data-file-name="components/data-summary.tsx" data-dynamic-text="true">{summary.pushCount}</p>
            </div>
            <ArrowUp className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200" data-unique-id="158d223e-c202-4bbc-926d-5d8012852cb8" data-file-name="components/data-summary.tsx">
          <div className="flex items-center justify-between" data-unique-id="d0237161-12c1-4486-8496-f0f09980bb73" data-file-name="components/data-summary.tsx">
            <div data-unique-id="7cdf799e-1fbb-43bb-be53-f922685a7d20" data-file-name="components/data-summary.tsx">
              <p className="text-xs text-purple-600 font-medium" data-unique-id="f87da4d2-20ab-4bba-83cf-1677f1f9fef7" data-file-name="components/data-summary.tsx"><span className="editable-text" data-unique-id="36ab3ddb-b445-4e1e-a13c-fd039ea01c88" data-file-name="components/data-summary.tsx">Pull Actions</span></p>
              <p className="text-2xl font-bold text-purple-800" data-unique-id="411868d8-8567-460d-8347-bf3629e161c6" data-file-name="components/data-summary.tsx" data-dynamic-text="true">{summary.pullCount}</p>
            </div>
            <ArrowDown className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200" data-unique-id="7cc049bd-4df8-49fa-b52d-298460e52a62" data-file-name="components/data-summary.tsx">
          <div className="flex items-center justify-between" data-unique-id="9c880b33-87e8-4adf-91b3-35c62de1c5cd" data-file-name="components/data-summary.tsx">
            <div data-unique-id="b0d31900-1fa9-4143-a4d5-f2485c5f9218" data-file-name="components/data-summary.tsx">
              <p className="text-xs text-orange-600 font-medium" data-unique-id="028e2724-1057-4fc5-b24a-fd92b9e1b904" data-file-name="components/data-summary.tsx"><span className="editable-text" data-unique-id="cd83ce4d-605b-4ac0-8d2f-faba731b5c6c" data-file-name="components/data-summary.tsx">Active Teams</span></p>
              <p className="text-2xl font-bold text-orange-800" data-unique-id="470b4aa1-b5ad-405f-b1cd-5ca54c7de1e9" data-file-name="components/data-summary.tsx" data-dynamic-text="true">{Object.keys(summary.teamSummary).length}</p>
            </div>
            <Users className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Team Breakdown */}
      <div className="mb-6" data-unique-id="52038456-efaa-4ab3-8a5a-1713348ca464" data-file-name="components/data-summary.tsx">
        <h4 className="text-sm font-medium mb-3 flex items-center" data-unique-id="8c68b3fc-2f57-4237-a6b5-7b26a8180f19" data-file-name="components/data-summary.tsx">
          <Users className="h-4 w-4 mr-2 text-primary" /><span className="editable-text" data-unique-id="4b497424-3cf6-42d3-ba7a-dd5c81d96ed3" data-file-name="components/data-summary.tsx">
          Team Performance
        </span></h4>
        <div className="space-y-2" data-unique-id="c1449a36-65b1-4046-897a-f938f3207aae" data-file-name="components/data-summary.tsx" data-dynamic-text="true">
          {Object.entries(summary.teamSummary).map(([team, stats]) => {
          const total = stats.push + stats.pull;
          const pushPercentage = total > 0 ? stats.push / total * 100 : 0;
          const pullPercentage = total > 0 ? stats.pull / total * 100 : 0;
          return <div key={team} className="bg-gray-50 p-3 rounded-md" data-unique-id="287d6203-4afe-4267-b4f9-ff175bb764b3" data-file-name="components/data-summary.tsx">
                <div className="flex justify-between items-center mb-2" data-unique-id="879af4a4-dfa4-4e9f-8a64-bf7252724ef6" data-file-name="components/data-summary.tsx">
                  <span className="font-medium text-sm" data-unique-id="fa2f26db-ade2-43cb-ad6d-b2067bd20312" data-file-name="components/data-summary.tsx" data-dynamic-text="true">{team}</span>
                  <span className="text-xs text-muted-foreground" data-unique-id="6b3d752e-544b-48e4-934e-ca95d7e1bcc0" data-file-name="components/data-summary.tsx" data-dynamic-text="true">
                    {stats.push}<span className="editable-text" data-unique-id="ddde2858-50ed-465a-a42c-e6d6d73c2285" data-file-name="components/data-summary.tsx"> Push, </span>{stats.pull}<span className="editable-text" data-unique-id="c18da2f1-3262-4020-b61f-177a6c14f217" data-file-name="components/data-summary.tsx"> Pull
                  </span></span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden" data-unique-id="2a23e3ce-6404-406c-9bc7-460d5d58c358" data-file-name="components/data-summary.tsx">
                  <div className="h-full flex" data-unique-id="6007303f-04fe-4941-bf05-087ba91932ba" data-file-name="components/data-summary.tsx">
                    <div className="bg-green-500" style={{
                  width: `${pushPercentage}%`
                }} data-unique-id="12a8b7fd-98b5-4c99-967a-50474af3f204" data-file-name="components/data-summary.tsx"></div>
                    <div className="bg-blue-500" style={{
                  width: `${pullPercentage}%`
                }} data-unique-id="dbc05ec3-aa02-4316-99de-e00d81fb02ce" data-file-name="components/data-summary.tsx"></div>
                  </div>
                </div>
              </div>;
        })}
        </div>
      </div>

      {/* Progress Distribution */}
      <div data-unique-id="4e8ff11e-9ed9-4031-a450-e6c7bf62de3e" data-file-name="components/data-summary.tsx">
        <h4 className="text-sm font-medium mb-3 flex items-center" data-unique-id="45d48925-0ad9-4f97-996a-e07246ee5475" data-file-name="components/data-summary.tsx">
          <TrendingUp className="h-4 w-4 mr-2 text-primary" /><span className="editable-text" data-unique-id="f1a36964-4716-458c-bf1e-2a96a12673c8" data-file-name="components/data-summary.tsx">
          Progress Distribution
        </span></h4>
        <div className="grid grid-cols-2 gap-2" data-unique-id="4c6559ee-5b8c-44fc-a2e8-81c1c81c5d90" data-file-name="components/data-summary.tsx" data-dynamic-text="true">
          {Object.entries(summary.progressSummary).map(([progress, count]) => <div key={progress} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm" data-unique-id="a448c9e7-fae2-43a9-8b2c-4cf56c28afa1" data-file-name="components/data-summary.tsx">
              <span data-unique-id="3811f11d-36ec-4e42-9cc9-5dcfba37150c" data-file-name="components/data-summary.tsx" data-dynamic-text="true">{progress}</span>
              <span className="font-medium" data-unique-id="19ce2a57-02b3-4ec0-87d6-701bf34b7a5f" data-file-name="components/data-summary.tsx" data-dynamic-text="true">{count as number}</span>
            </div>)}
        </div>
      </div>
    </motion.div>;
}