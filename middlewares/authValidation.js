const yup = require("yup");

var signUpSchema = yup.object({
    password: yup
        .string()
        .required("password is required!")
        .min(8, 'password should not be less than 8 words')
        .max(16, 'password should not be greater than 16 words'),
    phoneNumber: yup
        .string()
        .required("phoneNumber is required!")
        .matches(/^[0-9]+$/, "phoneNumber must be digits")
        .min(10, 'phoneNumber must be exactly 10 digit number')
        .max(10, 'phoneNumber must be exactly 10 digit number'),
    email: yup
        .string()
        .email("Must be a valid email")
        .required("email is required!"),
    name: yup
        .string()
        .required("name is required!")
        .matches(/^[a-zA-Z ]+$/, "name is not valid !"),
});

var loginSchema = yup.object({
    password: yup.string().required("password is required !"),
    username: yup.string().required("username or Phone number is required !")
});

module.exports = {
    signUpSchema,
    loginSchema
}