const express = require('express');
const app = express();
app.use(express.json());

const MOVIES = [
  {
    title: 'Thunderstrike',
    genre: 'action',
    mood: ['adventurous', 'intense', 'excited', 'thrilling'],
    score: '88%',
    runtime: '2h 10m',
    cinema: 'AMC Downtown',
    times: ['1:00 PM', '4:30 PM', '7:00 PM']
  },
  {
    title: 'Midnight Scream',
    genre: 'horror',
    mood: ['scared', 'dark', 'frightened', 'spooky'],
    score: '84%',
    runtime: '1h 50m',
    cinema: 'Cinema 21',
    times: ['3:00 PM', '6:00 PM', '9:00 PM']
  },
  {
    title: 'Forever After',
    genre: 'romance',
    mood: ['romantic', 'emotional', 'lovey', 'date night'],
    score: '79%',
    runtime: '1h 55m',
    cinema: 'Living Room Theaters',
    times: ['12:30 PM', '4:00 PM', '6:30 PM']
  },
  {
    title: 'Brave Little Dino',
    genre: 'animation',
    mood: ['happy', 'fun', 'cheerful', 'joyful', 'glad', 'lighthearted'],
    score: '95%',
    runtime: '1h 40m',
    cinema: 'Cinemark Eastside',
    times: ['11:00 AM', '1:30 PM', '5:30 PM']
  },
  {
    title: 'Echoes of Tomorrow',
    genre: 'sci-fi',
    mood: ['curious', 'thoughtful', 'deep', 'mysterious', 'interesting'],
    score: '91%',
    runtime: '2h 5m',
    cinema: 'Regal City Center',
    times: ['2:00 PM', '5:00 PM', '8:00 PM']
  }
];

const EMOJI = {
  action: '🔥',
  horror: '👻',
  romance: '💕',
  animation: '🦕',
  'sci-fi': '🚀'
};

app.post('/webhook', (req, res) => {
  const intent = req.body.queryResult.intent.displayName;
  const params = req.body.queryResult.parameters;
  let response = '';

  if (intent === 'FindMovies') {
    const genre = (params.MovieGenre || '').toLowerCase();
    const list = genre ? MOVIES.filter(m => m.genre === genre) : MOVIES;
    if (!list.length) {
      response = `I don't have any ${genre} movies right now. Try action, horror, romance, sci-fi, or animation!`;
    } else {
      response = `Here is what is playing near you tonight! 🎬\n\n`;
      list.forEach(m => {
        response += `${EMOJI[m.genre]} ${m.title} (${m.genre}) → ${m.cinema}\n`;
      });
      response += `\nWhich movie would you like details on? 🍿`;
    }
  }

  else if (intent === 'GetMovieDetails') {
    const raw = (params.MovieTitle || '').toLowerCase();
    const movie = MOVIES.find(m => m.title.toLowerCase().includes(raw));
    if (!movie) {
      response = `I couldn't find that movie. I have: ${MOVIES.map(m => m.title).join(', ')}.`;
    } else {
      response =
        `${EMOJI[movie.genre]} ${movie.title} | ${movie.genre} | ⭐ ${movie.score} | ${movie.runtime}\n` +
        `📍 ${movie.cinema}\n` +
        `🕐 ${movie.times.join(' | ')}\n\n` +
        `Enjoy the movie! 🍿`;
    }
  }

  else if (intent === 'RecommendMovie') {
    const mood = (params.Mood || 'curious').toLowerCase();
    const movie = MOVIES.find(m => m.mood.includes(mood)) || MOVIES[4];
    response =
      `Perfect pick for a ${mood} mood! 🎭\n\n` +
      `${EMOJI[movie.genre]} ${movie.title} | ${movie.genre} | ⭐ ${movie.score} | ${movie.runtime}\n` +
      `📍 ${movie.cinema}\n` +
      `🕐 ${movie.times.join(' | ')}\n\n` +
      `Enjoy the movie! 🍿`;
  }

  res.json({ fulfillmentText: response });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
