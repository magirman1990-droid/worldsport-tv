exports.handler = async function (event) {
  const key = process.env.API_FOOTBALL_KEY;

  if (!key) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API key missing" })
    };
  }

  const headers = {
    "x-apisports-key": key
  };

  const responseHeaders = {
    "Content-Type": "application/json",
    "Netlify-CDN-Cache-Control":
      "public, durable, s-maxage=900, stale-while-revalidate=60"
  };

  try {
    const teamSearch = event.queryStringParameters?.team?.trim();

    // SÖK EFTER ETT LAG
    if (teamSearch) {
      if (teamSearch.length < 3) {
        return {
          statusCode: 200,
          headers: responseHeaders,
          body: JSON.stringify({ results: 0, response: [] })
        };
      }

      const teamUrl =
        `https://v3.football.api-sports.io/teams?search=${encodeURIComponent(teamSearch)}`;

      const teamRes = await fetch(teamUrl, { headers });
      const teamData = await teamRes.json();

      if (!teamData.response || teamData.response.length === 0) {
  return {
    statusCode: 200,
    headers: responseHeaders,
    body: JSON.stringify({
      teamSearch,
      results: 0,
      errors: teamData.errors,
      response: teamData.response || []
    })
  };
      }

      const search = teamSearch.toLowerCase();

      const selectedTeam =
        teamData.response.find(t =>
          t.team.name.toLowerCase() === search
        ) || teamData.response[0];

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
const teamMatches = [];
const apiErrors = [];
async function searchDays(firstDay, lastDay) {
  for (let i = firstDay; i < lastDay; i++) {
    const date = new Date(start + i * 86400000)
      .toISOString().slice(0, 10);

    const fixturesUrl =
      `https://v3.football.api-sports.io/fixtures?date=${date}&timezone=Europe%2FOslo`;

    const fixturesRes = await fetch(fixturesUrl, { headers });
    const fixturesData = await fixturesRes.json();
if (fixturesData.errors && Object.keys(fixturesData.errors).length > 0) {
  apiErrors.push({
    date,
    errors: fixturesData.errors
  });
}
    const found = (fixturesData.response || []).filter(match =>
      match.teams.home.id === selectedTeam.team.id ||
      match.teams.away.id === selectedTeam.team.id
    );

    teamMatches.push(...found);
  }
}

// Sök endast datum som gratisplanen tillåter
await searchDays(-1, 2);

        
      return {
  statusCode: 200,
  headers: responseHeaders,
  body: JSON.stringify({
  team: selectedTeam.team.name,
  results: teamMatches.length,
  errors: apiErrors,
  response: teamMatches
})
};
    }

    // VANLIG MATCHHÄMTNING
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

      const url =
        `https://v3.football.api-sports.io/fixtures?date=${date}&timezone=Europe%2FOslo`;

      const res = await fetch(url, { headers });
      const data = await res.json();

      if (data.response) {
        matches.push(...data.response);
      }
    }

    return {
      statusCode: 200,
      headers: responseHeaders,
      body: JSON.stringify({
        results: matches.length,
        response: matches
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: responseHeaders,
      body: JSON.stringify({
        error: "Could not load matches"
      })
    };
  }
};
