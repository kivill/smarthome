db.createUser({
  user: "user",
  pwd: "2665640",
  roles: [
    {
      role: "readWrite",
      db: "smarthome",
    },
  ],
});
db = new Mongo().getDB("smarthome");
db.createCollection("users", { capped: false });
db.users.insert({
  roles: "admin",
  fullName: "Кирилл Поздеев",
  email: "kivillsaw146@gmail.com",
  password: "$2b$10$.J/a6C9cWHUUQDk7TZw3GOY/tgaKurHrf3ztmkXKv2lJ1oaqAfL1.",
});
