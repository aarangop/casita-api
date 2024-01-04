const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { connectDb } = require("./db/conn");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const OpenApiValidator = require("express-openapi-validator");
const yaml = require("yamljs");
const swaggerFile = yaml.load("./api.yaml");

// Load env variables
require("dotenv").config();

// Ensure Auth0 environment variables are present for authentication!
if (!process.env.ISSUER_BASE_URL || !process.env.AUDIENCE) {
  throw "Make sure you have ISSUER_BASE_URL, and AUDIENCE in your .env file";
}

// Allow CORS
const corsOptions = {
  origin: "http://localhost:3000",
};

// Plug routers
let indexRouter = require("./routes/index");
let usersRouter = require("./routes/users");
let householdsRouter = require("./routes/households");
const { connect } = require("mongoose");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Add middleware to connect to the database if not done already
// and attach the database to the request object.
const connectionString = process.env.MONGODB_CONNSTR;
let db;
app.use(async (req, res, next) => {
  if (!db) {
    try {
      db = await connectDb(connectionString);
      console.log("Connected to MongoDB");
    } catch (e) {
      console.error("Error connecting to MongoDB");
    }
  }
  req.db = db;
  next();
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors(corsOptions));

// Serve OpenAPI spec
const spec = path.join(__dirname, "api.yaml");
app.use("/docs", express.static(spec));

// Set up openapi
app.use(
  OpenApiValidator.middleware({
    apiSpec: "./api.yaml",
    validateResponses: true,
  }),
);

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/households", householdsRouter);
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
