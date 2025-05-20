import { Request, Response } from "express";
import { spawn, spawnSync } from "child_process";
import dotenv from "dotenv";

dotenv.config();

class ActionsController {
  async download(req: Request, res: Response) {
    const { url, quality } = req.body;

    const userAgent = req.headers["user-agent"] || "Mozilla/5.0";

    if (!url || !url.startsWith("http")) {
      return res.status(400).json({ error: "Invalid URL" });
    }

    const selectedFormat = quality || "best";

    res.setHeader("Content-Type", "video/mp4");

    const process = spawn("./yt-dlp", [
      "-f",
      selectedFormat,
      "-o",
      "-",
      "--user-agent",
      userAgent,
      url,
    ]);

    process.stdout.pipe(res);

    process.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    console.log("LOG_stderrr");

    process.on("close", (code) => {
      if (code !== 0) {
        console.error(`yt-dlp exited with code ${code}`);
        if (!res.headersSent) res.status(500).end("Download failed");
      }
    });
  }

  getTitle(req: Request, res: Response) {
    const { url } = req.body;

    if (!url || !url.startsWith("http")) {
      return res.status(400).json({ error: "URL inválida" });
    }

    try {
      const titleResult = spawnSync("yt-dlp", ["--get-title", url]);

      if (titleResult.status !== 0) {
        const stderr = titleResult.stderr.toString();
        console.error("Erro ao buscar título:", stderr);
        return res.status(500).json({ error: "Erro ao obter o título" });
      }

      const title = titleResult.stdout.toString().trim();

      if (!title) {
        return res.status(500).json({ error: "Título não encontrado" });
      }

      res.json({ title });
    } catch (err) {
      console.error("Erro inesperado:", err);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}

export const actionsController = new ActionsController();
