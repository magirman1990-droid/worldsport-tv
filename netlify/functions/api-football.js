exports.handler = async function () {
  const key = process.env.API_FOOTBALL_KEY;

  if (!key) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API key missing" })
    };
  }

  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Oslo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).formatToParts(new Date());

    const y = parts.find(p => p.type === "year").value;
    const m = parts.find(p => p.type === "month").value;
    const d = parts.find(p => p.type === "day").value;

    const start = Date.UTC(y, m - 1, d);
    const matches = [];

    for (let i = 0; i < 8; i++) {
      const date = new Date(start + i * 86400000)
        .toISOString().slice(0, 10);

      const url = `https://v3.football.api-sports.io/fixtures?date=${date}&timezone=Europe%2FOslo`;

      const res = await fetch(url, {
        headers: { "x-apisports-key": key }
      });

      const data = await res.json();

      if (data.response) {
        matches.push(...data.response);
      }
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        results: matches.length,
        response: matches
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not load matches" })
    };
  }
};
