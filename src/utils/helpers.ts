import { ObjectSchema } from "joi";

export const validateArgs = (validationSchema: ObjectSchema, payload) => {
  const validationResult = validationSchema.validate(payload, {
    abortEarly: false,
  });
  if (validationResult.error) {
    throw new Error(validationResult.error.message);
  }
};
