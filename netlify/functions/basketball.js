exports.handler = async function () {
  try {
    const today = new Date().toISOString().slice(0, 10);

    const tomorrowDate = new Date();
    tomorrowDate.setUTCDate(tomorrowDate.getUTCDate() + 1);
    const tomorrow = tomorrowDate.toISOString().slice(0, 10);

    const urls = [
      `https://sportscore.com/api/v1/fixtures/?sport=basketball&date=${today}&status=live&limit=50`,
      `https://sportscore.com/api/v1/fixtures/?sport=basketball&date=${today}&status=upcoming&limit=50`,
      `https://sportscore.com/api/v1/fixtures/?sport=basketball&date=${tomorrow}&status=upcoming&limit=50`
    ];

    const responses = await Promise.all(urls.map(url => fetch(url)));

    if (responses.some(response => !response.ok)) {
      throw new Error("API error");
    }

    const results = await Promise.all(responses.map(response => response.json()));
    const matches = results.flatMap(data => data.matches || []);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sport: "basketball",
        count: matches.length,
        matches
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Basketball data unavailable" })
    };
  }
};
