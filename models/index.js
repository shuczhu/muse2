const User = require('./User');
const AI = require('./AI');
const Response = require('./Response');

User.hasMany(AI, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

AI.belongsTo(User, {
  foreignKey: 'user_id'
});

User.hasMany(Response, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

Response.belongsTo(User, {
  foreignKey: "user_id",
});

module.exports = { User, AI, Response };
