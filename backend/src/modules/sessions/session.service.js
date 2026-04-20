import Session from "./session.model.js";

export const createSession = async (data) => {
    return await Session.create(data);
};