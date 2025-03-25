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
exports.updateUserProfile = exports.getUserProfile = exports.createUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
console.log(' createUser controller loaded');
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password, firstName, lastName } = req.body;
    console.log('📨 createUser called');
    console.log('Body:', req.body);
    try {
        const existing = yield User_1.default.findOne({ email });
        if (existing) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield User_1.default.create({
            username,
            email,
            password: hashedPassword,
            firstName,
            lastName
        });
        const count = yield User_1.default.countDocuments();
        console.log('👀 Total users:', count);
        res.status(201).json(user);
    }
    catch (err) {
        res.status(500).json({ message: 'Error creating user' });
    }
    console.log("createUser called");
});
exports.createUser = createUser;
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield User_1.default.findById(id).select('-password');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(user);
    }
    catch (err) {
        console.error('❌ Error getting user:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getUserProfile = getUserProfile;
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // ודא שהמשתמש המחובר עורך את עצמו
    if (id !== req.userId) {
        res.status(403).json({ message: 'You can only edit your own profile' });
        return;
    }
    const { firstName, lastName } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
    try {
        const updatedUser = yield User_1.default.findByIdAndUpdate(id, Object.assign(Object.assign(Object.assign({}, (firstName && { firstName })), (lastName && { lastName })), (imageUrl && { profileImage: imageUrl })), { new: true, runValidators: true }).select('-password');
        if (!updatedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(updatedUser);
    }
    catch (err) {
        console.error('❌ Error updating user:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateUserProfile = updateUserProfile;
//# sourceMappingURL=user.controller.js.map