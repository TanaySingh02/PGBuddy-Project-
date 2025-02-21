import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MessageCircle, School, BookOpen, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface Student {
  id: string;
  full_name: string;
  college_name: string;
  course: string;
  year: number;
  interests: string[];
  college_id: string;
  profile_image?: string;
}

interface College {
  id: number;
  name: string;
}

const Roommates = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [filters, setFilters] = useState({
    college: '',
    course: '',
    year: '',
    interest: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchColleges();
    fetchStudents();
  }, [filters]);

  // Fetch college list from colleges.json
  const fetchColleges = async () => {
    try {
      const response = await fetch('/colleges.json');
      const data = await response.json();
      setColleges(data);
    } catch (error) {
      console.error('Error fetching colleges:', error);
    }
  };

  // Fetch students based on filters
  const fetchStudents = async () => {
    try {
      let query = supabase
        .from('students')
        .select('*')
        .eq('status', 'verified');

      if (filters.college) {
        query = query.ilike('college_name', `%${filters.college}%`);
      }
      if (filters.course) {
        query = query.eq('course', filters.course);
      }
      if (filters.year) {
        query = query.eq('year', parseInt(filters.year));
      }
      if (filters.interest) {
        query = query.contains('interests', [filters.interest]);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const initiateChat = async (studentId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Please sign in to chat with students');
        return;
      }

      // Create or get existing chat room
      const { data: chatRoom, error } = await supabase
        .from('chat_rooms')
        .insert([
          {
            participant1_id: user.id,
            participant2_id: studentId,
          }
        ])
        .select()
        .single();

      if (error && error.code !== '23505') { // Ignore unique constraint violation
        throw error;
      }

      alert('Chat feature coming soon!');
    } catch (error) {
      console.error('Error initiating chat:', error);
      alert('Failed to start chat. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-navy-900">Find Your Perfect Roommate</h1>
          <p className="mt-2 text-gray-600">Connect with students who share your interests and lifestyle</p>
        </motion.div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* College Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">College</label>
              <select
                value={filters.college}
                onChange={(e) => setFilters(prev => ({ ...prev, college: e.target.value }))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-navy-500 focus:ring-navy-500"
              >
                <option value="">All Colleges</option>
                {colleges.map((college) => (
                  <option key={college.id} value={college.name}>
                    {college.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Course Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
              <select
                value={filters.course}
                onChange={(e) => setFilters(prev => ({ ...prev, course: e.target.value }))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-navy-500 focus:ring-navy-500"
              >
                <option value="">All Courses</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Engineering">Engineering</option>
                <option value="Business">Business</option>
                <option value="Arts">Arts</option>
              </select>
            </div>

            {/* Year Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <select
                value={filters.year}
                onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-navy-500 focus:ring-navy-500"
              >
                <option value="">All Years</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>

            {/* Interest Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interest</label>
              <select
                value={filters.interest}
                onChange={(e) => setFilters(prev => ({ ...prev, interest: e.target.value }))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-navy-500 focus:ring-navy-500"
              >
                <option value="">All Interests</option>
                <option value="Sports">Sports</option>
                <option value="Music">Music</option>
                <option value="Technology">Technology</option>
                <option value="Art">Art</option>
                <option value="Reading">Reading</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roommates;
