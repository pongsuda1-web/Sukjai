async function test() {
  try {
    const res = await fetch('http://localhost:3000/api/diary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: 'test', mood: 'happy', note: 'test' })
    });
    const text = await res.text();
    console.log(res.status, text);
  } catch(e) {
    console.error(e);
  }
}
test();
