const MongoClient = require("mongodb").MongoClient;

async function connectDb(connectionString) {
  let conn;
  conn = await MongoClient.connect(connectionString);
  return conn.db("casita");
}

module.exports = { connectDb };
