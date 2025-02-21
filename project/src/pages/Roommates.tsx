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

const Roommates = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filters, setFilters] = useState({
    college: '',
    course: '',
    year: '',
    interest: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, [filters]);

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

  return (
    <div className="min-h-screen bg-white pt-20 pb-12 text-navy-900">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <h1 className="text-4xl font-bold">Find Your Perfect Roommate</h1>
          <p className="mt-2 text-gray-600">Connect with students who share your interests and lifestyle</p>
        </motion.div>

        {/* Filters */}
        <div className="bg-navy-100 rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {['College', 'Course', 'Year', 'Interest'].map((label, index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-navy-900 mb-1">{label}</label>
                <input
                  type="text"
                  className="w-full rounded-md border-gray-300 focus:border-navy-500 focus:ring-navy-500"
                  placeholder={`Enter ${label.toLowerCase()}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Students List */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading students...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => (
              <motion.div key={student.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-navy-50 border border-navy-300 rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center space-x-4">
                    <img src={student.profile_image || 'https://via.placeholder.com/150'} alt={student.full_name} className="h-16 w-16 rounded-full object-cover" />
                    <div>
                      <h3 className="text-lg font-semibold text-navy-900">{student.full_name}</h3>
                      <p className="text-sm text-gray-600">{student.year}th Year Student</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-navy-800"><School className="h-4 w-4 mr-2" />{student.college_name}</div>
                    <div className="flex items-center text-sm text-navy-800"><BookOpen className="h-4 w-4 mr-2" />{student.course}</div>
                    <div className="flex items-center text-sm text-navy-800"><Heart className="h-4 w-4 mr-2" />{student.interests.join(', ')}</div>
                  </div>
                  <button className="mt-6 w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-navy-600 hover:bg-navy-700">
                    <MessageCircle className="h-4 w-4 mr-2" />Chat with {student.full_name.split(' ')[0]}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Roommates;
