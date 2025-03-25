"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.login = exports.register = exports.googleLogin = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("../models/User"));
const jwt_1 = require("../config/jwt");
const google_auth_library_1 = require("google-auth-library");
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const googleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idToken } = req.body;
    try {
        const ticket = yield client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            res.status(400).json({ message: 'Invalid token' });
            return;
        }
        const { sub: googleId, email, name, picture } = payload;
        let user = yield User_1.default.findOne({ email });
        if (!user) {
            user = yield User_1.default.create({
                googleId,
                email,
                username: name,
                profileImage: picture,
                firstName: (name === null || name === void 0 ? void 0 : name.split(' ')[0]) || '',
                lastName: (name === null || name === void 0 ? void 0 : name.split(' ')[1]) || ''
            });
        }
        const accessToken = (0, jwt_1.generateAccessToken)(user._id.toString());
        const refreshToken = (0, jwt_1.generateRefreshToken)(user._id.toString());
        res.status(200).json({
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                profileImage: user.profileImage
            },
            accessToken,
            refreshToken
        });
    }
    catch (err) {
        console.error('❌ Google login error:', err);
        res.status(401).json({ message: 'Google authentication failed' });
    }
});
exports.googleLogin = googleLogin;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password, firstName, lastName } = req.body;
    try {
        const existing = yield User_1.default.findOne({ email });
        if (existing) {
            res.status(400).json({ msg: 'User already exists' });
            return;
        }
        const hashed = yield bcrypt_1.default.hash(password, 10);
        const user = yield User_1.default.create({ username, email, password: hashed, firstName, lastName });
        const accessToken = (0, jwt_1.generateAccessToken)(user._id.toString());
        const refreshToken = (0, jwt_1.generateRefreshToken)(user._id.toString());
        res.status(201).json({
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                profileImage: user.profileImage
            },
            accessToken,
            refreshToken
        });
    }
    catch (err) {
        console.error('❌ Error in register:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ message: 'Invalid email or password' });
            return;
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid email or password' });
            return;
        }
        const accessToken = (0, jwt_1.generateAccessToken)(user._id.toString());
        const refreshToken = (0, jwt_1.generateRefreshToken)(user._id.toString());
        res.status(200).json({
            message: 'Login successful',
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                profileImage: user.profileImage
            },
            accessToken,
            refreshToken
        });
    }
    catch (err) {
        console.error('❌ Login error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.login = login;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        res.status(401).json({ message: 'No refresh token provided' });
        return;
    }
    try {
        const userId = (0, jwt_1.verifyRefreshToken)(refreshToken);
        if (!userId) {
            res.status(403).json({ message: 'Invalid refresh token' });
            return;
        }
        const newAccessToken = (0, jwt_1.generateAccessToken)(userId);
        res.status(200).json({ accessToken: newAccessToken });
    }
    catch (err) {
        console.error('❌ Error verifying refresh token:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.refreshToken = refreshToken;
//# sourceMappingURL=auth.controller.js.map