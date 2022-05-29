const winston = require('winston');

module.exports.logger = winston.createLogger({
    level: 'info',
    transports: [   
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'todo.log' })
    ]
});

