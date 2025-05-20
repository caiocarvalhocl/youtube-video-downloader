import { Router } from "express";
import { actionsController } from "../controllers/ActionController";

const router = Router();

router.post("/api/download", (req, res) => {
  console.log("passou na rota");
  actionsController.download(req, res);
});

router.post("/api/title", (req, res) => {
  actionsController.getTitle(req, res);
});

export { router };
