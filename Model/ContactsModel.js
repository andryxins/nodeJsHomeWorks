const path = require('path');
const fs = require('fs');
const { promises: fsPromises } = fs;

const contactsPath = path.join(process.cwd() + '/db/contacts.json');

class ContactsModel {
  listContacts = async () => {
    const contactsList = await fsPromises.readFile(contactsPath, 'utf-8');

    return JSON.parse(contactsList);
  };

  getContactById = async contactId => {
    const contactsList = await this.listContacts();
    const targetContact = contactsList.find(user => user.id === contactId);

    return targetContact;
  };

  removeContact = async contactId => {
    const contactsList = await this.listContacts();

    const targetContactIdx = contactsList.findIndex(
      contact => contact.id === contactId,
    );

    if (targetContactIdx === -1) {
      return false;
    }

    contactsList.splice(targetContactIdx, 1);

    await fsPromises.writeFile(contactsPath, JSON.stringify(contactsList));

    return true;
  };

  addContact = async candidateContact => {
    const contactsList = await this.listContacts();

    const newContact = {
      ...candidateContact,
      id: Math.floor(Math.random() * 10000) + '',
    };

    await fsPromises.writeFile(
      contactsPath,
      JSON.stringify([...contactsList, newContact]),
    );

    return newContact;
  };

  updateContact = async (id, updatedFields) => {
    const contactsList = await this.listContacts();

    const targetContactIdx = contactsList.findIndex(
      contact => contact.id === id,
    );

    if (targetContactIdx === -1) {
      return null;
    }

    const updatedContact = {
      ...contactsList[targetContactIdx],
      ...updatedFields,
    };

    contactsList[targetContactIdx] = updatedContact;

    await fsPromises.writeFile(contactsPath, JSON.stringify(contactsList));

    return updatedContact;
  };
}

module.exports = new ContactsModel();
