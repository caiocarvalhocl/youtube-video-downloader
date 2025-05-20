import { Router } from "express";
import { actionsController } from "../controllers/ActionController.js";
const router = Router();
router.post("/api/download", (req, res) => {
  actionsController.download(req, res);
});
router.post("/api/title", (req, res) => {
  actionsController.getTitle(req, res);
});
export { router };
