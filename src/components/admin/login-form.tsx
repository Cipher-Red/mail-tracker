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
  }} className="w-full max-w-md p-8 bg-gray-800 rounded-xl shadow-2xl" data-unique-id="14b48a5b-a1b9-4e07-9867-e207bf945984" data-file-name="components/admin/login-form.tsx">
      <div className="text-center mb-8" data-unique-id="9148551b-67e1-4d84-82e3-d7d6cbaf718a" data-file-name="components/admin/login-form.tsx">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4" data-unique-id="0a9b01fa-f97a-4988-b380-b62e2e2b19df" data-file-name="components/admin/login-form.tsx">
          <Shield className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white" data-unique-id="8e567e79-f246-4173-964a-89cf822728d8" data-file-name="components/admin/login-form.tsx"><span className="editable-text" data-unique-id="50833730-035c-463f-963e-f33ff6597475" data-file-name="components/admin/login-form.tsx">Admin Access</span></h2>
        <p className="text-gray-400 mt-1" data-unique-id="aade6879-df3e-474f-bcb9-460afb78f07f" data-file-name="components/admin/login-form.tsx"><span className="editable-text" data-unique-id="80e3375f-9f89-4a82-9541-60cc615cab35" data-file-name="components/admin/login-form.tsx">Restricted area - Authorized personnel only</span></p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" data-unique-id="8b963dc3-c236-463a-bcaf-4066af6bc9a7" data-file-name="components/admin/login-form.tsx" data-dynamic-text="true">
        <div className="space-y-2" data-unique-id="35a0394b-2b75-46db-8b69-69a1d1c0f67b" data-file-name="components/admin/login-form.tsx">
          <label className="text-sm font-medium text-gray-300 flex items-center" data-unique-id="7588075d-1268-46c8-9b54-72f63596ecab" data-file-name="components/admin/login-form.tsx">
            <User className="w-4 h-4 mr-2" /><span className="editable-text" data-unique-id="b72e9e5c-6bad-4af2-913f-5dce5a5fb974" data-file-name="components/admin/login-form.tsx">
            Username
          </span></label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white" placeholder="Enter your username" required data-unique-id="39fbd7ce-6f47-4a33-80ea-8a362387bab3" data-file-name="components/admin/login-form.tsx" />
        </div>

        <div className="space-y-2" data-unique-id="d91252f4-40df-4161-808b-b72a81c0bb16" data-file-name="components/admin/login-form.tsx">
          <label className="text-sm font-medium text-gray-300 flex items-center" data-unique-id="b7b19749-b345-4eed-9d37-6c8fab5de6f1" data-file-name="components/admin/login-form.tsx">
            <Lock className="w-4 h-4 mr-2" /><span className="editable-text" data-unique-id="0caa39b6-0417-40e4-8bc4-47acc9e7a3e1" data-file-name="components/admin/login-form.tsx">
            Password
          </span></label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white" placeholder="Enter your password" required data-unique-id="6527439a-349f-4109-8e1a-4c75b060fd40" data-file-name="components/admin/login-form.tsx" />
        </div>

        {/* Admin login instructions removed for security */}

        {error && <motion.div initial={{
        opacity: 0,
        x: -10
      }} animate={{
        opacity: 1,
        x: 0
      }} className="p-3 bg-red-900/40 border border-red-800 rounded-md text-red-200 text-sm" data-unique-id="9cb56c7e-33b5-4615-83d7-3a419b6d05df" data-file-name="components/admin/login-form.tsx" data-dynamic-text="true">
            {error}
          </motion.div>}

        <button type="submit" disabled={isLoading || !username || !password} className="w-full flex items-center justify-center py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors duration-200 disabled:opacity-50" data-unique-id="5b8fcda5-f5ed-46a3-88c0-41a14424bdb0" data-file-name="components/admin/login-form.tsx" data-dynamic-text="true">
          {isLoading ? <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" /> 
              Authenticating...
            </> : <>Login</>}
        </button>
      </form>
    </motion.div>;
}