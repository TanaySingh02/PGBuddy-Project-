import React from 'react';
import { MapPin, Bed, Square } from 'lucide-react';

interface PropertyCardProps {
  property: {
    title: string;
    location: string;
    price: string;
    beds: number;
    area: string;
    image: string;
  };
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={property.image}
        alt={property.title}
        className="w-full h-48 object-cover"
      />
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{property.title}</h3>
        
        <div className="flex items-center mt-2 text-gray-500">
          <MapPin className="h-4 w-4" />
          <span className="ml-1 text-sm">{property.location}</span>
        </div>
        
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <Bed className="h-4 w-4" />
            <span className="ml-1">{property.beds} Bed</span>
          </div>
          
          <div className="flex items-center">
            <Square className="h-4 w-4" />
            <span className="ml-1">{property.area}</span>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-semibold text-blue-600">₹{property.price}/mo</span>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;