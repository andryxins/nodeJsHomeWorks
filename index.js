const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const contactsRoutes = require('./Api/ContactsRoutes/ContactsRoutes');

const app = express();

// middlewares

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms'),
);

// routes

app.use('/api', contactsRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log('Server started listening on port', PORT);
});
