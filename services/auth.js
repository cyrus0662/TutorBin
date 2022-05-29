const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uuid = require('uuid').v4;
const saltRounds = 10;

const { errorResponse } = require("../utility/errorHandler");
const AuthSchema = require("../db/models/authSchema");
const { schemaValidator } = require("../utility/schemaValidator");
const { signUpSchema, loginSchema } = require('../middlewares/authValidation');
const { isValidEmail } = require("../utility/util");
const authConfig = require("../configs/auth.json");
const { Internal } = require('../errors/Errors');
const { logger } = require("../utility/winstonLogger");

class AuthService {
    constructor() { }

    async signUp(req, res) {
        try {

            //logging req body
            logger.info(`***** AuthService signUp method ***** - ${JSON.stringify(req.body)}`);

            // validate req body
            let validation = await schemaValidator(req.body, signUpSchema);
            if (!validation.status) {
                return errorResponse(res, validation.error, 400);
            }

            //Initialization
            let name = req.body.name;
            let email = req.body.email;
            let phoneNumber = req.body.phoneNumber;
            let password = req.body.password;

            // check if email and phone number is already registered
            let userExist = await AuthSchema.find({
                $or: [{ email: email }, { phoneNumber: phoneNumber }],
            });

            if (userExist.length > 0) {
                return errorResponse(res, "User is already registered !", 409);
            } else {
                // hash the password using salt
                const hashedPassword = await bcrypt.hash(password, saltRounds);

                const signUpDetails = new AuthSchema({
                    _id: uuid(),
                    name,
                    email,
                    phoneNumber,
                    password: hashedPassword
                });

                const result = await signUpDetails.save();

                return res.status(200).json({
                    message: "Successfully registered, Please login to continue !!",
                    data: {
                        _id: result._id,
                        name: result.name,
                        email: result.email,
                        phoneNumber: result.phoneNumber
                    },
                });
            }

        } catch (err) {
            logger.error("***** Error in AuthService signUp method *****", err);
            return errorResponse(res, Internal.message, 500);
        }
    }

    async login(req, res) {
        try {

            //logging req body
            logger.info(`***** AuthService login method ***** - ${JSON.stringify(req.body)}`);

            // validate req body
            let validation = await schemaValidator(req.body, loginSchema);
            if (!validation.status) {
                return errorResponse(res, validation.error, 400);
            }

            //Initialization
            let username = req.body.username;
            let password = req.body.password;
            let loginDetails;

            if (isValidEmail(username)) {
                loginDetails = await AuthSchema.findOne({
                    email: username
                });
            } else {
                loginDetails = await AuthSchema.findOne({
                    phoneNumber: username
                });
            }

            if (!loginDetails) {
                return errorResponse(
                    res,
                    "Your email or phone number is not registered !",
                    404
                );
            } else {
                //validate the password
                let isValidPassword = await bcrypt.compare(
                    password,
                    loginDetails.password
                );

                if (isValidPassword) {
                    const accessToken = jwt.sign(
                        {
                            userId: loginDetails["_id"],
                            name: loginDetails["name"],
                            email: loginDetails["email"],
                            phoneNumber: loginDetails["phoneNumber"]
                        },
                        authConfig.auth_access_secret,
                        {
                            expiresIn: "30m"
                        }
                    );

                    return res.status(200).json({
                        message: "Login Successfully !",
                        data: {
                            _id: loginDetails["_id"],
                            name: loginDetails["name"],
                            email: loginDetails["email"],
                            phoneNumber: loginDetails["phoneNumber"],
                            accessToken: accessToken
                        }
                    });
                } else {
                    return errorResponse(
                        res,
                        "Your password is incorrect !",
                        404
                    );
                }
            }

        } catch (err) {
            logger.error("***** Error in AuthService login method *****", err);
            return errorResponse(res, Internal.message, 500);
        }
    }
}

module.exports = AuthService;