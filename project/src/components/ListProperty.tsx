import React, { useState } from 'react';
import { Building2, MapPin, IndianRupee, BedDouble, Users, Upload, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

interface FormData {
  title: string;
  description: string;
  location: string;
  propertyType: string;
  price: string;
  beds: string;
  maxOccupants: string;
  amenities: string[];
  rules: string[];
  images: File[];
}

const ListPropertyForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    location: '',
    propertyType: '',
    price: '',
    beds: '',
    maxOccupants: '',
    amenities: [],
    rules: [],
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const amenityOptions = [
    'Wi-Fi',
    'AC',
    'Washing Machine',
    'TV',
    'Fridge',
    'Geyser',
    'Power Backup',
    'Parking',
    'Security',
    'CCTV',
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...files],
      }));

      // Create preview URLs
      const newPreviewUrls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Upload images to Supabase storage
      const imageUrls = await Promise.all(
        formData.images.map(async (image) => {
          const fileName = `${user.id}/${Date.now()}-${image.name}`;
          const { data, error } = await supabase.storage
            .from('property-images')
            .upload(fileName, image);

          if (error) throw error;
          return data.path;
        })
      );

      // Create property listing in database
      const { error } = await supabase.from('properties').insert({
        owner_id: user.id,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        property_type: formData.propertyType,
        price: parseFloat(formData.price),
        beds: parseInt(formData.beds),
        max_occupants: parseInt(formData.maxOccupants),
        amenities: formData.amenities,
        rules: formData.rules,
        images: imageUrls,
        status: 'pending',
      });

      if (error) throw error;

      // Reset form
      setFormData({
        title: '',
        description: '',
        location: '',
        propertyType: '',
        price: '',
        beds: '',
        maxOccupants: '',
        amenities: [],
        rules: [],
        images: [],
      });
      setStep(1);
      setPreviewUrls([]);
    } catch (error) {
      console.error('Error listing property:', error);
      alert('Failed to list property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="container max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 md:p-8"
        >
          <h1 className="text-2xl font-bold text-navy-900 mb-6">List Your Property</h1>
          
          {/* Progress Steps */}
          <div className="flex justify-between mb-8">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`flex items-center ${num !== 3 ? 'flex-1' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= num ? 'bg-navy-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {num}
                </div>
                {num !== 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step > num ? 'bg-navy-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Property Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-navy-500 focus:border-navy-500"
                      placeholder="e.g., Cozy PG in Koramangala"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-navy-500 focus:border-navy-500"
                      rows={4}
                      placeholder="Describe your property..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-navy-500 focus:border-navy-500"
                        placeholder="Enter property location"
                        required
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Property Type
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <select
                          value={formData.propertyType}
                          onChange={(e) => setFormData(prev => ({ ...prev, propertyType: e.target.value }))}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-navy-500 focus:border-navy-500"
                          required
                        >
                          <option value="">Select type</option>
                          <option value="single">Single Room</option>
                          <option value="double">Double Sharing</option>
                          <option value="triple">Triple Sharing</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Monthly Rent
                      </label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-navy-500 focus:border-navy-500"
                          placeholder="Enter monthly rent"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Beds
                      </label>
                      <div className="relative">
                        <BedDouble className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="number"
                          value={formData.beds}
                          onChange={(e) => setFormData(prev => ({ ...prev, beds: e.target.value }))}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-navy-500 focus:border-navy-500"
                          placeholder="Number of beds"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Maximum Occupants
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="number"
                          value={formData.maxOccupants}
                          onChange={(e) => setFormData(prev => ({ ...prev, maxOccupants: e.target.value }))}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-navy-500 focus:border-navy-500"
                          placeholder="Max occupants"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amenities
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {amenityOptions.map((amenity) => (
                        <label
                          key={amenity}
                          className="flex items-center space-x-2 text-sm"
                        >
                          <input
                            type="checkbox"
                            checked={formData.amenities.includes(amenity)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData(prev => ({
                                  ...prev,
                                  amenities: [...prev.amenities, amenity],
                                }));
                              } else {
                                setFormData(prev => ({
                                  ...prev,
                                  amenities: prev.amenities.filter(a => a !== amenity),
                                }));
                              }
                            }}
                            className="rounded border-gray-300 text-navy-600 focus:ring-navy-500"
                          />
                          <span>{amenity}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property Images
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                      <div className="flex flex-col items-center">
                        <Upload className="h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">
                          Drag and drop images here, or click to select files
                        </p>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="mt-4"
                        />
                      </div>
                    </div>
                  </div>

                  {previewUrls.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {previewUrls.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      House Rules
                    </label>
                    <textarea
                      value={formData.rules.join('\n')}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        rules: e.target.value.split('\n').filter(rule => rule.trim() !== ''),
                      }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-navy-500 focus:border-navy-500"
                      rows={4}
                      placeholder="Enter house rules (one per line)"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 flex justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-4 py-2 text-sm font-medium text-navy-600 border border-navy-600 rounded-md hover:bg-navy-50"
                >
                  Previous
                </button>
              )}
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto px-4 py-2 text-sm font-medium text-white bg-navy-600 rounded-md hover:bg-navy-700"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="ml-auto px-4 py-2 text-sm font-medium text-white bg-navy-600 rounded-md hover:bg-navy-700 disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'List Property'}
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ListPropertyForm;