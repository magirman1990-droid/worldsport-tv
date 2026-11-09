
exports.handler = async function () {
  const token = process.env.FOOTBALL_DATA_TOKEN;

  if (!token) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API token is missing" })
    };
  }

  const today = new Date();
  const dateFrom = today.toISOString().slice(0, 10);

  const future = new Date();
  future.setDate(future.getDate() + 10);
  const dateTo = future.toISOString().slice(0, 10);

  try {
    const response = await fetch(
      `https://api.football-data.org/v4/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`,
      {
        headers: {
          "X-Auth-Token": token
        }
      }
    );

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
      body: JSON.stringify({ error: "Could not load matches" })
    };
  }
};
