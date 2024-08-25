"use client"

import React, { useState, useEffect } from 'react';

const InputForm = ({ onSubmit }) => {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const parsedJson = JSON.parse(jsonInput);
      if (Array.isArray(parsedJson.data)) {
        setError('');
        onSubmit(parsedJson);
      } else {
        setError('JSON must contain a "data" array.');
      }
    } catch (e) {
      setError('Invalid JSON format.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          rows="10"
          cols="50"
          placeholder='Enter JSON: { "data": ["A", "1", "b", "5"] }'
        />
        <button type="submit">Submit</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

const MultiSelectDropdown = ({ options, selectedOptions, onChange }) => {
  const handleChange = (e) => {
    const value = e.target.value;
    if (selectedOptions.includes(value)) {
      onChange(selectedOptions.filter(option => option !== value));
    } else {
      onChange([...selectedOptions, value]);
    }
  };

  return (
    <div>
      <label>Select Filters: </label>
      <select multiple value={selectedOptions} onChange={handleChange}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

const FilteredResponse = ({ response, filters }) => {
  const { numbers, alphabets, highest_lowercase_alphabet } = response;

  return (
    <div>
      {filters.includes('Numbers') && (
        <div>
          <strong>Numbers:</strong> {numbers.join(', ')}
        </div>
      )}
      {filters.includes('Alphabets') && (
        <div>
          <strong>Alphabets:</strong> {alphabets.join(', ')}
        </div>
      )}
      {filters.includes('Highest Lowercase Alphabet') && (
        <div>
          <strong>Highest Lowercase Alphabet:</strong> {highest_lowercase_alphabet.join(', ')}
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [response, setResponse] = useState(null);
  const [filters, setFilters] = useState([]);

  useEffect(() => {
    document.title = '21BCE11281'; // Replace with your actual roll number
  }, []);

  const handleSubmit = async (jsonInput) => {
    try {
      const res = await fetch('https://backend-api-mc3i.onrender.com/bfhl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonInput),
      });

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <h1>BFHL Frontend</h1>
      <InputForm onSubmit={handleSubmit} />
      {response && (
        <>
          <MultiSelectDropdown
            options={['Numbers', 'Alphabets', 'Highest Lowercase Alphabet']}
            selectedOptions={filters}
            onChange={setFilters}
          />
          <FilteredResponse response={response} filters={filters} />
        </>
      )}
    </div>
  );
};

export default App;
