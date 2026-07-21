async function test() {
  try {
    const res = await fetch('https://sukjai-2on8.vercel.app/api/diary', {
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
