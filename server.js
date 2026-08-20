const crypto = require("crypto");
const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const app = express();
const port = Number(process.env.PORT) || 3000;
const ownerPassword = process.env.OWNER_PASSWORD || "kimathi254";
const sessionSecret = process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex");
const rootDir = __dirname;
const dataDir = path.join(rootDir, "data");
const uploadDir = path.join(rootDir, "uploads");
const contentFile = path.join(dataDir, "content.json");

fs.mkdirSync(dataDir, { recursive: true });
fs.mkdirSync(uploadDir, { recursive: true });

const defaultContent = {
  mainText: "",
  littleSparks: "",
  todaysFeeling: "",
  nextSmallThing: "",
  heroImage: "",
  publishedAt: null
};

function readContent() {
  try {
    return { ...defaultContent, ...JSON.parse(fs.readFileSync(contentFile, "utf8")) };
  } catch {
    return { ...defaultContent };
  }
}

function writeContent(content) {
  const temporaryFile = `${contentFile}.tmp`;
  fs.writeFileSync(temporaryFile, JSON.stringify(content, null, 2));
  fs.renameSync(temporaryFile, contentFile);
}

function sign(value) {
  return crypto.createHmac("sha256", sessionSecret).update(value).digest("hex");
}

function createSession() {
  const payload = Buffer.from(JSON.stringify({
    issuedAt: Date.now(),
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7
  })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function hasValidSession(request) {
  const token = request.headers.cookie?.match(/kimathi_session=([^;]+)/)?.[1];
  if (!token) return false;

  const [payload, signature] = token.split(".");
  const expectedSignature = payload ? sign(payload) : "";
  if (!payload || !signature || signature.length !== expectedSignature.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return false;
  }

  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")).expiresAt > Date.now();
  } catch {
    return false;
  }
}

function requireOwner(request, response, next) {
  if (!hasValidSession(request)) {
    return response.status(401).json({ error: "Owner login required" });
  }
  next();
}

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (_request, file, callback) => {
      const extension = path.extname(file.originalname).toLowerCase();
      callback(null, `hero-${Date.now()}${extension}`);
    }
  }),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_request, file, callback) => {
    callback(null, file.mimetype.startsWith("image/"));
  }
});

app.use(express.json({ limit: "100kb" }));
app.use(express.static(rootDir));
app.use("/uploads", express.static(uploadDir));

app.get("/api/content", (_request, response) => {
  response.json(readContent());
});

app.get("/api/session", (request, response) => {
  response.json({ owner: hasValidSession(request) });
});

app.post("/api/login", (request, response) => {
  if (!ownerPassword || typeof request.body.password !== "string") {
    return response.status(503).json({ error: "Owner login is not configured" });
  }

  const supplied = Buffer.from(request.body.password);
  const expected = Buffer.from(ownerPassword);
  const matches = supplied.length === expected.length && crypto.timingSafeEqual(supplied, expected);
  if (!matches) return response.status(401).json({ error: "Incorrect owner password" });

  response.setHeader("Set-Cookie", `kimathi_session=${createSession()}; HttpOnly; SameSite=Strict; Path=/; Max-Age=604800${process.env.NODE_ENV === "production" ? "; Secure" : ""}`);
  response.json({ owner: true });
});

app.post("/api/logout", (_request, response) => {
  response.setHeader("Set-Cookie", "kimathi_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0");
  response.json({ owner: false });
});

app.post("/api/content", requireOwner, upload.single("heroImage"), (request, response) => {
  const current = readContent();
  const nextContent = {
    mainText: String(request.body.mainText || "").slice(0, 20000),
    littleSparks: String(request.body.littleSparks || "").slice(0, 2000),
    todaysFeeling: String(request.body.todaysFeeling || "").slice(0, 2000),
    nextSmallThing: String(request.body.nextSmallThing || "").slice(0, 2000),
    heroImage: request.file ? `/uploads/${request.file.filename}` : current.heroImage,
    publishedAt: new Date().toISOString()
  };

  writeContent(nextContent);
  response.json(nextContent);
});

app.listen(port, () => {
  console.log(`Kimathi Space is running at http://localhost:${port}`);
});
