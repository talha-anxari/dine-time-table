import * as Yup from "yup";

const validationSchema = Yup.object().shape({
    username: Yup.string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must not exceed 20 characters")
    .matches(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and underscore"),

    email: Yup.string()
        .required("Email is required")
        .email("Invalid email")
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"),

    password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/\d/, "Password must contain at least one number")
        .matches(/[@$!%*?&]/, "Password must contain at least one special character")
        .max(20, "Password must not exceed 20 characters"),
});

export default validationSchema;