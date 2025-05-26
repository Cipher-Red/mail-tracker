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
  return <div className="space-y-6" data-unique-id="c230e309-2a88-4da8-942b-3d5e884a62c4" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true">
      <div className="flex justify-between items-center" data-unique-id="49dfdb40-0f44-40de-9c3d-e38b8612398b" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3" data-unique-id="23eacf92-439a-4cb1-8f0d-4cf78ed1503d" data-file-name="app/admin/users/page.tsx">
          <Users className="h-8 w-8 text-indigo-400" /><span className="editable-text" data-unique-id="4adc34ea-e18b-41a4-9dca-60b1967c15d3" data-file-name="app/admin/users/page.tsx">
          User Management
        </span></h1>
        
        {isSuperAdmin && <button onClick={() => setIsModalOpen(true)} className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center" data-unique-id="31113731-0e06-4479-ae39-36893f5f489b" data-file-name="app/admin/users/page.tsx">
            <UserPlus className="h-5 w-5 mr-2" /><span className="editable-text" data-unique-id="f769a8cb-79f1-4ade-b469-356387ee9c92" data-file-name="app/admin/users/page.tsx">
            Add Admin User
          </span></button>}
      </div>
      
      {!isSuperAdmin && <div className="p-4 bg-amber-950/30 border border-amber-800/50 rounded-lg text-amber-400 flex items-center" data-unique-id="54c866e2-9590-4454-917a-2a206d1bb6cd" data-file-name="app/admin/users/page.tsx">
          <AlertTriangle className="h-5 w-5 mr-2" /><span className="editable-text" data-unique-id="a69ec10e-b4aa-4262-a5be-88f1845dcfd5" data-file-name="app/admin/users/page.tsx">
          Only superadmin users can manage other users
        </span></div>}
      
      {/* Users List */}
      <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden" data-unique-id="fa6d5516-b850-4474-adae-8adff7de8a4c" data-file-name="app/admin/users/page.tsx">
        <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center" data-unique-id="58a84bcf-2380-4303-a835-c450dad770bf" data-file-name="app/admin/users/page.tsx">
          <h2 className="text-lg font-semibold text-white" data-unique-id="269043c9-f186-4a5b-954d-9b5db624da63" data-file-name="app/admin/users/page.tsx"><span className="editable-text" data-unique-id="4bd3c4fc-ef02-4943-8492-92d69c30f63e" data-file-name="app/admin/users/page.tsx">Admin Users</span></h2>
          <div className="text-sm text-gray-400" data-unique-id="deb8e249-a153-48d9-a343-6bff7578d133" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true">
            {users.length}<span className="editable-text" data-unique-id="9462955a-02d4-4917-b827-4cde7763e2b2" data-file-name="app/admin/users/page.tsx"> users
          </span></div>
        </div>
        
        <div className="divide-y divide-gray-700" data-unique-id="c87eed31-edcd-4871-b97b-07a556a276b8" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true">
          {users.map(user => <motion.div key={user.username} initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} className="p-5 hover:bg-gray-700/30" data-unique-id="74b66474-a776-42e0-8096-c15680c4553a" data-file-name="app/admin/users/page.tsx">
              <div className="flex justify-between items-center" data-unique-id="44e3b5f0-9c7f-42b2-9568-7fe63855f05b" data-file-name="app/admin/users/page.tsx">
                <div className="flex items-center space-x-4" data-unique-id="94e07ce7-615c-414b-8c03-fcef1deb8071" data-file-name="app/admin/users/page.tsx">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.role === 'superadmin' ? 'bg-red-600/30' : 'bg-blue-600/30'}`} data-unique-id="165bdb57-914b-42db-9e00-6dd7db80db96" data-file-name="app/admin/users/page.tsx">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  
                  <div data-unique-id="000797b5-1fdd-4a14-992e-a74e5a3ecfd4" data-file-name="app/admin/users/page.tsx">
                    <div className="font-medium text-white flex items-center" data-unique-id="c52eef72-6e16-44fc-8462-a90093f1f346" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true">
                      {user.username}
                      {user.role === 'superadmin' && <span className="ml-2 px-2 py-0.5 bg-red-900/50 text-red-300 text-xs rounded-full" data-unique-id="6011a10f-4123-46f3-aa3e-1ec2daddc888" data-file-name="app/admin/users/page.tsx"><span className="editable-text" data-unique-id="60649f34-a2bd-4fab-bd8d-0b04e2448071" data-file-name="app/admin/users/page.tsx">
                          Super Admin
                        </span></span>}
                      {user.username === currentUser?.username && <span className="ml-2 px-2 py-0.5 bg-green-900/50 text-green-300 text-xs rounded-full" data-unique-id="3cdd3d09-f1b6-4188-b013-393be241a6bf" data-file-name="app/admin/users/page.tsx"><span className="editable-text" data-unique-id="0c0bf9c8-4811-4123-9536-11ff708ec37a" data-file-name="app/admin/users/page.tsx">
                          You
                        </span></span>}
                    </div>
                    <div className="text-sm text-gray-400 flex items-center mt-1" data-unique-id="e9ff0e76-8df6-4cfa-8f08-94913ad4b757" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true">
                      <Mail className="h-3.5 w-3.5 mr-1" />
                      {user.email}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3" data-unique-id="76dc0a7d-e144-4d68-846b-cdb5a837de79" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true">
                  {user.last_login && <div className="text-xs text-gray-400" data-unique-id="fa1995ed-3927-45e6-8b2f-e1429f10c7d8" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="c7b578c6-ebf2-4217-8aba-62964157e011" data-file-name="app/admin/users/page.tsx">
                      Last login: </span>{new Date(user.last_login).toLocaleString()}
                    </div>}
                  
                  {isSuperAdmin && user.role !== 'superadmin' && user.username !== 'Qais' && <div data-unique-id="784d12ae-d466-4475-ab45-a82e5b07a03a" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true">
                      {deleteConfirm === user.username ? <div className="flex items-center gap-2" data-unique-id="2008c8f1-09dd-413c-8ffd-35f6b0c5fcf9" data-file-name="app/admin/users/page.tsx">
                          <button onClick={() => handleDeleteUser(user.username)} className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700" data-unique-id="c390bd8e-d4ba-49db-a914-046d3289fd21" data-file-name="app/admin/users/page.tsx"><span className="editable-text" data-unique-id="c068fdb8-2842-463a-9253-d330edf190a3" data-file-name="app/admin/users/page.tsx">
                            Confirm
                          </span></button>
                          <button onClick={() => setDeleteConfirm(null)} className="px-3 py-1 bg-gray-600 text-white text-sm rounded-md" data-unique-id="4452cce3-3a20-418e-a887-c8508c802e96" data-file-name="app/admin/users/page.tsx"><span className="editable-text" data-unique-id="a54dea7f-f26b-4502-a41f-3a35e3417b28" data-file-name="app/admin/users/page.tsx">
                            Cancel
                          </span></button>
                        </div> : <button onClick={() => setDeleteConfirm(user.username)} className="p-2 text-red-400 hover:bg-red-600/20 rounded-md" title="Delete User" data-unique-id="6a4a7464-c4eb-4b71-8723-ad9215a34d5e" data-file-name="app/admin/users/page.tsx">
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
      }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" data-unique-id="6a8b7873-d2f3-4eaf-a3f3-c23319c5c720" data-file-name="app/admin/users/page.tsx">
            <motion.div initial={{
          scale: 0.9,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} exit={{
          scale: 0.9,
          opacity: 0
        }} className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden" data-unique-id="caf632b4-feed-431d-aa56-eca5504a9416" data-file-name="app/admin/users/page.tsx">
              <div className="flex justify-between items-center border-b border-gray-700 p-5" data-unique-id="af02c2fa-d760-4307-a9aa-adf69c3c5f15" data-file-name="app/admin/users/page.tsx">
                <h2 className="text-xl font-semibold text-white flex items-center" data-unique-id="96e02a8d-dd44-4e49-95e1-faf69a1ddb00" data-file-name="app/admin/users/page.tsx">
                  <UserPlus className="h-5 w-5 mr-2 text-indigo-400" /><span className="editable-text" data-unique-id="a012c085-4296-4544-9ff3-1f26739178ff" data-file-name="app/admin/users/page.tsx">
                  Add New Admin User
                </span></h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-200 rounded-full" data-unique-id="a792c325-4d30-4993-ab15-ad57eadf1848" data-file-name="app/admin/users/page.tsx">
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={handleAddUser} className="p-5" data-unique-id="7566f597-828a-4202-908a-ff3305fe007b" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true">
                {formError && <div className="mb-4 p-3 bg-red-900/30 border border-red-800/50 rounded-md text-red-300 text-sm flex items-center" data-unique-id="f365a455-4cc8-483f-9459-0ab30df76d06" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    {formError}
                  </div>}
                
                {formSuccess && <div className="mb-4 p-3 bg-green-900/30 border border-green-800/50 rounded-md text-green-300 text-sm flex items-center" data-unique-id="41566117-4fe3-46f4-a207-29900498805e" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {formSuccess}
                  </div>}
                
                <div className="space-y-4" data-unique-id="71b43576-1c3b-4e7c-84c1-ff1fc79853dc" data-file-name="app/admin/users/page.tsx">
                  <div data-unique-id="2cb89c18-b424-4909-8ee9-0f34b53d2ef4" data-file-name="app/admin/users/page.tsx">
                    <label className="block text-sm font-medium text-gray-300 mb-1" data-unique-id="c16ad0e5-204a-44ed-b61f-5071c33a6550" data-file-name="app/admin/users/page.tsx">
                      <User className="h-4 w-4 mr-1 inline-block" /><span className="editable-text" data-unique-id="c7cb79ee-aba3-49d7-8989-6caf6af6d6d6" data-file-name="app/admin/users/page.tsx">
                      Username
                    </span></label>
                    <input type="text" value={newUser.username} onChange={e => setNewUser({
                  ...newUser,
                  username: e.target.value
                })} className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter username" required data-unique-id="655b69f8-1757-4c49-9920-025147d4eee6" data-file-name="app/admin/users/page.tsx" />
                  </div>
                  
                  <div data-unique-id="1808333d-25d4-4ced-87fc-e6169c5ac640" data-file-name="app/admin/users/page.tsx">
                    <label className="block text-sm font-medium text-gray-300 mb-1" data-unique-id="e6b281aa-2bc7-4502-9882-24fa6d28c017" data-file-name="app/admin/users/page.tsx">
                      <Mail className="h-4 w-4 mr-1 inline-block" /><span className="editable-text" data-unique-id="b030a2bb-b169-426e-b4f4-53e285139ac5" data-file-name="app/admin/users/page.tsx">
                      Email Address
                    </span></label>
                    <input type="email" value={newUser.email} onChange={e => setNewUser({
                  ...newUser,
                  email: e.target.value
                })} className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter email" required data-unique-id="d35164fd-8750-419a-8bd1-951a74edc73d" data-file-name="app/admin/users/page.tsx" />
                  </div>
                  
                  <div data-unique-id="2c2f251a-8976-4100-8f6f-b7b81d7a7996" data-file-name="app/admin/users/page.tsx">
                    <label className="block text-sm font-medium text-gray-300 mb-1" data-unique-id="b5ab56b1-5201-4645-b3ea-a6e74144853c" data-file-name="app/admin/users/page.tsx">
                      <Key className="h-4 w-4 mr-1 inline-block" /><span className="editable-text" data-unique-id="41d2deac-dbc8-43fa-9305-dc0ca2af8f8b" data-file-name="app/admin/users/page.tsx">
                      Password
                    </span></label>
                    <input type="password" value={newUser.password} onChange={e => setNewUser({
                  ...newUser,
                  password: e.target.value
                })} className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Create a password" required data-unique-id="0256e39b-099c-4a71-a6a0-833d3d005c9c" data-file-name="app/admin/users/page.tsx" />
                  </div>
                  
                  <div data-unique-id="574b1bec-7c17-4cad-aa94-93ea2e251104" data-file-name="app/admin/users/page.tsx">
                    <label className="block text-sm font-medium text-gray-300 mb-1" data-unique-id="74d03d52-6f4a-4d56-b01f-fbec824efd4f" data-file-name="app/admin/users/page.tsx">
                      <Key className="h-4 w-4 mr-1 inline-block" /><span className="editable-text" data-unique-id="869c0333-b905-457b-967b-4193278e055d" data-file-name="app/admin/users/page.tsx">
                      Confirm Password
                    </span></label>
                    <input type="password" value={newUser.confirmPassword} onChange={e => setNewUser({
                  ...newUser,
                  confirmPassword: e.target.value
                })} className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Confirm password" required data-unique-id="68a85b1f-3781-4362-96cf-9d0b68a88272" data-file-name="app/admin/users/page.tsx" />
                  </div>
                  
                  <div data-unique-id="2691fa81-c7a1-4940-9d4e-ddadabd0372b" data-file-name="app/admin/users/page.tsx">
                    <label className="block text-sm font-medium text-gray-300 mb-1" data-unique-id="596fb78b-511d-4d6e-8c15-16040c982115" data-file-name="app/admin/users/page.tsx">
                      <Shield className="h-4 w-4 mr-1 inline-block" /><span className="editable-text" data-unique-id="4051291d-f02e-4922-881e-4094487b3c40" data-file-name="app/admin/users/page.tsx">
                      Role
                    </span></label>
                    <select value={newUser.role} onChange={e => setNewUser({
                  ...newUser,
                  role: e.target.value as 'admin' | 'superadmin'
                })} className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" required data-unique-id="4cedc113-7f97-4ec5-9a12-b12e923f8dcc" data-file-name="app/admin/users/page.tsx">
                      <option value="admin" data-unique-id="993d8bf6-04b3-4338-8e15-31b83f33cb07" data-file-name="app/admin/users/page.tsx"><span className="editable-text" data-unique-id="9c2a2a60-1277-46bb-8730-c7f55ce9fdbd" data-file-name="app/admin/users/page.tsx">Admin</span></option>
                      <option value="superadmin" data-unique-id="8c829058-232c-421b-9113-979e51a1073c" data-file-name="app/admin/users/page.tsx"><span className="editable-text" data-unique-id="dac7e59f-ef38-4df6-8039-cd60958a83d5" data-file-name="app/admin/users/page.tsx">Super Admin</span></option>
                    </select>
                    <p className="mt-1 text-sm text-gray-400" data-unique-id="08041726-c5de-4ed8-918e-ebc7fbc5d604" data-file-name="app/admin/users/page.tsx"><span className="editable-text" data-unique-id="b8eb5c60-b93b-4086-9a36-781e23df61df" data-file-name="app/admin/users/page.tsx">
                      Super Admins can manage other users and have full permissions
                    </span></p>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end gap-3" data-unique-id="882b79cd-521d-4a34-8d68-05f8fa3b046c" data-file-name="app/admin/users/page.tsx">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2.5 bg-gray-700 text-white rounded-md hover:bg-gray-600" data-unique-id="ac060bc3-d5de-4d2f-a859-0c1524fceea6" data-file-name="app/admin/users/page.tsx"><span className="editable-text" data-unique-id="9e14aa2b-7be8-4b2c-be7f-a2e275e2e618" data-file-name="app/admin/users/page.tsx">
                    Cancel
                  </span></button>
                  <button type="submit" disabled={isSubmitting} className="px-4 py-2.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center" data-unique-id="071dd0cb-4261-4428-8191-964e00d21bfb" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true">
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