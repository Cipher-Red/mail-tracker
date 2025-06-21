'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminAuth, AdminUser } from '@/lib/admin-auth';
import { Users, UserPlus, Trash2, Mail, Key, User, Shield, X, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
export default function UserManagementPage() {
  const {
    users,
    currentUser,
    addUser,
    deleteUser,
    error
  } = useAdminAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    role: 'admin' as 'admin' | 'superadmin'
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if current user is superadmin
  const isSuperAdmin = currentUser?.role === 'superadmin';
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    // Validate form
    if (!newUser.username || !newUser.password || !newUser.email) {
      setFormError('All fields are required');
      return;
    }
    if (newUser.password !== newUser.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    if (newUser.password.length < 8) {
      setFormError('Password must be at least 8 characters long');
      return;
    }
    try {
      setIsSubmitting(true);

      // Create user without the passwordHash and confirmPassword fields
      const {
        confirmPassword,
        password,
        ...userData
      } = newUser;
      const success = await addUser(userData, password);
      if (success) {
        setFormSuccess('User created successfully');
        setNewUser({
          username: '',
          password: '',
          confirmPassword: '',
          email: '',
          role: 'admin'
        });

        // Close modal after a delay
        setTimeout(() => {
          setIsModalOpen(false);
          setFormSuccess(null);
        }, 2000);
      } else {
        setFormError('Failed to create user');
      }
    } catch (err) {
      console.error('Error creating user:', err);
      setFormError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDeleteUser = async (username: string) => {
    try {
      const success = await deleteUser(username);
      if (!success) {
        window.alert('Failed to delete user');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      window.alert('An error occurred while deleting the user');
    } finally {
      setDeleteConfirm(null);
    }
  };
  return <div className="space-y-6" data-unique-id="6d8e77fa-a61b-499f-a705-7c2b1ee5d8ae" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true">
      <div className="flex justify-between items-center" data-unique-id="ff6f9c09-418c-49de-81ea-2b6785535c32" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3" data-unique-id="54e29c90-85a9-4d65-9fcb-f930d9fdd5ca" data-file-name="app/admin/users/page.tsx">
          <Users className="h-8 w-8 text-indigo-400" /><span className="editable-text" data-unique-id="462fad28-11ba-4151-9570-fbd41d2f95f3" data-file-name="app/admin/users/page.tsx">
          User Management
        </span></h1>
        
        {isSuperAdmin && <button onClick={() => setIsModalOpen(true)} className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center" data-unique-id="a796cc71-5ae3-4800-8c91-c89879ad5af5" data-file-name="app/admin/users/page.tsx">
            <UserPlus className="h-5 w-5 mr-2" /><span className="editable-text" data-unique-id="679fb433-60de-4a5c-841f-d03e4a805aee" data-file-name="app/admin/users/page.tsx">
            Add Admin User
          </span></button>}
      </div>
      
      {!isSuperAdmin && <div className="p-4 bg-amber-950/30 border border-amber-800/50 rounded-lg text-amber-400 flex items-center" data-unique-id="0493028b-6e59-4b48-9318-2f956d0c2add" data-file-name="app/admin/users/page.tsx">
          <AlertTriangle className="h-5 w-5 mr-2" /><span className="editable-text" data-unique-id="af328ccb-f5bd-46fe-95db-bacfb1141b49" data-file-name="app/admin/users/page.tsx">
          Only superadmin users can manage other users
        </span></div>}
      
      {/* Users List */}
      <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden" data-unique-id="1c958bab-c69d-4a99-868a-f6d5da45433c" data-file-name="app/admin/users/page.tsx">
        <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center" data-unique-id="3351a0d4-5c62-42dd-8c9f-d92cf4c41a8c" data-file-name="app/admin/users/page.tsx">
          <h2 className="text-lg font-semibold text-white" data-unique-id="1670385d-30fe-427c-a848-d81488b984c7" data-file-name="app/admin/users/page.tsx"><span className="editable-text" data-unique-id="a5c61b97-8ade-4d03-a2c8-a2e2fd723c1f" data-file-name="app/admin/users/page.tsx">Admin Users</span></h2>
          <div className="text-sm text-gray-400" data-unique-id="243b617b-7d82-4028-ae4f-e413fe344dad" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true">
            {users.length}<span className="editable-text" data-unique-id="23de725a-49a5-4ddf-9f64-b968caa85732" data-file-name="app/admin/users/page.tsx"> users
          </span></div>
        </div>
        
        <div className="divide-y divide-gray-700" data-unique-id="c2f8dd7d-955c-4815-9358-f15e6d01c59a" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true">
          {users.map(user => <motion.div key={user.username} initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} className="p-5 hover:bg-gray-700/30" data-unique-id="ffa033e6-f4d1-49d0-a964-4a4abed96016" data-file-name="app/admin/users/page.tsx">
              <div className="flex justify-between items-center" data-unique-id="37848e3f-6ce1-443d-bbd6-6034eca8b1f3" data-file-name="app/admin/users/page.tsx">
                <div className="flex items-center space-x-4" data-unique-id="ab2cf61e-bc6b-4bc2-aefe-347de1bfedc3" data-file-name="app/admin/users/page.tsx">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.role === 'superadmin' ? 'bg-red-600/30' : 'bg-blue-600/30'}`} data-unique-id="2b95a337-037e-4854-a9a6-0a99c71a4520" data-file-name="app/admin/users/page.tsx">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  
                  <div data-unique-id="cdc725bc-e4be-4290-af13-a7c53744e6c9" data-file-name="app/admin/users/page.tsx">
                    <div className="font-medium text-white flex items-center" data-unique-id="e8bf5ad2-98e7-4144-af05-1e438f42b3ec" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true">
                      {user.username}
                      {user.role === 'superadmin' && <span className="ml-2 px-2 py-0.5 bg-red-900/50 text-red-300 text-xs rounded-full" data-unique-id="31bc8c71-300c-4737-b8cc-078368e16f95" data-file-name="app/admin/users/page.tsx"><span className="editable-text" data-unique-id="fb577d39-6c5a-425d-aabe-995932b788bd" data-file-name="app/admin/users/page.tsx">
                          Super Admin
                        </span></span>}
                      {user.username === currentUser?.username && <span className="ml-2 px-2 py-0.5 bg-green-900/50 text-green-300 text-xs rounded-full" data-unique-id="b25806cc-c7d5-4158-b4ef-b44c28bd3b19" data-file-name="app/admin/users/page.tsx"><span className="editable-text" data-unique-id="aae8962f-56f7-40f6-b923-c4d99603e771" data-file-name="app/admin/users/page.tsx">
                          You
                        </span></span>}
                    </div>
                    <div className="text-sm text-gray-400 flex items-center mt-1" data-unique-id="6dc0c0f4-c550-4756-aafb-72c206969600" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true">
                      <Mail className="h-3.5 w-3.5 mr-1" />
                      {user.email}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3" data-unique-id="f7016c8d-8d84-404e-8b18-5ed833ead576" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true">
                  {user.last_login && <div className="text-xs text-gray-400" data-unique-id="1afa5e49-90b7-495e-9b96-a3f1a4d7c413" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="b8cead89-88d2-41fc-a133-703a1516665f" data-file-name="app/admin/users/page.tsx">
                      Last login: </span>{new Date(user.last_login).toLocaleString()}
                    </div>}
                  
                  {isSuperAdmin && user.role !== 'superadmin' && user.username !== 'Qais' && <div data-unique-id="b5142b03-cef9-4138-8918-9e04a07d63aa" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true">
                      {deleteConfirm === user.username ? <div className="flex items-center gap-2" data-unique-id="14a01ff0-334b-47d5-bbcb-424646320948" data-file-name="app/admin/users/page.tsx">
                          <button onClick={() => handleDeleteUser(user.username)} className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700" data-unique-id="e9ca1665-2fd9-4d65-8f97-505b101f8551" data-file-name="app/admin/users/page.tsx"><span className="editable-text" data-unique-id="8665cce4-7510-4498-91b2-986d35d68fd7" data-file-name="app/admin/users/page.tsx">
                            Confirm
                          </span></button>
                          <button onClick={() => setDeleteConfirm(null)} className="px-3 py-1 bg-gray-600 text-white text-sm rounded-md" data-unique-id="ade5cf58-d3bd-4c5c-abd1-e4e2ca3dc696" data-file-name="app/admin/users/page.tsx"><span className="editable-text" data-unique-id="fa329f2a-e89c-43eb-ac21-f0e981f7e8d4" data-file-name="app/admin/users/page.tsx">
                            Cancel
                          </span></button>
                        </div> : <button onClick={() => setDeleteConfirm(user.username)} className="p-2 text-red-400 hover:bg-red-600/20 rounded-md" title="Delete User" data-unique-id="85e94fd0-7129-4d0f-a929-bb72bbeeae73" data-file-name="app/admin/users/page.tsx">
                          <Trash2 className="h-5 w-5" />
                        </button>}
                    </div>}
                </div>
              </div>
            </motion.div>)}
        </div>
      </div>
      
      {/* Add User Modal */}
      <AnimatePresence>
        {isModalOpen && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" data-unique-id="a94e6020-49c2-4785-8586-3afa246c842a" data-file-name="app/admin/users/page.tsx">
            <motion.div initial={{
          scale: 0.9,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} exit={{
          scale: 0.9,
          opacity: 0
        }} className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden" data-unique-id="6ad86652-6035-4fdf-bf2b-67b372cc3f48" data-file-name="app/admin/users/page.tsx">
              <div className="flex justify-between items-center border-b border-gray-700 p-5" data-unique-id="ace801e3-ed8b-4442-9cee-0e7eb4e7a02f" data-file-name="app/admin/users/page.tsx">
                <h2 className="text-xl font-semibold text-white flex items-center" data-unique-id="6f815cd0-cb72-4c67-bd4b-ec67e94b4b06" data-file-name="app/admin/users/page.tsx">
                  <UserPlus className="h-5 w-5 mr-2 text-indigo-400" /><span className="editable-text" data-unique-id="6774e75d-cd05-47c5-bcd4-62b6174b3882" data-file-name="app/admin/users/page.tsx">
                  Add New Admin User
                </span></h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-200 rounded-full" data-unique-id="5087a903-224f-4674-b1f3-1cbddd203030" data-file-name="app/admin/users/page.tsx">
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={handleAddUser} className="p-5" data-unique-id="134e7afb-da04-42d6-a4eb-ce631be33a4f" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true">
                {formError && <div className="mb-4 p-3 bg-red-900/30 border border-red-800/50 rounded-md text-red-300 text-sm flex items-center" data-unique-id="3f7491d0-e203-4213-a9f1-794863578853" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    {formError}
                  </div>}
                
                {formSuccess && <div className="mb-4 p-3 bg-green-900/30 border border-green-800/50 rounded-md text-green-300 text-sm flex items-center" data-unique-id="920b724c-0a95-4dcf-af7e-20f95cb5caca" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {formSuccess}
                  </div>}
                
                <div className="space-y-4" data-unique-id="4bfb310f-69b9-4550-a0eb-eae8f490cd33" data-file-name="app/admin/users/page.tsx">
                  <div data-unique-id="c507c65a-ec03-4292-b1c6-c430bb3f0e97" data-file-name="app/admin/users/page.tsx">
                    <label className="block text-sm font-medium text-gray-300 mb-1" data-unique-id="1932efe1-e2e6-43b3-824e-e39f6c2f99be" data-file-name="app/admin/users/page.tsx">
                      <User className="h-4 w-4 mr-1 inline-block" /><span className="editable-text" data-unique-id="890b31e1-0523-46d4-9b1f-ce8e6ee3b665" data-file-name="app/admin/users/page.tsx">
                      Username
                    </span></label>
                    <input type="text" value={newUser.username} onChange={e => setNewUser({
                  ...newUser,
                  username: e.target.value
                })} className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter username" required data-unique-id="b62bd28a-eb8b-41fb-9eee-4aeead36f604" data-file-name="app/admin/users/page.tsx" />
                  </div>
                  
                  <div data-unique-id="b422e53b-4a64-4572-8f7b-7747b5b22579" data-file-name="app/admin/users/page.tsx">
                    <label className="block text-sm font-medium text-gray-300 mb-1" data-unique-id="4d65ecaa-ea83-4cd2-9706-9d27a566b762" data-file-name="app/admin/users/page.tsx">
                      <Mail className="h-4 w-4 mr-1 inline-block" /><span className="editable-text" data-unique-id="4b259f1f-5338-43ad-baa8-b380f2c42e9a" data-file-name="app/admin/users/page.tsx">
                      Email Address
                    </span></label>
                    <input type="email" value={newUser.email} onChange={e => setNewUser({
                  ...newUser,
                  email: e.target.value
                })} className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter email" required data-unique-id="679dfe2d-d84e-4c14-95b7-ef9c26b5519f" data-file-name="app/admin/users/page.tsx" />
                  </div>
                  
                  <div data-unique-id="cfc7e48e-a1c7-4100-88bc-8f7d9b705f11" data-file-name="app/admin/users/page.tsx">
                    <label className="block text-sm font-medium text-gray-300 mb-1" data-unique-id="42ed6742-f0b3-48e8-a015-7668b18ddfe1" data-file-name="app/admin/users/page.tsx">
                      <Key className="h-4 w-4 mr-1 inline-block" /><span className="editable-text" data-unique-id="47e46ba2-eb2a-4310-824d-eb99c4ae5d43" data-file-name="app/admin/users/page.tsx">
                      Password
                    </span></label>
                    <input type="password" value={newUser.password} onChange={e => setNewUser({
                  ...newUser,
                  password: e.target.value
                })} className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Create a password" required data-unique-id="e65b668b-65dc-46aa-b937-5c59600c10dd" data-file-name="app/admin/users/page.tsx" />
                  </div>
                  
                  <div data-unique-id="3418dcc5-2218-4857-80e3-f4789f3095bc" data-file-name="app/admin/users/page.tsx">
                    <label className="block text-sm font-medium text-gray-300 mb-1" data-unique-id="a329c7d5-755d-4ac5-aea6-76a7ea9a6b68" data-file-name="app/admin/users/page.tsx">
                      <Key className="h-4 w-4 mr-1 inline-block" /><span className="editable-text" data-unique-id="3eb71e72-7065-485d-a675-ca185f49fd8a" data-file-name="app/admin/users/page.tsx">
                      Confirm Password
                    </span></label>
                    <input type="password" value={newUser.confirmPassword} onChange={e => setNewUser({
                  ...newUser,
                  confirmPassword: e.target.value
                })} className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Confirm password" required data-unique-id="cce641bf-3e2e-43f6-8cd6-e488f1c3fe2f" data-file-name="app/admin/users/page.tsx" />
                  </div>
                  
                  <div data-unique-id="cf2fc840-de65-4081-a13a-226ac4b72a38" data-file-name="app/admin/users/page.tsx">
                    <label className="block text-sm font-medium text-gray-300 mb-1" data-unique-id="418598b8-b8e5-4e05-9dc4-694bc9db29da" data-file-name="app/admin/users/page.tsx">
                      <Shield className="h-4 w-4 mr-1 inline-block" /><span className="editable-text" data-unique-id="d407463f-07ac-43f2-902d-eeecc3201f09" data-file-name="app/admin/users/page.tsx">
                      Role
                    </span></label>
                    <select value={newUser.role} onChange={e => setNewUser({
                  ...newUser,
                  role: e.target.value as 'admin' | 'superadmin'
                })} className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" required data-unique-id="7a07517c-5d0d-45e0-a940-3327659b69c8" data-file-name="app/admin/users/page.tsx">
                      <option value="admin" data-unique-id="0a5658ee-392a-4548-b82b-3a3682414eb0" data-file-name="app/admin/users/page.tsx"><span className="editable-text" data-unique-id="3a8005c9-b6c4-4dee-9fc7-e266fbf163f0" data-file-name="app/admin/users/page.tsx">Admin</span></option>
                      <option value="superadmin" data-unique-id="f670b51c-6380-4d82-b514-f97a07ee071f" data-file-name="app/admin/users/page.tsx"><span className="editable-text" data-unique-id="18df45f9-4824-4519-a1e4-86f6e530680f" data-file-name="app/admin/users/page.tsx">Super Admin</span></option>
                    </select>
                    <p className="mt-1 text-sm text-gray-400" data-unique-id="70f9f24e-b53d-4a24-8021-12006a9b6bcf" data-file-name="app/admin/users/page.tsx"><span className="editable-text" data-unique-id="83647c2b-dcc2-4a2c-974d-91555c72f17a" data-file-name="app/admin/users/page.tsx">
                      Super Admins can manage other users and have full permissions
                    </span></p>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end gap-3" data-unique-id="687feb2b-9602-4b68-b238-eed7a06a8991" data-file-name="app/admin/users/page.tsx">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2.5 bg-gray-700 text-white rounded-md hover:bg-gray-600" data-unique-id="f7b69083-ac59-4299-a556-1cf50ef05d75" data-file-name="app/admin/users/page.tsx"><span className="editable-text" data-unique-id="d76648ec-38e2-47c7-a792-ce819e69063b" data-file-name="app/admin/users/page.tsx">
                    Cancel
                  </span></button>
                  <button type="submit" disabled={isSubmitting} className="px-4 py-2.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center" data-unique-id="5e085e1e-6d0e-4887-813d-b960efee7c70" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true">
                    {isSubmitting ? <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </> : <>Add User</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>}
      </AnimatePresence>
    </div>;
}