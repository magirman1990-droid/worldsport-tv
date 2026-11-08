exports.handler = async function () {
  try {
  const tomorrow = "2026-11-09";
    const response = await fetch(
      `https://sportscore.com/api/v1/fixtures/?sport=basketball&date=${tomorrow}&status=upcoming&limit=50`
    );

    if (!response.ok) {
      throw new Error("SportScore unavailable");
    }

    const data = await response.json();
    const matches = data.matches || [];

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sport: "basketball",
        count: matches.length,
        matches: matches
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Could not load basketball matches"
      })
    };
  }
};
