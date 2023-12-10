import { SessionOptions } from "iron-session";

export interface SessionData {
    id: string | null;
}

export const defaultSession: SessionData = {
    id: null,
};

export const sessionOptions: SessionOptions = {
    password: "complex_password_at_least_32_characters_long", // TODO: replace this with a generated secret
    cookieName: "sia-poc-session-cookie",
    cookieOptions: {
        // secure only works in `https` environments
        // if your localhost is not on `https`, then use: `secure: process.env.NODE_ENV === "production"`
        secure: true,
    },
};
