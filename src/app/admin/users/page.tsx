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
  return <div className="space-y-6" data-unique-id="53877b06-d6a3-4026-a4f2-0940ce1da273" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true">
      <div className="flex justify-between items-center" data-unique-id="b68ca658-8806-49c9-bee7-e7872663443c" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3" data-unique-id="8b9ac1eb-a3a6-4027-89a4-9b4b15040ae0" data-file-name="app/admin/users/page.tsx">
          <Users className="h-8 w-8 text-indigo-400" /><span className="editable-text" data-unique-id="cdef749e-a4ca-490a-a9bc-fdef0bcb50cc" data-file-name="app/admin/users/page.tsx">
          User Management
        </span></h1>
        
        {isSuperAdmin && <button onClick={() => setIsModalOpen(true)} className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center" data-unique-id="767e2420-21b4-4c01-b28b-d21c5a45bc28" data-file-name="app/admin/users/page.tsx">
            <UserPlus className="h-5 w-5 mr-2" /><span className="editable-text" data-unique-id="82aaba2b-17c2-4dd8-9459-37ceee64436c" data-file-name="app/admin/users/page.tsx">
            Add Admin User
          </span></button>}
      </div>
      
      {!isSuperAdmin && <div className="p-4 bg-amber-950/30 border border-amber-800/50 rounded-lg text-amber-400 flex items-center" data-unique-id="ce9c2402-6a92-43ba-9688-271526da582b" data-file-name="app/admin/users/page.tsx">
          <AlertTriangle className="h-5 w-5 mr-2" /><span className="editable-text" data-unique-id="caf7502d-d22f-49f0-9040-8f68e6710e9b" data-file-name="app/admin/users/page.tsx">
          Only superadmin users can manage other users
        </span></div>}
      
      {/* Users List */}
      <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden" data-unique-id="8d79ec42-3c46-4211-8795-92c6d581aac0" data-file-name="app/admin/users/page.tsx">
        <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center" data-unique-id="79e8ec8e-d496-4bdd-83b8-5dc80824eee8" data-file-name="app/admin/users/page.tsx">
          <h2 className="text-lg font-semibold text-white" data-unique-id="bbd1731a-4bf6-4267-b161-b07ed8480714" data-file-name="app/admin/users/page.tsx"><span className="editable-text" data-unique-id="e20f3297-b133-4d4a-974d-a793cee7634d" data-file-name="app/admin/users/page.tsx">Admin Users</span></h2>
          <div className="text-sm text-gray-400" data-unique-id="681dc6a9-3c9f-46f9-8231-969e89be4cce" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true">
            {users.length}<span className="editable-text" data-unique-id="79a57230-0e76-4022-80c4-954335afbb56" data-file-name="app/admin/users/page.tsx"> users
          </span></div>
        </div>
        
        <div className="divide-y divide-gray-700" data-unique-id="47ceac3f-e638-45f5-bd1c-ac8769a036eb" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true">
          {users.map(user => <motion.div key={user.username} initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} className="p-5 hover:bg-gray-700/30" data-unique-id="f47589cc-d664-4aed-bb8d-166349749a05" data-file-name="app/admin/users/page.tsx">
              <div className="flex justify-between items-center" data-unique-id="93aee195-d842-461c-9f59-8d4f6ac46af9" data-file-name="app/admin/users/page.tsx">
                <div className="flex items-center space-x-4" data-unique-id="22496574-0cee-48c5-87fc-9873a43c7eb6" data-file-name="app/admin/users/page.tsx">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.role === 'superadmin' ? 'bg-red-600/30' : 'bg-blue-600/30'}`} data-unique-id="cbb255a7-b2c1-4605-b487-b54b0f25033a" data-file-name="app/admin/users/page.tsx">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  
                  <div data-unique-id="c59a947f-9a53-48eb-95f7-dd15be0f060c" data-file-name="app/admin/users/page.tsx">
                    <div className="font-medium text-white flex items-center" data-unique-id="3f8432a6-f653-4fad-98ce-a414e8298162" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true">
                      {user.username}
                      {user.role === 'superadmin' && <span className="ml-2 px-2 py-0.5 bg-red-900/50 text-red-300 text-xs rounded-full" data-unique-id="8a4c554e-7fc3-4ad0-87e3-bd9a6d5267bb" data-file-name="app/admin/users/page.tsx"><span className="editable-text" data-unique-id="2f7d7018-7b35-4e9e-ae5a-5e93899f9ab7" data-file-name="app/admin/users/page.tsx">
                          Super Admin
                        </span></span>}
                      {user.username === currentUser?.username && <span className="ml-2 px-2 py-0.5 bg-green-900/50 text-green-300 text-xs rounded-full" data-unique-id="0de7d8ab-e28a-4b62-bca0-589595054882" data-file-name="app/admin/users/page.tsx"><span className="editable-text" data-unique-id="b6cab0d8-0dc7-4493-91c1-7b89fa3d98da" data-file-name="app/admin/users/page.tsx">
                          You
                        </span></span>}
                    </div>
                    <div className="text-sm text-gray-400 flex items-center mt-1" data-unique-id="eb79f15a-489a-4e2a-94d1-0d90ba94ed91" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true">
                      <Mail className="h-3.5 w-3.5 mr-1" />
                      {user.email}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3" data-unique-id="db17dbcf-52fc-404a-9c7b-27433c4f0018" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true">
                  {user.last_login && <div className="text-xs text-gray-400" data-unique-id="54ecc232-b423-49d3-85cd-5fa237791841" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="7bf9e937-5cd9-4f8e-8b55-a9ee5b9536dd" data-file-name="app/admin/users/page.tsx">
                      Last login: </span>{new Date(user.last_login).toLocaleString()}
                    </div>}
                  
                  {isSuperAdmin && user.role !== 'superadmin' && user.username !== 'Qais' && <div data-unique-id="0798bfb6-4361-4d52-9a43-5913a34b0df3" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true">
                      {deleteConfirm === user.username ? <div className="flex items-center gap-2" data-unique-id="829cab94-e569-49e0-9e99-4790bdcc166c" data-file-name="app/admin/users/page.tsx">
                          <button onClick={() => handleDeleteUser(user.username)} className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700" data-unique-id="fd927226-b31e-4a52-9e83-ae0516140612" data-file-name="app/admin/users/page.tsx"><span className="editable-text" data-unique-id="c41e738a-b5da-425f-b78d-1d29493ef506" data-file-name="app/admin/users/page.tsx">
                            Confirm
                          </span></button>
                          <button onClick={() => setDeleteConfirm(null)} className="px-3 py-1 bg-gray-600 text-white text-sm rounded-md" data-unique-id="08e3aefa-1233-4a9b-8cbc-9cd0cfd0a87e" data-file-name="app/admin/users/page.tsx"><span className="editable-text" data-unique-id="7cfe0edb-da83-450f-bf5e-3fc93e0dc688" data-file-name="app/admin/users/page.tsx">
                            Cancel
                          </span></button>
                        </div> : <button onClick={() => setDeleteConfirm(user.username)} className="p-2 text-red-400 hover:bg-red-600/20 rounded-md" title="Delete User" data-unique-id="990e591a-8ace-442d-9fbd-9864aa07d1aa" data-file-name="app/admin/users/page.tsx">
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
      }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" data-unique-id="2d56e229-1f30-42f2-8ca8-315174220d6d" data-file-name="app/admin/users/page.tsx">
            <motion.div initial={{
          scale: 0.9,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} exit={{
          scale: 0.9,
          opacity: 0
        }} className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden" data-unique-id="d3d7944e-cd19-4d2e-884b-e4d2d876300a" data-file-name="app/admin/users/page.tsx">
              <div className="flex justify-between items-center border-b border-gray-700 p-5" data-unique-id="b31018c7-99f2-48a2-bede-a758487cd5fd" data-file-name="app/admin/users/page.tsx">
                <h2 className="text-xl font-semibold text-white flex items-center" data-unique-id="bdea10e5-5956-4d79-9439-902bb275a9e5" data-file-name="app/admin/users/page.tsx">
                  <UserPlus className="h-5 w-5 mr-2 text-indigo-400" /><span className="editable-text" data-unique-id="e74c3444-fe56-441c-9351-627d9d4b3765" data-file-name="app/admin/users/page.tsx">
                  Add New Admin User
                </span></h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-200 rounded-full" data-unique-id="95d8e0b6-ee6b-4b03-8482-7d1c10d2c0dc" data-file-name="app/admin/users/page.tsx">
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={handleAddUser} className="p-5" data-unique-id="dd5f20d0-a314-4616-8f78-779dfc0a93df" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true">
                {formError && <div className="mb-4 p-3 bg-red-900/30 border border-red-800/50 rounded-md text-red-300 text-sm flex items-center" data-unique-id="79042810-c098-4947-80a3-aa30328d53a5" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    {formError}
                  </div>}
                
                {formSuccess && <div className="mb-4 p-3 bg-green-900/30 border border-green-800/50 rounded-md text-green-300 text-sm flex items-center" data-unique-id="b903ccb4-de8f-4f77-b072-d0d3bcddbc45" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {formSuccess}
                  </div>}
                
                <div className="space-y-4" data-unique-id="bb33d3a8-12f8-43e6-8198-f7a11a12d77b" data-file-name="app/admin/users/page.tsx">
                  <div data-unique-id="28a55d7b-5efc-4dce-851b-f16cfee27c52" data-file-name="app/admin/users/page.tsx">
                    <label className="block text-sm font-medium text-gray-300 mb-1" data-unique-id="d75f77fe-3fd7-4a3b-9ba8-7751a76fbc94" data-file-name="app/admin/users/page.tsx">
                      <User className="h-4 w-4 mr-1 inline-block" /><span className="editable-text" data-unique-id="951bafb8-dad5-4c62-b40c-fd36bacca306" data-file-name="app/admin/users/page.tsx">
                      Username
                    </span></label>
                    <input type="text" value={newUser.username} onChange={e => setNewUser({
                  ...newUser,
                  username: e.target.value
                })} className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter username" required data-unique-id="646fdbbf-766b-4a75-87f5-60018c5023f1" data-file-name="app/admin/users/page.tsx" />
                  </div>
                  
                  <div data-unique-id="40db36fc-5af5-4027-876a-c3c39067340e" data-file-name="app/admin/users/page.tsx">
                    <label className="block text-sm font-medium text-gray-300 mb-1" data-unique-id="eb8b45fa-d07b-4b0d-94b4-3209fe8e09d7" data-file-name="app/admin/users/page.tsx">
                      <Mail className="h-4 w-4 mr-1 inline-block" /><span className="editable-text" data-unique-id="f35f762f-2293-48b3-bc17-f601756df299" data-file-name="app/admin/users/page.tsx">
                      Email Address
                    </span></label>
                    <input type="email" value={newUser.email} onChange={e => setNewUser({
                  ...newUser,
                  email: e.target.value
                })} className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter email" required data-unique-id="5a6a1951-c512-4856-a208-7404766484e2" data-file-name="app/admin/users/page.tsx" />
                  </div>
                  
                  <div data-unique-id="8f68ce3e-7e19-4502-804a-26fae757a5a5" data-file-name="app/admin/users/page.tsx">
                    <label className="block text-sm font-medium text-gray-300 mb-1" data-unique-id="4f54915e-ca9a-484e-b4f5-28084942e5c5" data-file-name="app/admin/users/page.tsx">
                      <Key className="h-4 w-4 mr-1 inline-block" /><span className="editable-text" data-unique-id="0796834c-d1f3-4003-8c85-6349a02800d9" data-file-name="app/admin/users/page.tsx">
                      Password
                    </span></label>
                    <input type="password" value={newUser.password} onChange={e => setNewUser({
                  ...newUser,
                  password: e.target.value
                })} className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Create a password" required data-unique-id="7583e5e7-42ea-4200-8fb9-68f7cd3b0b43" data-file-name="app/admin/users/page.tsx" />
                  </div>
                  
                  <div data-unique-id="5e7487c7-3a41-47f4-b065-c337f43a3378" data-file-name="app/admin/users/page.tsx">
                    <label className="block text-sm font-medium text-gray-300 mb-1" data-unique-id="32ab9890-d182-49e1-8565-34dc357dadb9" data-file-name="app/admin/users/page.tsx">
                      <Key className="h-4 w-4 mr-1 inline-block" /><span className="editable-text" data-unique-id="9d2b1e4c-d387-49e0-8797-fe923abce0df" data-file-name="app/admin/users/page.tsx">
                      Confirm Password
                    </span></label>
                    <input type="password" value={newUser.confirmPassword} onChange={e => setNewUser({
                  ...newUser,
                  confirmPassword: e.target.value
                })} className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Confirm password" required data-unique-id="54066d54-bf75-456b-a209-c5945917c502" data-file-name="app/admin/users/page.tsx" />
                  </div>
                  
                  <div data-unique-id="489ea7cd-e833-4818-982d-e4a379f603a2" data-file-name="app/admin/users/page.tsx">
                    <label className="block text-sm font-medium text-gray-300 mb-1" data-unique-id="46a520c4-96c2-4a2c-a82c-887d7f3f391c" data-file-name="app/admin/users/page.tsx">
                      <Shield className="h-4 w-4 mr-1 inline-block" /><span className="editable-text" data-unique-id="49451a71-314b-4701-be6f-3b8a8659fe44" data-file-name="app/admin/users/page.tsx">
                      Role
                    </span></label>
                    <select value={newUser.role} onChange={e => setNewUser({
                  ...newUser,
                  role: e.target.value as 'admin' | 'superadmin'
                })} className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" required data-unique-id="911bb414-f1ee-4dad-affc-40c8708b55a4" data-file-name="app/admin/users/page.tsx">
                      <option value="admin" data-unique-id="c0dbf1f3-868e-40d9-8523-99f1f3d1738c" data-file-name="app/admin/users/page.tsx"><span className="editable-text" data-unique-id="d6bd7631-b423-4839-9cc3-434e0b9c5a06" data-file-name="app/admin/users/page.tsx">Admin</span></option>
                      <option value="superadmin" data-unique-id="0dd00935-88b1-4831-b76e-d85d46e781c1" data-file-name="app/admin/users/page.tsx"><span className="editable-text" data-unique-id="a8f30343-2472-4aa4-adab-cdd2f218b179" data-file-name="app/admin/users/page.tsx">Super Admin</span></option>
                    </select>
                    <p className="mt-1 text-sm text-gray-400" data-unique-id="dbcd5a01-46d9-4c17-861e-77c6a8b927cc" data-file-name="app/admin/users/page.tsx"><span className="editable-text" data-unique-id="3ffd11d5-732a-455e-86b0-f5886b01958e" data-file-name="app/admin/users/page.tsx">
                      Super Admins can manage other users and have full permissions
                    </span></p>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end gap-3" data-unique-id="7568b69b-b958-421c-a884-59376e59498e" data-file-name="app/admin/users/page.tsx">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2.5 bg-gray-700 text-white rounded-md hover:bg-gray-600" data-unique-id="40084097-6268-4f5e-a8fa-14a5ddf1c3e2" data-file-name="app/admin/users/page.tsx"><span className="editable-text" data-unique-id="c20633e4-1696-4f49-b79b-590ae44b80b4" data-file-name="app/admin/users/page.tsx">
                    Cancel
                  </span></button>
                  <button type="submit" disabled={isSubmitting} className="px-4 py-2.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center" data-unique-id="1d006f12-a522-4aa0-8b2c-8028b7d73e16" data-file-name="app/admin/users/page.tsx" data-dynamic-text="true">
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