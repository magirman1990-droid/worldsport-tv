
exports.handler = async function () {
  try {
    const apiKey = process.env.BASKETBALL_API_KEY;

    if (!apiKey) {
      throw new Error("Missing Basketball API key");
    }

    const dates = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setUTCDate(date.getUTCDate() + i);
      dates.push(date.toISOString().slice(0, 10));
    }

    const results = await Promise.all(
      dates.map(date =>
        fetch(`https://v1.basketball.api-sports.io/games?date=${date}&timezone=Europe/Oslo`, {
          headers: {
            "x-apisports-key": apiKey
          }
        }).then(response => {
          if (!response.ok) throw new Error("Basketball API error");
          return response.json();
        })
      )
    );

    const matches = results.flatMap(data =>
      (data.response || []).map(item => ({
        time: item.game.date,
        home: item.teams.home.name,
        away: item.teams.away.name,
        home_score: item.scores.home.total,
        away_score: item.scores.away.total,
        competition: item.league.name,
        country: item.country.name,
        flag: item.country.flag,
        status: item.game.status.short,
        status_text: item.game.status.long
      }))
    );

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
      body: JSON.stringify({
        error: "Basketball data unavailable"
      })
    };
  }
};
