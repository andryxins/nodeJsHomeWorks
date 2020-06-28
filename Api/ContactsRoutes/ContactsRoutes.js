const { Router } = require('express');
const contactsRoutes = Router();
const ContactsControllers = require('./ContactsControllers');

contactsRoutes.get('/contacts', ContactsControllers.getAllContacts);

contactsRoutes.get('/contacts/:id', ContactsControllers.getContactsById);

contactsRoutes.post(
  '/contacts',
  ContactsControllers.validateNewUser,
  ContactsControllers.createNewUser,
);

module.exports = contactsRoutes;
