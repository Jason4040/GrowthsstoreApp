const testRegistration = async () => {
  try {
    console.log("Testing user registration...");
    const response = await fetch("https://app.growthsstore.com/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "testuser_" + Date.now(),
        email: "jaygrowth01@gmail.com",
        password: "testpassword",
      }),
    });

    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", data);
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
};

testRegistration();
