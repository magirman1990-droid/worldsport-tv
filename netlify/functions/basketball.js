exports.handler = async function () {
  try {
    const tomorrow = new Date();
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

    const date = tomorrow.toISOString().slice(0, 10);

    const response = await fetch(
      `https://sportscore.com/api/v1/fixtures/?sport=basketball&date=${date}&status=upcoming&limit=50`
    );

    if (!response.ok) {
      throw new Error("API error");
    }

    const data = await response.json();

    const matches = (data.matches || []).filter(
      match => match.status === "upcoming"
    );

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sport: "basketball",
        count: matches.length,
        matches
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Basketball data unavailable"
      })
    };
  }
};
