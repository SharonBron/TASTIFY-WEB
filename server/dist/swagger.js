"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Tastify API',
            version: '1.0.0',
            description: 'API for Tastify app – restaurant reviews'
        },
        servers: [
            {
                url: 'http://10.10.246.110',
                description: 'Local dev server'
            },
            {
                url: 'https://10.10.246.110',
                description: 'prod server'
            },
        ]
    },
    apis: ['./src/routes/*.ts'],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
exports.default = swaggerSpec;
//# sourceMappingURL=swagger.js.map