const sendJson = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return sendJson(405, { error: "Method not allowed" });
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return sendJson(500, {
      error: "Server misconfiguration: ADMIN_PASSWORD is not set.",
    });
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch (err) {
    return sendJson(400, { error: "Invalid JSON payload." });
  }

  const provided = payload && payload.password;
  if (!provided || provided !== adminPassword) {
    return sendJson(401, { error: "Invalid password" });
  }

  return sendJson(200, { message: "Authenticated" });
};
