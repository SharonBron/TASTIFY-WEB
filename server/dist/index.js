"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const post_routes_1 = __importDefault(require("./routes/post.routes"));
const comment_routes_1 = __importDefault(require("./routes/comment.routes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("./swagger"));
// Load environment variables
if (process.env.NODE_ENV === 'test') {
    dotenv_1.default.config({ path: '.env_test' });
}
else {
    dotenv_1.default.config();
}
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.DOMAIN_BASE || 'http://localhost:3000',
    credentials: true
}));
app.use(express_1.default.json());
// API Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/posts', post_routes_1.default);
app.use('/api/comments', comment_routes_1.default);
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
// MongoDB connection
mongoose_1.default.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));
// Static React app serving (only in production and not during tests)
if (process.env.NODE_ENV === 'production' && process.env.TEST !== 'true') {
    const buildPath = path_1.default.join(__dirname, '../../client/build');
    app.use(express_1.default.static(buildPath));
    app.get('*', (req, res) => {
        res.sendFile(path_1.default.join(buildPath, 'index.html'));
    });
    const options = {
        key: fs_1.default.readFileSync('./client-key.pem'),
        cert: fs_1.default.readFileSync('./client-cert.pem'),
    };
    const port = process.env.HTTPS_PORT || 443;
    https_1.default.createServer(options, app).listen(port, () => {
        console.log(`🚀 HTTPS server running on port ${port}`);
    });
}
else if (process.env.NODE_ENV !== 'test') {
    const port = process.env.PORT || 3000;
    http_1.default.createServer(app).listen(port, () => {
        console.log(`🚀 HTTP server running on port ${port}`);
    });
}
exports.default = app;
//# sourceMappingURL=index.js.map