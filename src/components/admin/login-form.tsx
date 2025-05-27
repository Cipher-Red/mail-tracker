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
  }} className="w-full max-w-md p-8 bg-gray-800 rounded-xl shadow-2xl" data-unique-id="18e3cba7-7242-4f5e-bca6-d98616039b87" data-file-name="components/admin/login-form.tsx">
      <div className="text-center mb-8" data-unique-id="a70798a0-ede0-49fa-ba08-320bcbe1e0aa" data-file-name="components/admin/login-form.tsx">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4" data-unique-id="f80131a5-bf23-420d-b63d-dcb77c342aef" data-file-name="components/admin/login-form.tsx">
          <Shield className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white" data-unique-id="ebb3556e-bbdd-4f48-b79f-f862699da989" data-file-name="components/admin/login-form.tsx"><span className="editable-text" data-unique-id="d5682688-5e19-43b3-813a-719417b7dcf3" data-file-name="components/admin/login-form.tsx">Admin Access</span></h2>
        <p className="text-gray-400 mt-1" data-unique-id="c86845c8-c748-4af6-b9cb-0b6e37e97d26" data-file-name="components/admin/login-form.tsx"><span className="editable-text" data-unique-id="dcc97b24-0be5-4225-9091-e989dd1aa123" data-file-name="components/admin/login-form.tsx">Restricted area - Authorized personnel only</span></p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" data-unique-id="93f6cce5-a6a8-47cb-8900-86187db107cf" data-file-name="components/admin/login-form.tsx" data-dynamic-text="true">
        <div className="space-y-2" data-unique-id="098a7476-cee9-4903-8068-0f04dc09392e" data-file-name="components/admin/login-form.tsx">
          <label className="text-sm font-medium text-gray-300 flex items-center" data-unique-id="8bfb447d-3004-4bc0-a8b7-75f6862c9423" data-file-name="components/admin/login-form.tsx">
            <User className="w-4 h-4 mr-2" /><span className="editable-text" data-unique-id="4097e256-874c-4a8b-8af0-c3df7ae87270" data-file-name="components/admin/login-form.tsx">
            Username
          </span></label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white" placeholder="Enter your username" required data-unique-id="964180eb-3873-4963-9183-a5d3170e5ef6" data-file-name="components/admin/login-form.tsx" />
        </div>

        <div className="space-y-2" data-unique-id="bd45fd53-6b6a-47d9-b709-cc06d74d1c6e" data-file-name="components/admin/login-form.tsx">
          <label className="text-sm font-medium text-gray-300 flex items-center" data-unique-id="8a8d46fb-65c8-4f11-9d94-9ac66c70b17f" data-file-name="components/admin/login-form.tsx">
            <Lock className="w-4 h-4 mr-2" /><span className="editable-text" data-unique-id="79d7cc86-4724-49a6-bdf7-1594c5e24313" data-file-name="components/admin/login-form.tsx">
            Password
          </span></label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white" placeholder="Enter your password" required data-unique-id="eabcb534-3dba-4e22-a7df-f8b43123ef2d" data-file-name="components/admin/login-form.tsx" />
        </div>

        {/* Admin login instructions removed for security */}

        {error && <motion.div initial={{
        opacity: 0,
        x: -10
      }} animate={{
        opacity: 1,
        x: 0
      }} className="p-3 bg-red-900/40 border border-red-800 rounded-md text-red-200 text-sm" data-unique-id="4e68aaac-b665-4851-a8ef-5817ac86ddfe" data-file-name="components/admin/login-form.tsx" data-dynamic-text="true">
            {error}
          </motion.div>}

        <button type="submit" disabled={isLoading || !username || !password} className="w-full flex items-center justify-center py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors duration-200 disabled:opacity-50" data-unique-id="5676e0ee-41e7-4f00-be24-09f52aba5244" data-file-name="components/admin/login-form.tsx" data-dynamic-text="true">
          {isLoading ? <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" /> 
              Authenticating...
            </> : <>Login</>}
        </button>
      </form>
    </motion.div>;
}