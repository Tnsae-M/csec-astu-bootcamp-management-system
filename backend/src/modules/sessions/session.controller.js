import { createSession } from "./session.service.js";

export const createSessionController = async (req, res) => {
    const session = await createSession(req.body);
    res.status(201).json(session);
};