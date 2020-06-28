const path = require('path');
const fs = require('fs');
const { promises: fsPromises } = fs;
const { v4: uuidv4 } = require('uuid');

const contactsPath = path.join(process.cwd() + '/db/contacts.json');

class ContactsModel {
  listContacts = async () => {
    const contactsList = await fsPromises.readFile(contactsPath, 'utf-8');

    return JSON.parse(contactsList);
  };

  getContactById = async contactId => {
    const contactsList = await fsPromises.readFile(contactsPath, 'utf-8');
    const parsedContactsList = JSON.parse(contactsList);
    const targetContact = parsedContactsList.find(
      user => user.id === contactId,
    );

    return targetContact;
  };

  removeContact = async contactId => {
    try {
      const contactsList = await fsPromises.readFile(contactsPath, 'utf-8');
      const filteredContactsList = JSON.parse(contactsList).filter(
        contact => contact.id !== contactId,
      );

      await fsPromises.writeFile(
        contactsPath,
        JSON.stringify(filteredContactsList),
      );

      return console.log(
        `Contact with id ${contactId} was successfully deleted`,
      );
    } catch (e) {
      console.log(e);
    }
  };

  addContact = async candidateContact => {
    const contactsList = await fsPromises.readFile(contactsPath, 'utf-8');

    const newContact = {
      ...candidateContact,
      id: uuidv4(),
    };

    const contactsListWithNewContact = [
      ...JSON.parse(contactsList),
      newContact,
    ];

    await fsPromises.writeFile(
      contactsPath,
      JSON.stringify(contactsListWithNewContact),
    );

    return newContact;
  };
}

module.exports = new ContactsModel();
