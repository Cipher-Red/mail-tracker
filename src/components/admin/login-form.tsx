'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAdminAuth } from '@/lib/admin-auth';
import { Lock, User, Shield, Loader2, Info } from 'lucide-react';
export default function AdminLoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {
    login,
    error,
    isLoading
  } = useAdminAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
  };
  return <motion.div initial={{
    opacity: 0,
    y: -20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.3
  }} className="w-full max-w-md p-8 bg-gray-800 rounded-xl shadow-2xl" data-unique-id="5c102337-6cb1-4e57-bb8f-a74ab0e0b84a" data-file-name="components/admin/login-form.tsx">
      <div className="text-center mb-8" data-unique-id="7e61255d-48c0-4530-ad6c-f59295b8dd2c" data-file-name="components/admin/login-form.tsx">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4" data-unique-id="54320f35-f7c9-4083-bdb9-f27ac673630f" data-file-name="components/admin/login-form.tsx">
          <Shield className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white" data-unique-id="c8e02486-4f5a-47d7-8461-196e01c28c47" data-file-name="components/admin/login-form.tsx"><span className="editable-text" data-unique-id="e679b365-1d5d-407e-9bd7-a5645ee7f069" data-file-name="components/admin/login-form.tsx">Admin Access</span></h2>
        <p className="text-gray-400 mt-1" data-unique-id="4cbd0819-19d3-44cf-b4d9-706787592eed" data-file-name="components/admin/login-form.tsx"><span className="editable-text" data-unique-id="981fa68e-3a8b-438b-abdd-ca0429bf9bc1" data-file-name="components/admin/login-form.tsx">Restricted area - Authorized personnel only</span></p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" data-unique-id="ea5c25a4-5727-4741-966f-47fd25aa2a2f" data-file-name="components/admin/login-form.tsx" data-dynamic-text="true">
        <div className="space-y-2" data-unique-id="f9ebf8a0-d104-4831-b3ba-32d232ee294a" data-file-name="components/admin/login-form.tsx">
          <label className="text-sm font-medium text-gray-300 flex items-center" data-unique-id="3b8ad14c-39e8-438d-aa83-650d2347c53e" data-file-name="components/admin/login-form.tsx">
            <User className="w-4 h-4 mr-2" /><span className="editable-text" data-unique-id="610b636d-cbe4-4e4b-a26f-e33b4b850a27" data-file-name="components/admin/login-form.tsx">
            Username
          </span></label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white" placeholder="Enter your username" required data-unique-id="0d8804a1-b8b8-4f2f-904d-13427fc5658c" data-file-name="components/admin/login-form.tsx" />
        </div>

        <div className="space-y-2" data-unique-id="2ce29c3f-19ec-409e-8ad7-c80ffdf33583" data-file-name="components/admin/login-form.tsx">
          <label className="text-sm font-medium text-gray-300 flex items-center" data-unique-id="5806d2e3-86f1-417c-8878-fed3880cea0a" data-file-name="components/admin/login-form.tsx">
            <Lock className="w-4 h-4 mr-2" /><span className="editable-text" data-unique-id="da2f93ca-1859-4211-921a-bdb4e9b78b8a" data-file-name="components/admin/login-form.tsx">
            Password
          </span></label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white" placeholder="Enter your password" required data-unique-id="92eb8615-36c6-4b7d-acc9-57a6ff71c04a" data-file-name="components/admin/login-form.tsx" />
        </div>

        {/* Admin login instructions removed for security */}

        {error && <motion.div initial={{
        opacity: 0,
        x: -10
      }} animate={{
        opacity: 1,
        x: 0
      }} className="p-3 bg-red-900/40 border border-red-800 rounded-md text-red-200 text-sm" data-unique-id="873f7a6e-83b3-4d77-946a-bb642420601d" data-file-name="components/admin/login-form.tsx" data-dynamic-text="true">
            {error}
          </motion.div>}

        <button type="submit" disabled={isLoading || !username || !password} className="w-full flex items-center justify-center py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors duration-200 disabled:opacity-50" data-unique-id="d24a6464-586d-4558-a203-5972e0fc5ecf" data-file-name="components/admin/login-form.tsx" data-dynamic-text="true">
          {isLoading ? <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" /> 
              Authenticating...
            </> : <>Login</>}
        </button>
      </form>
    </motion.div>;
}