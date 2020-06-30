const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const contactsRoutes = require('./Api/ContactsRoutes/ContactsRoutes');

const PORT = process.env.PORT || 8080;

class Server {
    constructor() {
        this.server = null
    }

    initMiddlewares() {
        this.server.use(express.json());
        this.server.use(cors({ origin: 'http://localhost:3000' }));
        this.server.use(
            morgan(':method :url :status :res[content-length] - :response-time ms'),
        );
    }

    initRoutes() {
        this.server.use('/api', contactsRoutes);
    }

    initServer() {
        this.server = express();
    }

    initListening() {
        this.server.listen(PORT, () => {
            console.log('Server started listening on port', PORT);
        })
    }

    start() {
        this.initServer()
        this.initMiddlewares()
        this.initRoutes()
        this.initListening()
    }
}

module.exports = new Server()