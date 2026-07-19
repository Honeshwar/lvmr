const sendJson = (res, statusCode, body) => {
  res.status(statusCode).json(body);
};

async function handler(req, res) {
  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return sendJson(res, 500, {
      error: "Server misconfiguration: ADMIN_PASSWORD is not set.",
    });
  }

  let payload = req.body;
  if (!payload || typeof payload !== "object") {
    return sendJson(res, 400, { error: "Invalid JSON payload." });
  }

  const provided = payload.password;
  if (!provided || provided !== adminPassword) {
    return sendJson(res, 401, { error: "Invalid password" });
  }

  return sendJson(res, 200, { message: "Authenticated" });
}

module.exports = handler;
