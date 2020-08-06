const { Router } = require('express');
const contactsRoutes = Router();
const CheckAuth = require('../../Middlewares/checkAuth');
const ContactsControllers = require('./ContactsControllers');

contactsRoutes.get(
  '/contacts',
  CheckAuth,
  ContactsControllers.validateParamsOnGetAllContacts,
  ContactsControllers.getAllContacts,
);

contactsRoutes.get(
  '/contacts/:id',
  CheckAuth,
  ContactsControllers.getContactsById,
);

contactsRoutes.post(
  '/contacts',
  CheckAuth,
  ContactsControllers.validateNewContact,
  ContactsControllers.createNewContact,
);

contactsRoutes.patch(
  '/contacts/:id',
  CheckAuth,
  ContactsControllers.validateUpdateContact,
  ContactsControllers.updateContact,
);

contactsRoutes.delete(
  '/contacts/:id',
  CheckAuth,
  ContactsControllers.deleteContact,
);

module.exports = contactsRoutes;
