// client/src/App.js (example using the fetch API)
import './not-found.css';
import React, { useState, useEffect } from 'react';

function NotFound() {
  const [data, setData] = useState('');

  useEffect(() => {
    fetch('/api') // The proxy setting forwards this to localhost:5000/api
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <div className="Home">
      {/* <h1>{data || 'Loading...'}</h1> */}
      <h1>Welcome to my site!</h1>
      <p>some texts is this workinggg</p>
    </div>
  );
}

export default NotFound;