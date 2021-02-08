// Core roles module. Links to all other modules
const reactRoles = require('./react-roles');
const newMember = require('./new-member');

module.exports = client => {
    console.log('Loading Role Module')
    reactRoles(client);
    newMember(client);
}