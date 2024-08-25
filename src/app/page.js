'use client';

import { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';

const API_URL = 'https://bfhl-api-7xub.onrender.com'; // Replace with your actual API URL

export default function Home() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);

  const options = [
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'highest_lowercase_alphabet', label: 'Highest lowercase alphabet' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResponse(null);

    try {
      const parsedInput = JSON.parse(input);
      const res = await axios.post(API_URL, parsedInput);
      setResponse(res.data);
    } catch (err) {
      setError('Invalid JSON input or API error');
    }
  };

  const renderResponse = () => {
    if (!response) return null;

    return selectedOptions.map((option) => (
      <div key={option.value}>
        <h3>{option.label}</h3>
        <p>{JSON.stringify(response[option.value])}</p>
      </div>
    ));
  };

  return (
    <main className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">BFHL API Frontend</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-2 border rounded"
          rows="4"
          placeholder='Enter JSON (e.g., { "data": ["A","C","z"] })'
        ></textarea>
        <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
          Submit
        </button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
      {response && (
        <Select
          isMulti
          options={options}
          onChange={setSelectedOptions}
          className="mb-4"
        />
      )}
      {renderResponse()}
    </main>
  );
}