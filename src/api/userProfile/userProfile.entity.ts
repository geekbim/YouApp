import * as mongoose from "mongoose";
import { horoscopeType, zodiacType } from "./userProfile.enum";

export interface UserProfile {
    id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId
    image: string;
    displayName: string;
    gender: string;
    birthDate: Date;
    horoscope: horoscopeType;
    zodiac: zodiacType;
    height: number;
    weight: number;
    interest: string[];
}