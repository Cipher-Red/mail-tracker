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
  return <div className="space-y-6" data-unique-id="58caddad-7448-4622-baea-6bd390a772f5" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true">
      <div className="flex justify-between items-center" data-unique-id="fdaf5a38-c506-44cc-80a5-f60e6c1f231d" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3" data-unique-id="720d7417-323d-4157-a0d2-ddee2dc9005f" data-file-name="app/admin/users/page.tsx">
          <Users className="h-8 w-8 text-indigo-400" /><span className="editable-text" data-unique-id="e3247301-7511-4a05-8065-30a3393d19ff" data-file-name="app/admin/users/page.tsx">
          User Management
        </span></h1>
        
        {isSuperAdmin && <button onClick={() => setIsModalOpen(true)} className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center" data-unique-id="f9dd17ac-4471-44a2-8898-22321c3f485e" data-file-name="app/admin/users/page.tsx">
            <UserPlus className="h-5 w-5 mr-2" /><span className="editable-text" data-unique-id="e0b0a0a9-372d-47df-9d24-195eaff7fd5e" data-file-name="app/admin/users/page.tsx">
            Add Admin User
          </span></button>}
      </div>
      
      {!isSuperAdmin && <div className="p-4 bg-amber-950/30 border border-amber-800/50 rounded-lg text-amber-400 flex items-center" data-unique-id="6daf1fd3-d8de-4380-adb1-10c5cf4895ca" data-file-name="app/admin/users/page.tsx">
          <AlertTriangle className="h-5 w-5 mr-2" /><span className="editable-text" data-unique-id="6764e525-1a0c-4006-941f-bceb89d64b71" data-file-name="app/admin/users/page.tsx">
          Only superadmin users can manage other users
        </span></div>}
      
      {/* Users List */}
      <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden" data-unique-id="60ebd1bf-ea10-4bb7-a27a-25dab655757c" data-file-name="app/admin/users/page.tsx">
        <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center" data-unique-id="cf359b82-2bb5-4514-bcd9-433adadf7844" data-file-name="app/admin/users/page.tsx">
          <h2 className="text-lg font-semibold text-white" data-unique-id="0b8dc25b-f043-4a76-bfba-00c9b76e0810" data-file-name="app/admin/users/page.tsx"><span className="editable-text" data-unique-id="d247a9b0-843a-445f-8a27-11d67d254b70" data-file-name="app/admin/users/page.tsx">Admin Users</span></h2>
          <div className="text-sm text-gray-400" data-unique-id="c1741916-e287-4d8d-ac06-25ab6dba9178" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true">
            {users.length}<span className="editable-text" data-unique-id="bb0bc59c-5f0a-4933-8494-e0a43a94846f" data-file-name="app/admin/users/page.tsx"> users
          </span></div>
        </div>
        
        <div className="divide-y divide-gray-700" data-unique-id="9a656adf-d164-4efa-bb9c-a86a28d13b88" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true">
          {users.map(user => <motion.div key={user.username} initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} className="p-5 hover:bg-gray-700/30" data-unique-id="935b96ea-d17d-455b-bf37-d10f28830dbd" data-file-name="app/admin/users/page.tsx">
              <div className="flex justify-between items-center" data-unique-id="f873ab40-a19f-446d-bcb0-ea1b7a08feea" data-file-name="app/admin/users/page.tsx">
                <div className="flex items-center space-x-4" data-unique-id="e84fbb19-2785-41e1-9a5d-c7e30015ed48" data-file-name="app/admin/users/page.tsx">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.role === 'superadmin' ? 'bg-red-600/30' : 'bg-blue-600/30'}`} data-unique-id="0b2ccc2d-2c55-4151-9554-ed14070fd5cf" data-file-name="app/admin/users/page.tsx">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  
                  <div data-unique-id="11008006-5f8e-4031-b917-339bf1058231" data-file-name="app/admin/users/page.tsx">
                    <div className="font-medium text-white flex items-center" data-unique-id="45aaa6a4-d0fb-49e5-8fa3-7ec11a858ade" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true">
                      {user.username}
                      {user.role === 'superadmin' && <span className="ml-2 px-2 py-0.5 bg-red-900/50 text-red-300 text-xs rounded-full" data-unique-id="1234d3b6-42d0-475d-8517-2343340b0bf0" data-file-name="app/admin/users/page.tsx"><span className="editable-text" data-unique-id="3c357ab3-37d1-485b-a5ed-62fa64994f34" data-file-name="app/admin/users/page.tsx">
                          Super Admin
                        </span></span>}
                      {user.username === currentUser?.username && <span className="ml-2 px-2 py-0.5 bg-green-900/50 text-green-300 text-xs rounded-full" data-unique-id="e35832b1-65a8-4192-90f0-6e73e7f5c45b" data-file-name="app/admin/users/page.tsx"><span className="editable-text" data-unique-id="39734838-77ff-469e-83e6-4616700ed1df" data-file-name="app/admin/users/page.tsx">
                          You
                        </span></span>}
                    </div>
                    <div className="text-sm text-gray-400 flex items-center mt-1" data-unique-id="d7af70ec-1412-43e2-9db6-05faaa140592" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true">
                      <Mail className="h-3.5 w-3.5 mr-1" />
                      {user.email}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3" data-unique-id="30bc5902-85aa-4ab6-8b0f-3dfd28c96008" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true">
                  {user.last_login && <div className="text-xs text-gray-400" data-unique-id="6e8ee986-fe9b-4e1f-93d7-acd15ad88cc3" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="04a0a5f4-7828-4075-9da9-83870d7f050d" data-file-name="app/admin/users/page.tsx">
                      Last login: </span>{new Date(user.last_login).toLocaleString()}
                    </div>}
                  
                  {isSuperAdmin && user.role !== 'superadmin' && user.username !== 'Qais' && <div data-unique-id="ea1e22f5-9a5d-4215-8abc-e7eec0bc48b6" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true">
                      {deleteConfirm === user.username ? <div className="flex items-center gap-2" data-unique-id="a880a946-7ded-4a88-b315-d9eff81aa5bb" data-file-name="app/admin/users/page.tsx">
                          <button onClick={() => handleDeleteUser(user.username)} className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700" data-unique-id="afc69304-1477-4116-8aa8-83e973f94132" data-file-name="app/admin/users/page.tsx"><span className="editable-text" data-unique-id="2ca94535-0b12-4161-93ec-41cc8e879b7c" data-file-name="app/admin/users/page.tsx">
                            Confirm
                          </span></button>
                          <button onClick={() => setDeleteConfirm(null)} className="px-3 py-1 bg-gray-600 text-white text-sm rounded-md" data-unique-id="6f5d454a-7b05-448d-8832-6209b8888048" data-file-name="app/admin/users/page.tsx"><span className="editable-text" data-unique-id="696a7389-731e-4e44-8f08-12197ccf6058" data-file-name="app/admin/users/page.tsx">
                            Cancel
                          </span></button>
                        </div> : <button onClick={() => setDeleteConfirm(user.username)} className="p-2 text-red-400 hover:bg-red-600/20 rounded-md" title="Delete User" data-unique-id="a51f7750-e960-410e-a1bd-67cddac3777b" data-file-name="app/admin/users/page.tsx">
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
      }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" data-unique-id="e7e0ed6f-bdb1-486b-91b9-2235fd8ccc51" data-file-name="app/admin/users/page.tsx">
            <motion.div initial={{
          scale: 0.9,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} exit={{
          scale: 0.9,
          opacity: 0
        }} className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden" data-unique-id="7d3ee04f-a8fd-46dd-8a14-f80cd662ca7d" data-file-name="app/admin/users/page.tsx">
              <div className="flex justify-between items-center border-b border-gray-700 p-5" data-unique-id="65a38caf-ec4e-4193-8dae-b4f80125fdd7" data-file-name="app/admin/users/page.tsx">
                <h2 className="text-xl font-semibold text-white flex items-center" data-unique-id="dea8f400-47a6-4802-bec6-159ef39eaee3" data-file-name="app/admin/users/page.tsx">
                  <UserPlus className="h-5 w-5 mr-2 text-indigo-400" /><span className="editable-text" data-unique-id="c40e7a72-6b9a-4a6f-b3d0-2ee4739dc774" data-file-name="app/admin/users/page.tsx">
                  Add New Admin User
                </span></h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-200 rounded-full" data-unique-id="2fbaacc1-f9b9-4f43-b3b2-55d2da8f7ff2" data-file-name="app/admin/users/page.tsx">
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={handleAddUser} className="p-5" data-unique-id="a0e8c65f-db99-4649-a7c2-1e9bdcb2a92c" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true">
                {formError && <div className="mb-4 p-3 bg-red-900/30 border border-red-800/50 rounded-md text-red-300 text-sm flex items-center" data-unique-id="ba54c059-f5e5-4ee3-853a-13f6c246643f" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    {formError}
                  </div>}
                
                {formSuccess && <div className="mb-4 p-3 bg-green-900/30 border border-green-800/50 rounded-md text-green-300 text-sm flex items-center" data-unique-id="9e565ed6-1ed6-4ab9-8cb4-ad5287a6810b" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {formSuccess}
                  </div>}
                
                <div className="space-y-4" data-unique-id="ba6f8a67-6acb-45e7-8bda-b6f291a07bf8" data-file-name="app/admin/users/page.tsx">
                  <div data-unique-id="b8903ad7-ba3f-4ccb-952c-e31f6270e267" data-file-name="app/admin/users/page.tsx">
                    <label className="block text-sm font-medium text-gray-300 mb-1" data-unique-id="3a83b0b1-3281-4ed0-b4c3-f675c3ad6964" data-file-name="app/admin/users/page.tsx">
                      <User className="h-4 w-4 mr-1 inline-block" /><span className="editable-text" data-unique-id="6611ef69-72b1-495e-884a-983775255463" data-file-name="app/admin/users/page.tsx">
                      Username
                    </span></label>
                    <input type="text" value={newUser.username} onChange={e => setNewUser({
                  ...newUser,
                  username: e.target.value
                })} className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter username" required data-unique-id="41810099-5baf-4e9a-9f01-d0ec2f21d033" data-file-name="app/admin/users/page.tsx" />
                  </div>
                  
                  <div data-unique-id="2aad331c-a05f-4c97-a4d7-2cd9915db597" data-file-name="app/admin/users/page.tsx">
                    <label className="block text-sm font-medium text-gray-300 mb-1" data-unique-id="cac6063e-1c29-4043-9b6f-798ce80dcaa3" data-file-name="app/admin/users/page.tsx">
                      <Mail className="h-4 w-4 mr-1 inline-block" /><span className="editable-text" data-unique-id="ee525e25-11da-4568-b160-e6ffc0baa8ce" data-file-name="app/admin/users/page.tsx">
                      Email Address
                    </span></label>
                    <input type="email" value={newUser.email} onChange={e => setNewUser({
                  ...newUser,
                  email: e.target.value
                })} className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter email" required data-unique-id="178e15df-2ee6-4e68-a389-414fa2b75f01" data-file-name="app/admin/users/page.tsx" />
                  </div>
                  
                  <div data-unique-id="bebdb6a1-8aad-45fe-ac00-df31a4a08b96" data-file-name="app/admin/users/page.tsx">
                    <label className="block text-sm font-medium text-gray-300 mb-1" data-unique-id="5f96fe96-90f1-4afa-9a44-61354e215b58" data-file-name="app/admin/users/page.tsx">
                      <Key className="h-4 w-4 mr-1 inline-block" /><span className="editable-text" data-unique-id="f3b54d75-7a4f-4bb2-8aa2-fc4e984eb309" data-file-name="app/admin/users/page.tsx">
                      Password
                    </span></label>
                    <input type="password" value={newUser.password} onChange={e => setNewUser({
                  ...newUser,
                  password: e.target.value
                })} className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Create a password" required data-unique-id="f1630202-b31e-4922-9ed8-ce566410c7e8" data-file-name="app/admin/users/page.tsx" />
                  </div>
                  
                  <div data-unique-id="8fb92c98-d3f1-4784-82f1-a537168778d8" data-file-name="app/admin/users/page.tsx">
                    <label className="block text-sm font-medium text-gray-300 mb-1" data-unique-id="5e92b13c-a683-409c-b9a8-4c40cdc17bd2" data-file-name="app/admin/users/page.tsx">
                      <Key className="h-4 w-4 mr-1 inline-block" /><span className="editable-text" data-unique-id="8adb1c12-6ac6-4c04-864b-335454e5b866" data-file-name="app/admin/users/page.tsx">
                      Confirm Password
                    </span></label>
                    <input type="password" value={newUser.confirmPassword} onChange={e => setNewUser({
                  ...newUser,
                  confirmPassword: e.target.value
                })} className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Confirm password" required data-unique-id="c05b8fc6-071c-4ce6-927f-1bd47e03a3dc" data-file-name="app/admin/users/page.tsx" />
                  </div>
                  
                  <div data-unique-id="1822165a-4d2d-497a-aa1c-4cb81939f3d9" data-file-name="app/admin/users/page.tsx">
                    <label className="block text-sm font-medium text-gray-300 mb-1" data-unique-id="6df9aa82-8b5b-48d7-9d39-ea89c1310573" data-file-name="app/admin/users/page.tsx">
                      <Shield className="h-4 w-4 mr-1 inline-block" /><span className="editable-text" data-unique-id="74ab33f7-afec-4465-b657-1aab02490a34" data-file-name="app/admin/users/page.tsx">
                      Role
                    </span></label>
                    <select value={newUser.role} onChange={e => setNewUser({
                  ...newUser,
                  role: e.target.value as 'admin' | 'superadmin'
                })} className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" required data-unique-id="9004e497-c900-495d-a92b-de12362a5cde" data-file-name="app/admin/users/page.tsx">
                      <option value="admin" data-unique-id="b04a4bd0-74f5-485d-8548-b47e1b8f678b" data-file-name="app/admin/users/page.tsx"><span className="editable-text" data-unique-id="6755f6ec-fcf8-446f-84fa-c374f2b424bd" data-file-name="app/admin/users/page.tsx">Admin</span></option>
                      <option value="superadmin" data-unique-id="676b4cfc-45cd-4539-9bdb-417704d69c3e" data-file-name="app/admin/users/page.tsx"><span className="editable-text" data-unique-id="f7805d0f-be24-4839-8037-eae822a4c3d9" data-file-name="app/admin/users/page.tsx">Super Admin</span></option>
                    </select>
                    <p className="mt-1 text-sm text-gray-400" data-unique-id="197689ba-cca2-4b91-8eda-e10965718e60" data-file-name="app/admin/users/page.tsx"><span className="editable-text" data-unique-id="d75f9519-7a2b-4ce6-9361-6d6c23c1524d" data-file-name="app/admin/users/page.tsx">
                      Super Admins can manage other users and have full permissions
                    </span></p>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end gap-3" data-unique-id="f45bd8f2-f172-4e80-b3d0-c0015dd553ef" data-file-name="app/admin/users/page.tsx">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2.5 bg-gray-700 text-white rounded-md hover:bg-gray-600" data-unique-id="0680ac8a-ac15-4053-adc4-97bce2bd67d9" data-file-name="app/admin/users/page.tsx"><span className="editable-text" data-unique-id="80fe5d4a-3f31-465f-9ec2-c2c528739716" data-file-name="app/admin/users/page.tsx">
                    Cancel
                  </span></button>
                  <button type="submit" disabled={isSubmitting} className="px-4 py-2.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center" data-unique-id="23020fba-e7d0-4c30-a72c-3030414fb5dd" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true">
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