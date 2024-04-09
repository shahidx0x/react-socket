var createError = require("http-errors");
module.exports.errorHandlers = {
  createErrorMiddleware: (req, res, next) => {
    next(createError(404));
  },
  handleErrorInDevelopment: (err, req, res) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
  },
};
