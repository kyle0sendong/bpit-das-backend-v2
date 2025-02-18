require("module-alias/register.js");
const app = require("@app");
const dotenv = require("dotenv").config();

console.log("1st commit")
const port = process.env.PORT || 55001;

app.listen(port, () => {
    console.log(`Server running at ${port}`);
});