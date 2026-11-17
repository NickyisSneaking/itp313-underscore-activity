import { AppError } from "../utils/errors.js";
import { safeBack } from "../utils/http.js";

export const notFound = (req, res) => {
  res.status(404).render("error", {
    title: "Page not found",
    code: 404,
    heading: "We couldn't find that page",
    message: "The link may be old or mistyped.",
  });
};

// A failed form (AppError) → go back with a red message. Anything unexpected → friendly 500 page.
export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  if (err instanceof AppError) {
    if (req.method !== "GET") {
      req.flash("error_msg", err.message);
      return res.redirect(safeBack(req, "/dashboard"));
    }
    return res.status(err.status).render("error", {
      title: "Something's not right",
      code: err.status,
      heading: err.status === 404 ? "We couldn't find that" : "Something's not right",
      message: err.message,
    });
  }

  console.error(err);
  res.status(500).render("error", {
    title: "Something went wrong",
    code: 500,
    heading: "Something went wrong on our side",
    message: "Please try again. If it keeps happening, tell your administrator.",
  });
};
