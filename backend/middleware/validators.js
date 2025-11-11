import { body, validationResult, param } from "express-validator";

// ✅ Middleware to handle validation results
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// ✅ Register Validator
export const registerValidator = [
  body("email")
    .isEmail()
    .withMessage("A valid email address is required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  handleValidation,
];

// ✅ Login Validator
export const loginValidator = [
  body("email")
    .isEmail()
    .withMessage("A valid email address is required"),
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
  handleValidation,
];

// ✅ Optional param validator (if needed)
export const idParamValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid ID format"),
  handleValidation,
];
