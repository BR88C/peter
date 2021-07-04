"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Guild = void 0;
const mongoose_1 = require("mongoose");
const GuildSchema = new mongoose_1.Schema({
    id: String,
    premium: Boolean,
    DJMode: Number,
});
exports.Guild = mongoose_1.model(`Guild`, GuildSchema);
