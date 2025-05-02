import validator from "validator";
export const validatorcheck = (data) => {
  const mandatoryFields = ["firstname", "email", "password"];
  const isAllowedFields = mandatoryFields.every((field) => field in data);
  if (!isAllowedFields) {
    return { error: "All fields are required" };
  }
  const { firstname, email, password } = data;
  if (!validator.isEmail(email)) {
    return { error: "Invalid email format" };
  }
  if (!validator.isStrongPassword(password)) {
    return {
      error:
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    };
  }
  if (firstname.length < 3 || firstname.length > 20) {
    return { error: "Firstname must be between 3 and 20 characters" };
  }
};
