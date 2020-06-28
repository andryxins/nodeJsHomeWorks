const Joi = require('@hapi/joi');
const contactsModel = require('../../Model/ContactsModel');

class ContactsController {
  getAllContacts = async (req, res, next) => {
    try {
      const contacts = await contactsModel.listContacts();

      return res.status(200).json(contacts);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  };

  getContactsById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const targetContact = await contactsModel.getContactById(id);

      if (!targetContact) {
        return res.status(404).json({ message: 'Not Found' });
      }

      return res.status(200).json(targetContact);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  };

  createNewUser = async (req, res, next) => {
    try {
      const newContact = await contactsModel.addContact(req.body);

      return res.status(201).json(newContact);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  };

  validateNewUser = async (req, res, next) => {
    try {
      const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        phone: Joi.string().required(),
      });

      await schema.validateAsync(req.body);

      next();
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  };
}

module.exports = new ContactsController();
