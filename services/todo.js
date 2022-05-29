const _ = require('lodash');
const uuid = require('uuid').v4;

const { schemaValidator } = require("../utility/schemaValidator");
const { todoSchema, idSchema } = require('../middlewares/todoValidation');
const { errorResponse } = require("../utility/errorHandler");
const TodoSchema = require("../db/models/todoSchema");
const { Internal } = require('../errors/Errors');
const { logger } = require("../utility/winstonLogger");

class TodoService {
    constructor() { }

    async createTodo(req, res) {
        try {

             //logging req body
             logger.info(`***** TodoService createTodo method ***** - ${JSON.stringify(req.body)}`);

            // validate req body
            let validation = await schemaValidator(req.body, todoSchema);
            if (!validation.status) {
                return errorResponse(res, validation.error, 400);
            }

            //Initialization
            let userId = req.userData.userId;
            let title = req.body.title;
            let details = req.body.details;
            let dueDate = req.body.dueDate;

            const todoDetails = new TodoSchema({
                _id: uuid(),
                userId,
                title,
                details,
                dueDate
            });

            const result = await todoDetails.save();

            return res.status(200).json({
                message: "Successfully created todo detail !!",
                data: {
                    _id: result._id
                },
            });

        } catch (err) {
            logger.error("***** Error in TodoService createTodo method *****", err);
            return errorResponse(res, Internal.message, 500);
        }
    }

    async getDetails(req, res) {
        try {

            //logging req body
            logger.info(`***** TodoService getDetails method ***** - ${JSON.stringify(req.query)}`);

            // Initialization
            let userId = req.userData.userId;
            let todoId = req.query.todoId;
            let limit = req.query.limit ? parseInt(req.query.limit) : 10;

            let query = {
                ...(userId && { userId: userId }),
                ...(todoId && { _id: todoId })
            };

            let todoDetails = await TodoSchema.find(query, { __v: 0, userId: 0 })
                .sort({ _id: 1 })
                .limit(limit);

            if (todoDetails.length === 0 ) {
                return errorResponse(res, "No details found for this user", 404);
            } else {
                return res.status(200).json({
                    count: todoDetails.length,
                    data: todoDetails
                });
            }

        } catch (err) {
            logger.error("***** Error in TodoService getDetails method *****", err);
            return errorResponse(res, NotAllowed.message, 405, { error: errors });
        }
    }

    async updateDetailsByID(req, res) {
        try {

            //logging req body
            logger.info(`***** TodoService updateDetailsByID method ***** - req.body: ${JSON.stringify(req.body)},  req.params: ${JSON.stringify(req.params)}`);

            // validate req params with schema
            let validation = await schemaValidator(req.params, idSchema);
            if (!validation.status) {
                return errorResponse(res, validation.error, 400);
            }

            let userId = req.userData.userId;
            let todoId = req.params.id;

            let title = req.body.title;
            let details = req.body.details;
            let dueDate = req.body.dueDate;

            let updatedReq = {
                title: title,
                details: details,
                dueDate: dueDate
            }

            if (todoId) {
                let doc = await TodoSchema.findOneAndUpdate({
                    userId: userId,
                    _id: todoId
                }, updatedReq);
                if (doc) {
                    return res.status(200).json({
                        message: "Detail updated successfully !!",
                        data: {
                            _id: doc._id
                        }
                    });
                } else {
                    return errorResponse(res, "Todo id is not valid", 404);
                }
            }

        } catch (err) {
            logger.error("***** Error in TodoService updateDetailsByID method *****", err);
            return errorResponse(res, NotAllowed.message, 405, { error: err });
        }
    }

    async deletebyID(req, res) {
        try {

            //logging req body
            logger.info(`***** TodoService deletebyID method ***** - ${JSON.stringify(req.params)}`);

            // validate req params with schema
            let validation = await schemaValidator(req.params, idSchema);
            if (!validation.status) {
                return errorResponse(res, validation.error, 400);
            }

            let userId = req.userData.userId;
            let todoId = req.params.id;

            if (todoId) {
                let doc = await TodoSchema.deleteOne({
                    userId: userId,
                    _id: todoId
                });
                if (doc) {
                    return res.status(200).json({
                        message: "Detail deleted successfully !!",
                        data: {
                            _id: todoId
                        }
                    });
                } else {
                    return errorResponse(res, "Todo id is not valid", 404);
                }
            }

        } catch (err) {
            logger.error("***** Error in TodoService deletebyID method *****", err);
            return errorResponse(res, NotAllowed.message, 405, { error: err });
        }
    }

}

module.exports = TodoService;