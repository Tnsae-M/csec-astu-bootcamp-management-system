const buildError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};
export const validateCreateDivision = (req, res, next) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return next(buildError("Name is required"));
  }
  req.body.name = name.trim();
  next();
};
export const validateUpdateDivision = (req, res, next) => {
  const allowedFields = ["name", "description"];
  const fields = Object.keys(req.body || {});
  if (!fields.length) {
    return next(
      buildError("At least one field (name or description) is required"),
    );
  }
  const invalid = fields.some((f) => !allowedFields.includes(f));
  if (invalid) {
    return next(buildError("Only name and description can be updated"));
  }
  if (req.body.name) {
    req.body.name = req.body.name.trim();
    if (!req.body.name) {
      return next(buildError("Name cannot be empty"));
    }
  }
  next();
};
//division list query validation is not necessary since we have max 6 divisions currently.
// export const validateDivisionListQuery=(req, res, next)=>{

// }
