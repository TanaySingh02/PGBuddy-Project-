import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase, getCurrentUser } from '../lib/supabase';
import { Users, Building2, Shield, CheckCircle, XCircle, Bell, Settings, User } from 'lucide-react';

const AdminDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [pendingProperties, setPendingProperties] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    totalBookings: 0,
    pendingVerifications: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const currentUser = await getCurrentUser();
      
      if (currentUser) {
        setUser(currentUser);
        
        // Fetch admin profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single();
        
        if (!profileError) {
          setProfile(profileData);
        }
        
        // Fetch pending student verifications
        const { data: pendingStudents } = await supabase
          .from('student_profiles')
          .select('*, profiles(*)')
          .eq('status', 'pending');
        
        // Fetch pending owner verifications
        const { data: pendingOwners } = await supabase
          .from('owner_profiles')
          .select('*, profiles(*)')
          .eq('verification_status', 'pending');
        
        // Combine pending users
        const allPendingUsers = [
          ...(pendingStudents || []).map(student => ({
            ...student,
            type: 'student'
          })),
          ...(pendingOwners || []).map(owner => ({
            ...owner,
            type: 'owner'
          }))
        ];
        
        setPendingUsers(allPendingUsers);
        
        // Fetch pending properties
        const { data: pendingProps } = await supabase
          .from('properties')
          .select('*, profiles!inner(*)')
          .eq('status', 'pending');
        
        if (pendingProps) {
          setPendingProperties(pendingProps);
        }
        
        // Fetch stats
        const { count: userCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        const { count: propertyCount } = await supabase
          .from('properties')
          .select('*', { count: 'exact', head: true });
        
        const { count: bookingCount } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true });
        
        setStats({
          totalUsers: userCount || 0,
          totalProperties: propertyCount || 0,
          totalBookings: bookingCount || 0,
          pendingVerifications: allPendingUsers.length + (pendingProps?.length || 0)
        });
      }
      
      setLoading(false);
    };
    
    fetchData();
  }, []);

  const handleVerifyUser = async (userId: string, userType: string, approve: boolean) => {
    try {
      if (userType === 'student') {
        await supabase
          .from('student_profiles')
          .update({ status: approve ? 'verified' : 'rejected' })
          .eq('id', userId);
      } else {
        await supabase
          .from('owner_profiles')
          .update({ verification_status: approve ? 'verified' : 'rejected' })
          .eq('id', userId);
      }
      
      // Remove from pending list
      setPendingUsers(pendingUsers.filter(user => user.id !== userId));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        pendingVerifications: prev.pendingVerifications - 1
      }));
    } catch (error) {
      console.error('Error verifying user:', error);
    }
  };

  const handleVerifyProperty = async (propertyId: string, approve: boolean) => {
    try {
      await supabase
        .from('properties')
        .update({ status: approve ? 'published' : 'rejected' })
        .eq('id', propertyId);
      
      // Remove from pending list
      setPendingProperties(pendingProperties.filter(prop => prop.id !== propertyId));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        pendingVerifications: prev.pendingVerifications - 1
      }));
    } catch (error) {
      console.error('Error verifying property:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex flex-col items-center">
                <div className="p-3 bg-navy-100 rounded-full">
                  <Shield className="h-12 w-12 text-navy-600" />
                </div>
                <h2 className="mt-4 text-xl font-semibold">{profile?.full_name || 'Admin'}</h2>
                <p className="text-gray-500">Administrator</p>
                
                <div className="mt-6 w-full">
                  <div className="text-sm font-medium text-gray-500 mb-2">Dashboard Overview</div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Users:</span>
                      <span className="text-sm font-medium">{stats.totalUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Properties:</span>
                      <span className="text-sm font-medium">{stats.totalProperties}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Bookings:</span>
                      <span className="text-sm font-medium">{stats.totalBookings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Pending Verifications:</span>
                      <span className="text-sm font-medium text-orange-500">{stats.pendingVerifications}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <div className="space-y-2">
                  <button
                    onClick={() => setActiveTab('users')}
                    className={`flex items-center space-x-2 w-full px-4 py-2 rounded-md text-left ${
                      activeTab === 'users' ? 'bg-navy-100 text-navy-800' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Users className="h-5 w-5" />
                    <span>User Verification</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('properties')}
                    className={`flex items-center space-x-2 w-full px-4 py-2 rounded-md text-left ${
                      activeTab === 'properties' ? 'bg-navy-100 text-navy-800' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Building2 className="h-5 w-5" />
                    <span>Property Approval</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('notifications')}
                    className={`flex items-center space-x-2 w-full px-4 py-2 rounded-md text-left ${
                      activeTab === 'notifications' ? 'bg-navy-100 text-navy-800' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Bell className="h-5 w-5" />
                    <span>Notifications</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`flex items-center space-x-2 w-full px-4 py-2 rounded-md text-left ${
                      activeTab === 'settings' ? 'bg-navy-100 text-navy-800' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              {activeTab === 'users' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">User Verification</h2>
                  
                  {pendingUsers.length === 0 ? (
                    <div className="text-center py-12">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                      <p className="mt-4 text-gray-500">No pending user verifications</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {pendingUsers.map((pendingUser) => (
                        <div key={pendingUser.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex flex-col md:flex-row justify-between">
                            <div>
                              <div className="flex items-center space-x-3">
                                <div className="p-2 bg-navy-100 rounded-full">
                                  {pendingUser.type === 'student' ? (
                                    <User className="h-5 w-5 text-navy-600" />
                                  ) : (
                                    <Building2 className="h-5 w-5 text-navy-600" />
                                  )}
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold">{pendingUser.profiles.full_name}</h3>
                                  <p className="text-sm text-gray-500 capitalize">{pendingUser.type}</p>
                                </div>
                              </div>
                              
                              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {pendingUser.type === 'student' ? (
                                  <>
                                    <div>
                                      <span className="text-sm font-medium text-gray-500">College:</span>
                                      <p className="text-sm">{pendingUser.college_name}</p>
                                    </div>
                                    <div>
                                      <span className="text-sm font-medium text-gray-500">Course:</span>
                                      <p className="text-sm">{pendingUser.course}</p>
                                    </div>
                                    <div>
                                      <span className="text-sm font-medium text-gray-500">Year:</span>
                                      <p className="text-sm">{pendingUser.year}</p>
                                    </div>
                                    <div>
                                      <span className="text-sm font-medium text-gray-500">College ID:</span>
                                      <p className="text-sm">{pendingUser.college_id}</p>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div>
                                      <span className="text-sm font-medium text-gray-500">Company:</span>
                                      <p className="text-sm">{pendingUser.company_name || 'N/A'}</p>
                                    </div>
                                    <div>
                                      <span className="text-sm font-medium text-gray-500">Contact:</span>
                                      <p className="text-sm">{pendingUser.contact_number}</p>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                            
                            <div className="mt-4 md:mt-0 flex md:flex-col space-x-4 md:space-x-0 md:space-y-2">
                              <button
                                onClick={() => handleVerifyUser(pendingUser.id, pendingUser.type, true)}
                                className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4" />
                                <span>Approve</span>
                              </button>
                              <button
                                onClick={() => handleVerifyUser(pendingUser.id, pendingUser.type, false)}
                                className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                              >
                                <XCircle className="h-4 w-4" />
                                <span>Reject</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'properties' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Property Approval</h2>
                  
                  {pendingProperties.length === 0 ? (
                    <div className="text-center py-12">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                      <p className="mt-4 text-gray-500">No pending property approvals</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {pendingProperties.map((property) => (
                        <div key={property.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex flex-col md:flex-row gap-4">
                            <div className="md:w-1/4">
                              <img
                                src={property.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"}
                                alt={property.title}
                                className="w-full h-32 object-cover rounded-md"
                              />
                            </div>
                            <div className="md:w-3/4">
                              <div className="flex justify-between">
                                <h3 className="text-lg font-semibold">{property.title}</h3>
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                                  Pending
                                </span>
                              </div>
                              <p className="text-gray-500 text-sm mt-1">{property.location}</p>
                              <p className="text-gray-700 mt-2">{property.description.substring(0, 100)}...</p>
                              
                              <div className="mt-2">
                                <span className="text-sm font-medium text-gray-500">Owner:</span>
                                <p className="text-sm">{property.profiles.full_name}</p>
                              </div>
                              
                              <div className="mt-4 flex justify-between items-center">
                                <div className="text-navy-600 font-semibold">₹{property.price}/month</div>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleVerifyProperty(property.id, true)}
                                    className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                    <span>Approve</span>
                                  </button>
                                  <button
                                    onClick={() => handleVerifyProperty(property.id, false)}
                                    className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                  >
                                    <XCircle className="h-4 w-4" />
                                    <span>Reject</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Notifications</h2>
                  <p className="text-gray-500">System notifications will appear here.</p>
                </div>
              )}
              
              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">System Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">General Settings</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="flex items-center justify-between">
                            <span className="text-gray-700">Enable Email Notifications</span>
                            <div className="relative inline-block w-10 mr-2 align-middle select-none">
                              <input type="checkbox" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                              <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                            </div>
                          </label>
                        </div>
                        
                        <div>
                          <label className="flex items-center justify-between">
                            <span className="text-gray-700">Auto-approve Student Accounts</span>
                            <div className="relative inline-block w-10 mr-2 align-middle select-none">
                              <input type="checkbox" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                              <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                            </div>
                          </label>
                        </div>
                        
                        <div>
                          <label className="flex items-center justify-between">
                            <span className="text-gray-700">Require Owner Verification</span>
                            <div className="relative inline-block w-10 mr-2 align-middle select-none">
                              <input type="checkbox" checked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                              <label className="toggle-label block overflow-hidden h-6 rounded-full bg-navy-600 cursor-pointer"></label>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Security Settings</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Admin Email
                          </label>
                          <input
                            type="email"
                            value={user?.email}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Change Password
                          </label>
                          <button className="px-4 py-2 border border-gray-300 rounded-md text-sm">
                            Reset Password
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <button className="px-4 py-2 bg-navy-600 text-white rounded-md">
                        Save Settings
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;