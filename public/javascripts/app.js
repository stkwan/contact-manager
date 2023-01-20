document.addEventListener('DOMContentLoaded', () => {

  class Model {
    constructor() {
      this.contacts = [];
      this.allTags = [];
    }

    async refreshContacts() {
      try {
        let response = await fetch('http://localhost:3000/api/contacts');
        this.contacts = await response.json();
        this.getAllTags();
        return this.contacts;
      } catch(error) {
        alert(error);
      }
    }

    getAllTags() {
      this.contacts.forEach(contact => {
        if (contact.tags) {
          contact.tags.split(',').forEach(tag => {
            if (this.allTags.indexOf(tag) === -1) {
              this.allTags.push(tag);
            }
          });
        }
      })
    }

    addContact(contact) {
      let req = new XMLHttpRequest();
      req.open('POST', 'http://localhost:3000/api/contacts/');
      req.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
      req.responseType = 'json';
      req.addEventListener('load', (e) => {
        if (req.status === 201) {
          alert(`Added ${req.response.full_name} to your contacts!`);
        } else {
          alert(req.statusText);
        }
      });
      req.send(JSON.stringify(contact));
    }

    updateContact(contact) {
      let req = new XMLHttpRequest();
      req.open('PUT', 'http://localhost:3000/api/contacts/' + contact.id);
      req.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
      req.responseType = 'json';
      req.addEventListener('load', (e) => {
        if (req.status === 201) {
          alert(`Successfully updated information for ${req.response.full_name}!`);
        } else {
          alert(req.statusText);
        }
      });
      req.send(JSON.stringify(contact));
    }

    deleteContact(id) {
      let req = new XMLHttpRequest();
      req.open('DELETE', 'http://localhost:3000/api/contacts/' + String(id));
      req.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
      req.addEventListener('load', (e) => {
        if (req.status === 204) {
          alert('Contact has been deleted.');
        } else {
          alert(req.statusText);
        }
      });
      req.send(JSON.stringify( {id} ));
    }
  }


  class View {
    constructor() {
      this.contactTemplateFunc = null;
      this.search = document.querySelector('#search');
      this.list = document.querySelector('#list');
      this.addButton = document.querySelector('#add');
      this.update_form = document.querySelector('#update_form');
      this.primary_inputs = document.querySelector('#primary_inputs');
      this.cancelButton = document.querySelector('#cancel');
      this.common_tags = document.querySelector('#common_tags');
      this.viewingId = null;

      this.compileTemplates();
    }

    hide(element) {
      element.classList.add('hide');
    }

    show(element) {
      element.classList.remove('hide');
    }

    compileTemplates() {
      let contactTemplate = document.querySelector('#contact_template')
      this.contactTemplateFunc = Handlebars.compile(contactTemplate.innerHTML);
    }

    hideMain() {
      Array.from(this.list.children).forEach(contact => this.hide(contact));
      this.hide(this.primary_inputs);
      this.hide(this.common_tags);
    }

    showMain() {
      this.hide(this.update_form);
      this.show(this.primary_inputs);
      this.hide(this.common_tags);
      Array.from(this.list.children).forEach(contact => this.show(contact));
      this.update_form.querySelector('h2').textContent = '';
      this.update_form.reset();
      this.search.value = '';
    }

    renderContacts(contacts) {
      Array.from(this.list.childNodes).forEach(node => node.remove());
      let json = JSON.stringify(contacts);
      contacts = JSON.parse(json);
      contacts.forEach(contact => {
        contact.phone_number = '(' + contact.phone_number.slice(0, 3) 
                             + ') ' + contact.phone_number.slice(3, 6) 
                             + '-' + contact.phone_number.slice(6);
        contact.tags = contact.tags.split(',');
        let html = this.contactTemplateFunc(contact);
        this.list.insertAdjacentHTML('beforeend', html);
      });
    }

    bindCancel() {
      this.cancelButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.showMain();
      });
    }

    bindSearch() {
      this.search.addEventListener('keyup', (e) => {
        let entry = this.search.value.toLowerCase();
        Array.from(this.list.children).forEach(contact => {
          let name = contact.dataset.name.toLowerCase();
          let regEx = new RegExp(entry);
          if (!regEx.test(name)) {
            this.hide(contact);
          } else {
            this.show(contact);
          }
        });
      });
    }

    bindAddButton() {
      this.addButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.hideMain();
        this.show(this.update_form);
        this.update_form.querySelector('h2').textContent = "Create Contact"
      });
    }

    bindAddContact(handler) {
      this.update_form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (this.update_form.querySelector('h2').textContent.includes('Create')) {
          let data = {};
          Array.from(this.update_form.elements).forEach(input => {
            if (input.type !== 'submit' && input.type !== 'button') {
              data[input.name] = input.value;
            }
          });
          handler(data);
          this.showMain();
      }
      });
    }
   
    bindEditButton() {
      this.list.addEventListener('click', (e) => {
        e.preventDefault();
        if (e.target.classList.contains('edit')) {
          this.hideMain();
          this.show(this.update_form);
          this.update_form.querySelector('h2').textContent = "Edit Contact"

          let parent = e.target.parentNode;
          this.viewingId = Number(e.target.parentNode.id);

          this.update_form.querySelector('.name').value = parent.dataset.name;
          this.update_form.querySelector('.email').value = parent.dataset.email;
          this.update_form.querySelector('.phone').value = parent.dataset.phone.replace(/\(|\)|-|\s+/g, '');
          this.update_form.querySelector('.tags').value = parent.dataset.tags;
        }
      });
    }

    bindEditContact(handler) {
      this.update_form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (this.update_form.querySelector('h2').textContent.includes('Edit')) {
          let data = {};
          Array.from(this.update_form.elements).forEach(input => {
            if (input.type !== 'submit' && input.type !== 'button') {
              data[input.name] = input.value;
            }
          });
          data.id = this.viewingId;
          handler(data);
          this.showMain();
        }
      });
    }

    bindDeleteContact(handler) {
      let id;
      this.list.addEventListener('click', (e) => {
        e.preventDefault();
        if (e.target.classList.contains('delete')) {
          let name = e.target.parentNode.dataset.name;
          id = Number(e.target.parentNode.id);
          let confirm = window.confirm(`Are you sure you want to permanantly delete contact ${name}?`);
          if (confirm) {
            handler(id);
          }
        }
      });
    }

    bindCommonTag() {
      this.list.addEventListener('click', (e) => {
        e.preventDefault();
        if (e.target.tagName === 'BUTTON' && e.target.classList.contains('tag')) {
          this.showOnlyContactsWith(e.target.textContent);
        }
      });
    }

    showOnlyContactsWith(tag) {
      this.hideMain();
      this.show(this.common_tags);
      this.common_tags.querySelector('#tagname').textContent = tag;
      Array.from(this.list.children).forEach(contact => {
        if (!contact.dataset.tags.split(',').includes(tag)) {
          this.hide(contact);
        } else {
          this.show(contact);
        }
      });
    }

    bindShowAll() {
      this.common_tags.querySelector('input').addEventListener('click', (e) => {
        e.preventDefault();
        this.showMain();
      });
    }

  }

  class Controller {
    constructor(model, view) {
      this.model = model;
      this.view = view;

      this.onContactsUpdated();

      this.view.bindSearch();
      this.view.bindCancel();

      this.view.bindAddButton();
      this.view.bindEditButton();

      this.view.bindAddContact(this.handleAddContact.bind(this));
      this.view.bindEditContact(this.handleEditContact.bind(this));

      this.view.bindDeleteContact(this.handleDeleteContact.bind(this));

      this.view.bindCommonTag();
      this.view.bindShowAll();
    }

    async onContactsUpdated() {
      let contacts = await this.model.refreshContacts();
      this.view.renderContacts(contacts);
    }

    handleAddContact(contact) {
      model.addContact(contact);
      this.onContactsUpdated();
    }

    handleEditContact(contact) {
      model.updateContact(contact);
      this.onContactsUpdated();
    }

    handleDeleteContact(id) {
      model.deleteContact(id);
      this.onContactsUpdated();
    }

  }

  let model = new Model();
  let view = new View();
  let controller = new Controller(model, view);
});