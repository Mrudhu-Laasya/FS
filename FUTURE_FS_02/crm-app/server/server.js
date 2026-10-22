require("dotenv").config();

const connectDB = require("./src/config/db");
const app = require("./src/app");

connectDB();

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;