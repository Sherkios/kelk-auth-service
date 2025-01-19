import { checkSchema } from "express-validator";

const registerSchema = checkSchema(
  {
    login: {
      trim: true,
      notEmpty: {
        errorMessage: "Логин не должен быть пустым",
      },
      isLength: {
        options: {
          min: 2,
        },
        errorMessage: "Логин не должен быть меньше 2 символов",
      },
      escape: true,
    },
    email: {
      trim: true,
      notEmpty: {
        errorMessage: "Почта не должна быть пустой",
      },
      isEmail: {
        errorMessage: "Некорректный формат почты",
      },
      normalizeEmail: true,
      escape: true,
    },
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
  },
  ["body"],
);

export default registerSchema;
