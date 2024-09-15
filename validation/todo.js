import { body } from "express-validator";
const todoValidationRules = [
  body("title")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long"),
  body("text")
    .isLength({ min: 1 })
    .withMessage("text must be at least 5 characters long"),
];
export default todoValidationRules;
