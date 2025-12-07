import * as Yup from "yup";
const guestFormSchema = Yup.object().shape({
    fullName: Yup.string()
    .required("Full Name is required")
    .min(3, "Full Name must be at least 3 characters")
    .max(50, "Full Name must not exceed 50 characters"),
  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9]{11}$/, "Phone number must be 11 digits"),
});

export default guestFormSchema;