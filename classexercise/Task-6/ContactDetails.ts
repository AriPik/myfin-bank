/*
Week-2 Day-1: Contact Manager
Name: Arijit Das
Description:
This program implements a basic Contact Manager using TypeScript.
It supports add, view, modify, and delete operations with proper error handling.
*/

interface Contact{
    id: number;
    name: string;
    email: string;
    phone: string;
}
class ContactManager {
    private contacts: Contact[] = [];

    // Add Contact
    addContact(contact: Contact): void {
        const exists = this.contacts.find(c => c.id === contact.id);

        if (exists) {
            console.log(`❌ Contact with ID ${contact.id} already exists.`);
            return;
        }

        this.contacts.push(contact);
        console.log(`✅ Contact "${contact.name}" added successfully.`);
    }

    // View Contacts
    viewContacts(): Contact[] {
        if (this.contacts.length === 0) {
            console.log("⚠ No contacts available.");
        }
        return this.contacts;
    }

    // Modify Contact
    modifyContact(id: number, updatedContact: Partial<Contact>): void {
        const contact = this.contacts.find(c => c.id === id);

        if (!contact) {
            console.log(`❌ Contact with ID ${id} does not exist.`);
            return;
        }

        Object.assign(contact, updatedContact);
        console.log(`✅ Contact with ID ${id} updated successfully.`);
    }

    // Delete Contact
    deleteContact(id: number): void {
        const index = this.contacts.findIndex(c => c.id === id);

        if (index === -1) {
            console.log(`❌ Contact with ID ${id} does not exist.`);
            return;
        }

        this.contacts.splice(index, 1);
        console.log(`✅ Contact with ID ${id} deleted successfully.`);
    }
}

const manager = new ContactManager();

// Add Contacts
manager.addContact({
    id: 1,
    name: "Arijit",
    email: "arijit@email.com",
    phone: "+919876543210"
});

manager.addContact({
    id: 2,
    name: "Rahul",
    email: "rahul@email.com",
    phone: "+919812345678"
});
// Testing if duplicate contact addision is restricted or not
manager.addContact({
    id: 1,
    name: "Duplicate",
    email: "dup@email.com",
    phone: "0000000000"
});


// View Contacts
console.log("All Contacts:", manager.viewContacts());

// Modify Contact
manager.modifyContact(1, { email: "newarijit@email.com" });

// Try modifying non-existing contact
manager.modifyContact(5, { name: "Test" });

// Delete Contact
manager.deleteContact(2);

// Try deleting non-existing contact
manager.deleteContact(10);

// Final List
console.log("Final Contacts:", manager.viewContacts());
