const Joi = require('@hapi/joi');
const Contacts = require('../../Model/Contacts');

class ContactsController {
  getAllContacts = async (req, res, next) => {
    try {
      const contacts = await Contacts.find();

      return res.status(200).json(contacts);
    } catch (err) {
      return this.errorHandler(res, err);
    }
  };

  getContactsById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const targetContact = await Contacts.findOne({ _id: id });

      if (!targetContact) {
        return res.status(404).json({ message: 'Not Found' });
      }

      return res.status(200).json(targetContact);
    } catch (err) {
      return this.errorHandler(res, err);
    }
  };

  createNewContact = async (req, res, next) => {
    try {
      const newContact = await Contacts.create(req.body);

      return res.status(201).json(newContact);
    } catch (err) {
      return this.errorHandler(res, err);
    }
  };

  updateContact = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { body } = req;
      const updatedContact = await Contacts.findOneAndUpdate(
        { _id: id },
        { ...body },
        { new: true },
      );

      if (!updatedContact) {
        return res.status(404).json({ message: 'Not Found' });
      }

      return res.status(200).json(updatedContact);
    } catch (err) {
      return this.errorHandler(res, err);
    }
  };

  deleteContact = async (req, res, next) => {
    try {
      const { id } = req.params;
      const deleteStatus = await Contacts.findOneAndDelete({ _id: id });

      if (!deleteStatus) {
        return res.status(404).json({ message: 'Not found' });
      }

      return res.status(200).json({ message: 'contact deleted' });
    } catch (err) {
      return this.errorHandler(res, err);
    }
  };

  validateNewContact = async (req, res, next) => {
    try {
      const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        phone: Joi.string().required(),
        password: Joi.string().required(),
        subscription: Joi.string(),
      });

      await schema.validateAsync(req.body);

      next();
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }
  };

  validateUpdateContact = async (req, res, next) => {
    try {
      if (!Object.keys(req.body).length) {
        throw new Error('missing fields');
      }

      const schema = Joi.object({
        name: Joi.string(),
        email: Joi.string(),
        phone: Joi.string(),
        password: Joi.string(),
        subscription: Joi.string(),
      });

      await schema.validateAsync(req.body);

      next();
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }
  };

  errorHandler = (res, err) => {
    return res.status(500).send({ message: err.message });
  };
}

module.exports = new ContactsController();
