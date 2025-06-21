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
  }} className="w-full max-w-md p-8 bg-gray-800 rounded-xl shadow-2xl" data-unique-id="3556a1f7-0cf0-407c-8812-64e7f7428028" data-file-name="components/admin/login-form.tsx">
      <div className="text-center mb-8" data-unique-id="0e6b3e4b-a770-4081-9793-2338e77246a8" data-file-name="components/admin/login-form.tsx">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4" data-unique-id="7763a854-9f63-4311-a87f-6570f1584013" data-file-name="components/admin/login-form.tsx">
          <Shield className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white" data-unique-id="c0cec454-8e07-4ecf-8f84-7e004053deea" data-file-name="components/admin/login-form.tsx"><span className="editable-text" data-unique-id="4629b709-dc16-4abb-95aa-2bcad414d9a7" data-file-name="components/admin/login-form.tsx">Admin Access</span></h2>
        <p className="text-gray-400 mt-1" data-unique-id="14a8d10a-00cd-43ca-8379-d72254d252cf" data-file-name="components/admin/login-form.tsx"><span className="editable-text" data-unique-id="e01c06b5-f637-487b-8bb0-66bbe66430a2" data-file-name="components/admin/login-form.tsx">Restricted area - Authorized personnel only</span></p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" data-unique-id="79c4018f-718e-4801-8334-525157ac65ae" data-file-name="components/admin/login-form.tsx" data-dynamic-text="true">
        <div className="space-y-2" data-unique-id="12d1d64d-406c-4d01-b12a-c5f50c512c86" data-file-name="components/admin/login-form.tsx">
          <label className="text-sm font-medium text-gray-300 flex items-center" data-unique-id="f6d5e3fb-121e-475d-aa67-c187aa26871f" data-file-name="components/admin/login-form.tsx">
            <User className="w-4 h-4 mr-2" /><span className="editable-text" data-unique-id="6aa1be1d-6720-4f10-b1c8-29c07bdb53fd" data-file-name="components/admin/login-form.tsx">
            Username
          </span></label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white" placeholder="Enter your username" required data-unique-id="ec4d7a59-2ef0-40e7-a87e-10db5a85261c" data-file-name="components/admin/login-form.tsx" />
        </div>

        <div className="space-y-2" data-unique-id="3bc5451d-8710-4bc7-ad7a-3655c04146f6" data-file-name="components/admin/login-form.tsx">
          <label className="text-sm font-medium text-gray-300 flex items-center" data-unique-id="6ff8e9c1-7fba-4b42-a8b5-aceff30dac27" data-file-name="components/admin/login-form.tsx">
            <Lock className="w-4 h-4 mr-2" /><span className="editable-text" data-unique-id="37089e28-a2cc-458f-9ab3-639e42fad4a7" data-file-name="components/admin/login-form.tsx">
            Password
          </span></label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white" placeholder="Enter your password" required data-unique-id="e5af659d-1987-46d4-abed-f667eea53770" data-file-name="components/admin/login-form.tsx" />
        </div>

        {/* Admin login instructions removed for security */}

        {error && <motion.div initial={{
        opacity: 0,
        x: -10
      }} animate={{
        opacity: 1,
        x: 0
      }} className="p-3 bg-red-900/40 border border-red-800 rounded-md text-red-200 text-sm" data-unique-id="a5c90265-e960-4968-be7d-183e0a0aaeeb" data-file-name="components/admin/login-form.tsx" data-dynamic-text="true">
            {error}
          </motion.div>}

        <button type="submit" disabled={isLoading || !username || !password} className="w-full flex items-center justify-center py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors duration-200 disabled:opacity-50" data-unique-id="d9403b4f-2b96-431a-833e-bc66acc5bbab" data-file-name="components/admin/login-form.tsx" data-dynamic-text="true">
          {isLoading ? <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" /> 
              Authenticating...
            </> : <>Login</>}
        </button>
      </form>
    </motion.div>;
}