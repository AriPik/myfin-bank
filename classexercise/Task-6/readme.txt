Contact Manager Application
Week-2 Day-1 TypeScript Assignment

Name: Arijit
Technology Used: TypeScript
Target: ES2015

----------------------------------------
Project Description
----------------------------------------
This project implements a basic Contact Manager application using TypeScript.

The application allows users to:
1. Add new contacts
2. View all contacts
3. Modify existing contacts
4. Delete contacts
5. Receive appropriate success and error messages

----------------------------------------
Features Implemented
----------------------------------------
• Interface 'Contact' defining contact structure
• Class 'ContactManager' managing contact list
• addContact() with duplicate ID check
• viewContacts() to return contact list
• modifyContact() with partial update support
• deleteContact() with existence check
• Proper console-based error and confirmation messages
• Testing script included at bottom of file

----------------------------------------
How to Run the Program
----------------------------------------
1. Compile TypeScript file:
   tsc ContactManager.ts --target es2015

2. Run generated JavaScript file:
   node ContactManager.js

----------------------------------------
Expected Output
----------------------------------------
Console output showing:
• Successful contact addition
• Error when modifying non-existing contact
• Error when deleting non-existing contact
• Final contact list after operations

----------------------------------------
Notes
----------------------------------------
• Phone numbers are stored as string for proper formatting support.
• Data is stored in memory using an array.
• This is a console-based implementation as per assignment instructions.
