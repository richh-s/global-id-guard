// src/types/express/index.d.ts
// Make sure this file is under src/types/express/index.d.ts
declare namespace Express {
    interface Request {
      user?: { userId: number; role: string }
      file?: Express.Multer.File
    }
  }
  