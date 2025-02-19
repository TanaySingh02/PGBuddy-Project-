import React from 'react';
import { Search, MapPin, Building2 } from 'lucide-react';

const SearchBar = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0 md:pr-4">
          <MapPin className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Location"
            className="ml-2 w-full focus:outline-none"
          />
        </div>
        
        <div className="flex items-center border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0 md:px-4">
          <Building2 className="h-5 w-5 text-gray-400" />
          <select className="ml-2 w-full focus:outline-none bg-transparent">
            <option>Property Type</option>
            <option>Single Room</option>
            <option>Double Sharing</option>
            <option>Triple Sharing</option>
          </select>
        </div>
        
        <div className="flex items-center">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Budget"
            className="ml-2 w-full focus:outline-none"
          />
        </div>
      </div>
      
      <div className="mt-4">
        <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
          Search Now
        </button>
      </div>
    </div>
  );
};

export default SearchBar;