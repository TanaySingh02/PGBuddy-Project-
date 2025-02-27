import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase, getCurrentUser } from '../lib/supabase';
import { Home, Search, Users, Bell, Settings, Heart } from 'lucide-react';


const StudentDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('properties');
  const [savedProperties, setSavedProperties] = useState<PropertyType[]>([]);


  const [bookings, setBookings] = useState<any[]>([]);
  const [roommateRequests, setRoommateRequests] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const currentUser = await getCurrentUser();
      
      if (currentUser) {
        setUser(currentUser);
        
        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single();
        
        if (!profileError) {
          setProfile(profileData);
        }
        
        // Fetch student profile data
        const { data: studentData, error: studentError } = await supabase
          .from('student_profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single();
        
        if (!studentError) {
          setStudentProfile(studentData);
        }
        
        // Fetch saved properties
        const { data: savedData } = await supabase
          .from('saved_properties')
          .select('properties(*)')
          .eq('user_id', currentUser.id);
        
          if (savedData) {
            setSavedProperties(savedData.map(item => item.properties));
          }
          
          
        
        // Fetch bookings
        const { data: bookingsData } = await supabase
          .from('bookings')
          .select('*, properties(*)')
          .eq('user_id', currentUser.id);
        
        if (bookingsData) {
          setBookings(bookingsData);
        }
        
        // Fetch roommate requests
        const { data: requestsData } = await supabase
          .from('roommate_requests')
          .select('*, sender:profiles!roommate_requests_sender_id_fkey(*), receiver:profiles!roommate_requests_receiver_id_fkey(*)')
          .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`);
        
        if (requestsData) {
          setRoommateRequests(requestsData);
        }
      }
      
      setLoading(false);
    };
    
    fetchUserData();
  }, []);

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
                <img
                  src={studentProfile?.profile_image || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                  alt={profile?.full_name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <h2 className="mt-4 text-xl font-semibold">{profile?.full_name}</h2>
                <p className="text-gray-500">{studentProfile?.college_name}</p>
                <p className="text-sm text-gray-500">{studentProfile?.course}, {studentProfile?.year}th Year</p>
                
                <div className="mt-6 w-full">
                  <div className="text-sm font-medium text-gray-500 mb-2">Interests</div>
                  <div className="flex flex-wrap gap-2">
                    {studentProfile?.interests?.map((interest: string) => (
                      <span key={interest} className="px-2 py-1 bg-navy-100 text-navy-800 rounded-full text-xs">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <div className="space-y-2">
                  <button
                    onClick={() => setActiveTab('properties')}
                    className={`flex items-center space-x-2 w-full px-4 py-2 rounded-md text-left ${
                      activeTab === 'properties' ? 'bg-navy-100 text-navy-800' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Home className="h-5 w-5" />
                    <span>Saved Properties</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className={`flex items-center space-x-2 w-full px-4 py-2 rounded-md text-left ${
                      activeTab === 'bookings' ? 'bg-navy-100 text-navy-800' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Search className="h-5 w-5" />
                    <span>My Bookings</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('roommates')}
                    className={`flex items-center space-x-2 w-full px-4 py-2 rounded-md text-left ${
                      activeTab === 'roommates' ? 'bg-navy-100 text-navy-800' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Users className="h-5 w-5" />
                    <span>Roommate Requests</span>
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
              {activeTab === 'properties' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Saved Properties</h2>
                  
                  {savedProperties.length === 0 ? (
                    <div className="text-center py-12">
                      <Heart className="h-12 w-12 text-gray-300 mx-auto" />
                      <p className="mt-4 text-gray-500">You haven't saved any properties yet</p>
                      <button className="mt-4 px-4 py-2 bg-navy-600 text-white rounded-md">
                        Browse Properties
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Property cards would go here */}
                      <p>Your saved properties will appear here</p>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'bookings' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">My Bookings</h2>
                  
                  {bookings.length === 0 ? (
                    <div className="text-center py-12">
                      <Home className="h-12 w-12 text-gray-300 mx-auto" />
                      <p className="mt-4 text-gray-500">You don't have any bookings yet</p>
                      <button className="mt-4 px-4 py-2 bg-navy-600 text-white rounded-md">
                        Find a PG
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Booking items would go here */}
                      <p>Your bookings will appear here</p>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'roommates' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Roommate Requests</h2>
                  
                  {roommateRequests.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="h-12 w-12 text-gray-300 mx-auto" />
                      <p className="mt-4 text-gray-500">You don't have any roommate requests</p>
                      <button className="mt-4 px-4 py-2 bg-navy-600 text-white rounded-md">
                        Find Roommates
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Roommate request items would go here */}
                      <p>Your roommate requests will appear here</p>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Notifications</h2>
                  <p>Your notifications will appear here</p>
                </div>
              )}
              
              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={profile?.full_name}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            value={user?.email}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Student Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            College Name
                          </label>
                          <input
                            type="text"
                            value={studentProfile?.college_name}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Course
                          </label>
                          <input
                            type="text"
                            value={studentProfile?.course}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Year
                          </label>
                          <select
                            value={studentProfile?.year}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          >
                            <option value="1">1st Year</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            College ID
                          </label>
                          <input
                            type="text"
                            value={studentProfile?.college_id}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Interests</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {['Sports', 'Music', 'Technology', 'Art', 'Reading'].map((interest) => (
                          <label key={interest} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={studentProfile?.interests?.includes(interest)}
                              className="rounded border-gray-300 text-navy-600 focus:ring-navy-500"
                            />
                            <span className="text-sm text-gray-700">{interest}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <button className="px-4 py-2 bg-navy-600 text-white rounded-md">
                        Save Changes
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

export default StudentDashboard;