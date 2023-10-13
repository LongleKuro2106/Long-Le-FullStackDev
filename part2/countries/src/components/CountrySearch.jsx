import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CountryDetailPage from './CountryDetailPage';

const CountrySearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [countries, setCountries] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    if (searchQuery) {
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
        .then((response) => {
          const matchingCountries = response.data.filter((country) =>
            country.name.common.toLowerCase().includes(searchQuery.toLowerCase())
          );

          if (matchingCountries.length > 10) {
            setMessage('Too many matches. Please be more specific.');
            setCountries([]);
          } else {
            setMessage('');
            setCountries(matchingCountries);
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    } else {
      setMessage('');
      setCountries([]);
    }
  }, [searchQuery]);

  const handleCountryClick = (country) => {
    setSelectedCountry(country);
  };

  const handleCloseDetail = () => {
    setSelectedCountry(null);
  };

  return (
    <div>
      <h1>Country Search</h1>
      <input
        type="text"
        placeholder="Search for a country"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {message && <p>{message}</p>}
      {countries.length > 0 && (
        <ul>
          {countries.map((country) => (
            <li key={country.cca3}>
              {country.name.common}
              <button onClick={() => handleCountryClick(country)}>Show</button>
            </li>
          ))}
        </ul>
      )}
      {selectedCountry && (
        <CountryDetailPage
          country={selectedCountry}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
};

export default CountrySearch;
