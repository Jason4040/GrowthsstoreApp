const get = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/faq/public");
    const data = await res.json();
    console.log("FAQ API returned:", data.length, "items.");
  } catch (err) {
    console.error("API error:", err);
  }
}
get();
