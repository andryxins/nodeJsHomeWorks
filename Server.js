const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const contactsRoutes = require('./Api/ContactsRoutes/ContactsRoutes');
const authRoutes = require('./Api/AuthRoutes/AuthRoutes');
const usersRoutes = require('./Api/UsersRoutes/UsersRoutes');

const PORT = process.env.PORT || 8080;

class Server {
  constructor() {
    this.server = null;
  }

  initMiddlewares() {
    this.server.use(express.json({ limit: '25kb' }));
    this.server.use(cors({ origin: 'http://localhost:3000' }));
    this.server.use(
      morgan(':method :url :status :res[content-length] - :response-time ms'),
    );
  }

  initRoutes() {
    this.server.use('/api', contactsRoutes);
    this.server.use('/auth', authRoutes);
    this.server.use('/users', usersRoutes);
  }

  initServer() {
    this.server = express();
  }

  initListening() {
    this.server.listen(PORT, () => {
      console.log('Server started listening on port', PORT);
    });
  }

  async initDB() {
    try {
      await mongoose.connect(process.env.CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      });

      console.log('Database connection successful');
    } catch (e) {
      console.log(e);
      process.exit(1);
    }
  }

  async start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    await this.initDB();
    this.initListening();
  }
}

module.exports = new Server();
