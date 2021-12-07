const app = require("./app");
const http = require("http").createServer(app);
const socket = require("./socket");

socket(http);
const port = 3000;

http.listen(port, () => {
  console.log("server is running port: ", port);
});

module.exports = http;
