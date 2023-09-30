import { Schema } from "mongoose";
import { genderType, horoscopeType, zodiacType } from "../userProfile/userProfile.enum";

export const UserProfileModel = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
    },
    image: {
        type: String,
    },
    displayName: {
        type: String,
    },
    gender: {
        type: String,
        enum: genderType,
    },
    birthDate: {
        type: Date,
    },
    horoscope: {
        type: String,
        enum: horoscopeType,
    },
    zodiac: {
        type: String,
        enum: zodiacType,
    },
    height: {
        type: Number,
    },
    weight: {
        type: Number,
    },
    interest: {
        type: Array,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
});