const routerUsers = require("express").Router();
const {
  findAllUsers,
  findUserById,
  updateUserData,
  updateUserAvatar
} = require("../controllers/users");

routerUsers.get("/", findAllUsers);
routerUsers.get("/:id", findUserById);
routerUsers.patch("/me", updateUserData);
routerUsers.patch("/me/avatar", updateUserAvatar);

module.exports = routerUsers;
