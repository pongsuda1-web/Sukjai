async function test() {
  try {
    const res = await fetch('https://sukjai-2on8.vercel.app/api/diary?userId=test');
    const text = await res.text();
    console.log(res.status, text);
  } catch(e) {
    console.error(e);
  }
}
test();
