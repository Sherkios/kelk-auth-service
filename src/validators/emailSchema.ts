import { checkSchema } from "express-validator";

const emailSchema = checkSchema({
  email: {
    trim: true,
    notEmpty: {
      errorMessage: "Email не должен быть пустым",
    },
    isEmail: {
      errorMessage: "Некорректный формат почты",
    },
    normalizeEmail: true,
    escape: true,
  },
});

export default emailSchema;
