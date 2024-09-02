'use client';

import React, { useState } from 'react';
import { AutocompleteResult, fetchRestaurantAutocomplete, PlacePrediction} from '@/app/actions/searchmap';

function isPlacePrediction(result: AutocompleteResult): result is PlacePrediction {
    return (result as PlacePrediction).placePrediction !== undefined;
  }

function RestaurantAutocompleteSearch() {
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postcode, setPostcode] = useState('');
  const [results, setResults] = useState<AutocompleteResult[]>([]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      const suggestions = await fetchRestaurantAutocomplete(query, city, state, postcode);
      setResults(suggestions);
    } catch (error) {
      console.error('Error fetching autocomplete suggestions:', error);
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Restaurant Autocomplete Search</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Query:</label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter restaurant name"
            className="p-2 border w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">City:</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city"
            className="p-2 border w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">State:</label>
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="Enter state"
            className="p-2 border w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Postcode:</label>
          <input
            type="text"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            placeholder="Enter postcode"
            className="p-2 border w-full"
            required
          />
        </div>
        <button type="submit" className="p-2 bg-blue-500 text-white">
          Search
        </button>
      </form>
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Results:</h2>
        <ul className="list-disc list-inside">
          {results.map((result, index) => (
            <li key={index} className="mt-2">
              {isPlacePrediction(result) 
                ? result.placePrediction?.text.text 
                : result.queryPrediction?.text.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default RestaurantAutocompleteSearch;
