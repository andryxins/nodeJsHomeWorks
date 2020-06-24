const path = require('path');
const fs = require('fs');
const { promises: fsPromises } = fs;

const contactsPath = path.join(__dirname + '/db/contacts.json');

const listContacts = async () => {
  try {
    const contactsList = await fsPromises.readFile(contactsPath, 'utf-8');

    return console.table(JSON.parse(contactsList));
  } catch (e) {
    console.log(e);
  }
};

const getContactById = async contactId => {
  try {
    const contactsList = await fsPromises.readFile(contactsPath, 'utf-8');
    const parsedContactsList = JSON.parse(contactsList);
    const targetContact = parsedContactsList.filter(
      user => user.id === contactId,
    );

    return console.table(targetContact);
  } catch (e) {
    console.log(e);
  }
};

const removeContact = async contactId => {
  try {
    const contactsList = await fsPromises.readFile(contactsPath, 'utf-8');
    const filteredContactsList = JSON.parse(contactsList).filter(
      contact => contact.id !== contactId,
    );

    await fsPromises.writeFile(
      contactsPath,
      JSON.stringify(filteredContactsList),
    );

    return console.log(`Contact with id ${contactId} was successfully deleted`);
  } catch (e) {
    console.log(e);
  }
};

const addContact = async (name, email, phone) => {
  try {
    const contactsList = await fsPromises.readFile(contactsPath, 'utf-8');

    const newContact = {
      name,
      email,
      phone,
      id: Math.floor(Math.random() * 10000),
    };

    const contactsListWithNewContact = [
      ...JSON.parse(contactsList),
      newContact,
    ];

    await fsPromises.writeFile(
      contactsPath,
      JSON.stringify(contactsListWithNewContact),
    );

    return console.log('Contact was successfully added');
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
