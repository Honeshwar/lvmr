const FILE_PATH = "agent/calculator-prices.json";

const sendJson = (res, statusCode, body) => {
  res.status(statusCode).json(body);
};

async function handler(req, res) {
  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "dev";

  if (!token || !repo) {
    return sendJson(res, 500, {
      error:
        "Missing environment variables. Set GITHUB_TOKEN and GITHUB_REPO in Vercel settings.",
    });
  }

  let payload = req.body;
  if (typeof payload === "string") {
    try {
      payload = JSON.parse(payload);
    } catch (error) {
      return sendJson(res, 400, { error: "Invalid JSON payload." });
    }
  }

  const providedPassword = payload && payload.adminPassword;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return sendJson(res, 500, {
      error: "Server misconfiguration: ADMIN_PASSWORD is not set.",
    });
  }
  if (!providedPassword || providedPassword !== adminPassword) {
    return sendJson(res, 401, { error: "Invalid admin password." });
  }

  const prices = payload && payload.prices;
  if (!prices || typeof prices !== "object") {
    return sendJson(res, 400, {
      error: "Request must include a prices object.",
    });
  }

  const commitMessage = payload.commitMessage || "Update calculator prices";

  const [owner, repository] = repo.split("/");
  if (!owner || !repository) {
    return sendJson(res, 500, {
      error: "GITHUB_REPO must be in owner/repo format.",
    });
  }

  const githubUrl = `https://api.github.com/repos/${owner}/${repository}/contents/${FILE_PATH}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/vnd.github+json",
    "User-Agent": "vercel-save-prices-function",
  };

  const content = Buffer.from(JSON.stringify({ prices }, null, 2)).toString(
    "base64",
  );

  try {
    const shaResponse = await fetch(
      `${githubUrl}?ref=${encodeURIComponent(branch)}`,
      { headers },
    );
    if (!shaResponse.ok) {
      const errorText = await shaResponse.text();
      return sendJson(shaResponse.status, {
        error:
          "Unable to read existing file. Verify the branch and repository settings.",
        details: errorText,
      });
    }

    const shaData = await shaResponse.json();
    const sha = shaData.sha;

    const updateResponse = await fetch(githubUrl, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: commitMessage,
        content,
        branch,
        sha,
      }),
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      return sendJson(updateResponse.status, {
        error: "Failed to commit the updated pricing file.",
        details: errorText,
      });
    }

    const result = await updateResponse.json();
    const commitSha = result.commit && result.commit.sha;
    return sendJson(res, 200, {
      message: "Pricing config committed successfully.",
      file: result.content && result.content.path,
      commit: commitSha,
      commitUrl: commitSha
        ? `https://github.com/${owner}/${repository}/commit/${commitSha}`
        : undefined,
    });
  } catch (error) {
    return sendJson(res, 500, {
      error: "Unexpected error saving prices.",
      details: error.message,
    });
  }
}

module.exports = handler;
