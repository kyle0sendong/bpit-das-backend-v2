const dotenv = require("dotenv").config();

const app = require("./app.js");
const config = require("./config.js");

const port = config.PORT || 50001;

app.listen(port, () => {
    console.log(`Server running at ${port}`);
});