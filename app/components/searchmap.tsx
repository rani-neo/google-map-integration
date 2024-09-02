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
  const [selectedLocation, setSelectedLocation] = useState({ lat: 0, lng: 0 });

  function handleLocationChange(event: React.ChangeEvent<HTMLInputElement>) {
    setLocation(event.target.value);
  }

  async function handleSearch() {
    const results: Restaurant[] = await fetchRestaurants(location);
    console.log(results);
    setRestaurants(results);
  }

  function handleRestaurantClick(lat: number, lng: number) {
    setSelectedLocation({ lat, lng });
  }

  return (
    <div>
      <input
        type="text"
        value={location}
        onChange={handleLocationChange}
        placeholder="Enter a location"
        className="p-2 border"
      />
      <button onClick={handleSearch} className="p-2 bg-blue-500 text-white">Search</button>
      <ul>
        {restaurants.map(function (restaurant) {
          return (
            <li key={restaurant.place_id} onClick={function () { handleRestaurantClick(restaurant.geometry.location.lat, restaurant.geometry.location.lng); }}>
              {restaurant.name}
            </li>
          );
        })}
      </ul>
      <GoogleMap lat={selectedLocation.lat} lng={selectedLocation.lng} />
    </div>
  );
}

export default RestaurantSearch;
