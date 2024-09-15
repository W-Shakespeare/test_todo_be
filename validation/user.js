import { body } from "express-validator";
const userValidationRules = [
  body("username")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  body("password")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long"),
  body("email").isEmail().withMessage("Must be a valid email address"),
];
export default userValidationRules;
