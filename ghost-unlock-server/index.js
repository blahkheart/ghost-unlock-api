require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());

const connectDB = require("./config/database");
const createMembershipRouter = require("./routes/create-membership");
const subscribeMembershipRouter = require("./routes/subscribe");
const unsubscribeMembershipRouter = require("./routes/unsubscribe");

connectDB();
app.use(createMembershipRouter);
app.use(subscribeMembershipRouter);
app.use(unsubscribeMembershipRouter);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
