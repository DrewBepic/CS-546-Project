import express from "express";

const configRoutesFunction = (app) => {
    const router = express.Router();
    router.get("/example", (req, res) => {
        res.json({ message: "This is an example route" });
    });

    app.use("/", router);
};

export default configRoutesFunction;