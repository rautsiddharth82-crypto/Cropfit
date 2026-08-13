(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/weather/current?lat=30.489&lon=76.59');
    const data = await res.json();
    console.log('Weather Response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
})();
