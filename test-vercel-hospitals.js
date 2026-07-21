async function test() {
  try {
    const res = await fetch('https://sukjai-2on8.vercel.app/api/hospitals');
    const text = await res.text();
    console.log(res.status, text.substring(0, 100));
  } catch(e) {
    console.error(e);
  }
}
test();
