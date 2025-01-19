import { checkSchema } from "express-validator";

const resetPasswordSchema = checkSchema({
  password: {
    trim: true,
    notEmpty: {
      errorMessage: "Пароль не должен быть пустым",
    },
    isLength: {
      options: {
        min: 3,
      },
      errorMessage: "Пароль не должен быть меньше 3 символов",
    },
    escape: true,
  },
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
    in: ["query"],
  },
  token: {
    trim: true,
    notEmpty: {
      errorMessage: "Токен не должен быть пустым",
    },
    escape: true,
    in: ["query"],
  },
});

export default resetPasswordSchema;
