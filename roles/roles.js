// Core roles module. Links to all other modules
const reactRoles = require('./reaction-roles/react-roles');
const welcomeRoles = require('./welcome-roles/welcome-roles');
const newMember = require('./welcome-roles/new-member');


module.exports = client => {
    console.log('Loading Role Module')
    reactRoles(client);
    newMember(client);
}