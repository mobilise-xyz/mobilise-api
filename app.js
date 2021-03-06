let createError = require("http-errors");
let express = require("express");
let cors = require("cors");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");
let AWS = require('aws-sdk');
const passport = require("passport");

if (process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test") {
  require("dotenv").config();
}

require("./passport");

if (process.env.NODE_ENV !== "test") {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });
}

let app = express();

app.use(cors());
app.options('*', cors()) ;

let indexRouter = require("./server/routes/index");
let usersRouter = require("./server/routes/users");
let shiftsRouter = require("./server/routes/shifts");
let rolesRouter = require("./server/routes/roles");
let authRouter = require("./server/routes/auth");
let volunteersRouter = require("./server/routes/volunteers");
let metricRouter = require("./server/routes/metric");
let statsRouter = require("./server/routes/stats");
let calendarRouter = require("./server/routes/calendar");
let predictionRouter = require("./server/routes/prediction");
let fileRouter = require("./server/routes/files");
let linkRouter = require("./server/routes/links");

app.use(logger("dev"));
app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/prediction", predictionRouter);
app.use("/stats", statsRouter);
app.use("/calendar", calendarRouter);
app.use(
  "/shifts",
  passport.authenticate("jwt", { session: false }),
  shiftsRouter
);
app.use(
  "/links",
  passport.authenticate("jwt", { session: false }),
  linkRouter
);
app.use(
  "/roles",
  passport.authenticate("jwt", { session: false }),
  rolesRouter
);
app.use(
  "/users",
  passport.authenticate("jwt", { session: false }),
  usersRouter
);
app.use(
  "/volunteers",
  passport.authenticate("jwt", { session: false }),
  volunteersRouter
);
app.use(
  "/metric",
  passport.authenticate("jwt", { session: false }),
  metricRouter
);
app.use(
  "/files",
  passport.authenticate("jwt", {session: false}),
  fileRouter
);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
