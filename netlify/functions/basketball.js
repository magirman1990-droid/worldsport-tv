exports.handler = async function () {
  try {
    const response = await fetch(
      "https://sportscore.com/api/widget/matches/?sport=basketball&limit=50"
    );

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "Basketball data unavailable" })
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not load basketball matches" })
    };
  }
};
