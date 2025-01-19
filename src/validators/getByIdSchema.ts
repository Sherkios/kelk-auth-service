import { checkSchema } from "express-validator";

const getByIdSchema = checkSchema({
  id: {
    trim: true,
    notEmpty: {
      errorMessage: "Id не должен быть пустым",
    },
    isNumeric: {
      errorMessage: "id должен быть числом",
    },
  },
});

export default getByIdSchema;
