const yup = require("yup");

var todoSchema = yup.object({
    title: yup
        .string()
        .required("password is required!"),
    details: yup
        .string()
        .required("phoneNumber is required!")
});

var idSchema = yup.object({
    id: yup
        .string()
        .required("id is required !")
});

module.exports = {
    todoSchema,
    idSchema
}