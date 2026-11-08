exports.handler = async function () {
  try {
    const today = new Date();
    const dates = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setUTCDate(date.getUTCDate() + i);
      dates.push(date.toISOString().slice(0, 10));
    }

    const requests = dates.flatMap((date, index) => {
      const upcoming = fetch(
        `https://sportscore.com/api/v1/fixtures/?sport=basketball&date=${date}&status=upcoming&limit=200`
      ).then(r => {
        if (!r.ok) throw new Error("Upcoming data unavailable");
        return r.json();
      });

      if (index === 0) {
        const live = fetch(
          `https://sportscore.com/api/v1/fixtures/?sport=basketball&date=${date}&status=live&limit=200`
        ).then(r => {
          if (!r.ok) throw new Error("Live data unavailable");
          return r.json();
        });

        return [upcoming, live];
      }

      return [upcoming];
    });

    const results = await Promise.all(requests);
    const matches = results.flatMap(data => data.matches || []);

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
        error: "Could not load basketball matches"
      })
    };
  }
};
