import { useState, useEffect } from 'react';

function App() {
  const [interval, setInterval] = useState(5); // Default to 5 minutes
  const [pauseDuration, setPauseDuration] = useState(1); // Default to 1 minute
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/timer')
      .then((res) => res.json())
      .then((data) => {
        setInterval(data.interval);
        setPauseDuration(data.pauseDuration);
      });
  }, []);

  const handleSave = () => {
    fetch('http://localhost:5000/timer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ interval, pauseDuration }),
    }).then(() => setMessage('Settings saved!'));
  };

  return (
    <div>
      <h1>Productivity Timer</h1>
      <div>
        <label>
          Interval (minutes):
          <input
            type="number"
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Pause Duration (minutes):
          <input
            type="number"
            value={pauseDuration}
            onChange={(e) => setPauseDuration(e.target.value)}
          />
        </label>
      </div>
      <button onClick={handleSave}>Save Settings</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
