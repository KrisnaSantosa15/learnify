// Simple test to check if the API is working
async function testChallengesAPI() {
  try {
    console.log("Testing /api/challenges...");
    const response = await fetch("http://localhost:3000/api/challenges");
    const data = await response.json();

    console.log("Response status:", response.status);
    console.log("Response data:", data);

    if (data.challenges && Array.isArray(data.challenges)) {
      console.log("✅ API is working correctly");
      console.log("Number of challenges:", data.challenges.length);

      if (data.challenges.length > 0) {
        console.log("First challenge:", data.challenges[0]);
      }
    } else {
      console.log("❌ API response format is incorrect");
    }
  } catch (error) {
    console.error("❌ Error testing API:", error);
  }
}

// Run the test
testChallengesAPI();
