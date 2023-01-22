# Contact Manager - Single Page Application

## Description
This is a simple, single-page application to help manage your contacts (name, email, and phone number, with ability to add tags and filter by tags).

The application uses a Model View Controller (MVC) artcitectural pattern.

## Code Implementation
* The `Model` is in charge of storing data, fetching data (i.e. contacts) (GET), creating contacts (POST), updating contacts (PUT), and deleting contacts (DELETE) on the server.
* The `View` is in charge of displaying a representation of the data (i.e. contacts) and binding event listeners on DOM elements.
* The `Model` never directly interacts with the `View` or vice versa. Instead, it is the `Controller` which connects them.
* The `Controller` connects the `Model` and the `View`. The `Controller` is the mediator which handles the events that are bound in the `View` by calling on methods found in the `Model`. Thus, we are able to control the flow of data from the `View` to the `Model` and vice-versa, using the `Controller`.

## Installation
* Ensure that you have `node` (version > 8.0) and `npm` installed on your computer.
* Navigate to the applcation directory in the terminal.
* Run `npm install` from the command line.
* Rn `npm start` from the command line.
* Open browser to `http://localhost:3000`

## Tutorial
* Use the `Add New Contact` button to create a new contact.
* Use the `Search` bar to filter your contacts to match the letters your type.
* Edit a contact by clicking on the `Edit` button for the contact you wish to edit.
* Delete a contact by clicking on `Delete` button for the contact you wish to delete.
* Click on a tags of a contact to filter contacts by that tag.
* When creating or editing a contact, you can add and/or remove tags in three ways:
  1. Type it in manually in the search bar, using a single comma `,` *between* tags (Note: you must adhere to the following format: `"tag1,tag2,tag3"`)
  1. Toggle (add or remove) the tag by clicking on the tags in bubbles.
  1. Add a custom tag by typing in the text bar and clicking `Add Tag`.
