
exports.handler = async function () {
  const apiKey = process.env.API_FOOTBALL_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API_FOOTBALL_KEY is missing" })
    };
  }

  try {
    const getOsloDate = (date) => {
      const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Europe/Oslo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      }).formatToParts(date);

      const year = parts.find(p => p.type === "year").value;
      const month = parts.find(p => p.type === "month").value;
      const day = parts.find(p => p.type === "day").value;

      return `${year}-${month}-${day}`;
    };

    const start = new Date();
    const end = new Date(start);
    end.setDate(end.getDate() + 7);

    const dateFrom = getOsloDate(start);
    const dateTo = getOsloDate(end);

    const url =
  `https://v3.football.api-sports.io/fixtures?next=99&timezone=Europe%2FOslo`;
    const response = await fetch(url, {
      headers: {
        "x-apisports-key": apiKey
      }
    });

    const data = await response.json();

    return {
      statusCode: response.status,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Could not load football matches"
      })
    };
  }
};
