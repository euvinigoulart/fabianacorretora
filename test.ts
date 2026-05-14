const test = async () => {
  const res = await fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin', pass: '123456' })
  });
  console.log('Status:', res.status);
  const text = await res.text();
  console.log('Body:', text);
};
test();
