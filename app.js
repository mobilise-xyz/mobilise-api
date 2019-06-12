var createError = require("http-errors");
var express = require("express");
var cors = require("cors");
var path = require("path");
var cookieParser = require("cookie-parser");
var boolParser = require("express-query-boolean");
var logger = require("morgan");
const passport = require("passport");

if (process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test") {
  require("dotenv").config();
}

require("./passport");

var app = express();

app.use(cors());

var indexRouter = require("./server/routes/index");
var usersRouter = require("./server/routes/users");
var shiftsRouter = require("./server/routes/shifts");
var rolesRouter = require("./server/routes/roles");
var authRouter = require("./server/routes/auth");
var volunteersRouter = require("./server/routes/volunteers");
var metricRouter = require("./server/routes/metric");
var statsRouter = require("./server/routes/stats");
var predictionRouter = require("./server/routes/prediction");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(boolParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/prediction", predictionRouter);
app.use("/stats", statsRouter);
app.use(
  "/shifts",
  passport.authenticate("jwt", { session: false }),
  shiftsRouter
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

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
