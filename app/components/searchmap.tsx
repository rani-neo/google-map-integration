'use client';
import { useState } from 'react';
import { fetchRestaurants } from '@/app/actions/searchmap';
import GoogleMap from './map';

interface Restaurant {
  place_id: string;
  name: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

function RestaurantSearch() {
  const [location, setLocation] = useState('');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedLocation, setSelectedLocation] = useState({ lat: -33.8688, lng: 151.2093 }); // Default to Sydney

  function handleLocationChange(event: React.ChangeEvent<HTMLInputElement>) {
    setLocation(event.target.value);
  }

  async function handleSearch() {
    try {
      const results: Restaurant[] = await fetchRestaurants(location);
      console.log(results);
      setRestaurants(results);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  }

  function handleRestaurantClick(lat: number, lng: number) {
    setSelectedLocation({ lat, lng });
  }


  return (
    <div>
      <div className="search-input">
        <input
          type="text"
          value={location}
          onChange={handleLocationChange}
          placeholder="Enter a location"
          className="p-2 border"
        />
        <button onClick={handleSearch} className="p-2 bg-blue-500 text-white">
          Search
        </button>
      </div>

      <ul className="restaurant-list">
        {restaurants.map((restaurant) => (
          <li
            key={restaurant.place_id}
            onClick={() => handleRestaurantClick(restaurant.geometry.location.lat, restaurant.geometry.location.lng)}
            className="cursor-pointer p-2 hover:bg-gray-200"
          >
            {restaurant.name}
          </li>
        ))} {/* Ensure the closing curly brace here is properly matched */}
      </ul>

      <GoogleMap 
        initialLat={-33.8688} 
        initialLng={151.2093} 
        setCurrentLocation={(location) => console.log('User location:', location)} 
      />
    </div>
  );
}

export default RestaurantSearch;
