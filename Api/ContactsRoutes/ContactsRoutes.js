const { Router } = require('express');
const contactsRoutes = Router();
const ContactsControllers = require('./ContactsControllers');

contactsRoutes.get('/contacts', ContactsControllers.getAllContacts);

contactsRoutes.get('/contacts/:id', ContactsControllers.getContactsById);

contactsRoutes.post(
  '/contacts',
  ContactsControllers.validateNewContact,
  ContactsControllers.createNewContact,
);

contactsRoutes.patch(
  '/contacts/:id',
  ContactsControllers.validateUpdateContact,
  ContactsControllers.updateContact,
);

contactsRoutes.delete('/contacts/:id', ContactsControllers.deleteContact);

module.exports = contactsRoutes;
