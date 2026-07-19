function getValueAtPath(obj, path) {
  return path.reduce(
    (current, key) => (current && key in current ? current[key] : undefined),
    obj,
  );
}

function setValueAtPath(obj, path, value) {
  let current = obj;
  const len = path.length;
  path.forEach((key, index) => {
    if (index === len - 1) {
      current[key] = value;
      return;
    }
    if (
      !(key in current) ||
      typeof current[key] !== "object" ||
      current[key] === null
    ) {
      current[key] = {};
    }
    current = current[key];
  });
}

function friendlyKey(key) {
  const map = {
    shamshi: "Shamshi",
    mohal: "Mohal",
    single: "Single room",
    premium: "Premium room",
    sharing: "Sharing room",
    bunk: "Bunk bed room",
    standard: "Standard bed",
    queen: "Queen bed",
    double: "Double sharing",
    triple: "Triple sharing",
    monthly: "Monthly rate",
    weekly: "Weekly rate",
    "two-week": "2-week rate",
    2: "2 meals",
    3: "3 meals",
  };
  if (key in map) {
    return map[key];
  }
  return key.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatPath(path) {
  return path.map(friendlyKey).join(" › ");
}

function isRateObject(obj) {
  return (
    obj &&
    typeof obj === "object" &&
    !Array.isArray(obj) &&
    Object.values(obj).every((value) => typeof value === "number")
  );
}

function buildEditor(parent, data) {
  Object.entries(data).forEach(([locationKey, locationData]) => {
    const locationCard = document.createElement("section");
    locationCard.className = "location-card";
    if (locationKey !== "shamshi") {
      locationCard.classList.add("collapsed");
    }

    const locationToggle = document.createElement("button");
    locationToggle.type = "button";
    locationToggle.className = "location-toggle";
    locationToggle.textContent = friendlyKey(locationKey);
    locationToggle.addEventListener("click", () => {
      locationCard.classList.toggle("collapsed");
    });
    locationCard.appendChild(locationToggle);

    const locationBody = document.createElement("div");
    locationBody.className = "location-body";

    const locationDescription = document.createElement("p");
    locationDescription.textContent = `Update prices for ${friendlyKey(locationKey)}.`;
    locationBody.appendChild(locationDescription);

    if (locationKey === "mohal") {
      const locationNote = document.createElement("p");
      locationNote.style.fontStyle = "italic";
      locationNote.style.color = "#475569";
      locationNote.textContent =
        "Accommodation Type single and sharing are hidden for Mohal. Only bunk pricing is editable here.";
      locationBody.appendChild(locationNote);
    }

    Object.entries(locationData).forEach(([roomKey, roomData]) => {
      buildRoomCard(locationBody, roomKey, roomData, [locationKey]);
    });

    locationCard.appendChild(locationBody);
    parent.appendChild(locationCard);
  });
}

function isSubRoomGroup(obj) {
  return (
    obj &&
    typeof obj === "object" &&
    !Array.isArray(obj) &&
    Object.values(obj).every(
      (value) =>
        value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        Object.values(value).every(isRateObject),
    )
  );
}

function buildRoomCard(parent, roomKey, roomData, parentPath) {
  const roomCard = document.createElement("div");
  roomCard.className = "room-card";

  const roomHeading = document.createElement("h3");
  roomHeading.textContent = friendlyKey(roomKey);
  roomCard.appendChild(roomHeading);

  if (isRateObject(roomData)) {
    buildPlanRow(roomCard, roomData, [...parentPath, roomKey], roomKey);
  } else if (isSubRoomGroup(roomData)) {
    Object.entries(roomData).forEach(([subKey, subData]) => {
      const subCard = document.createElement("div");
      subCard.className = "room-card-sub";

      const subTitle = document.createElement("h4");
      subTitle.textContent = friendlyKey(subKey);
      subCard.appendChild(subTitle);

      Object.entries(subData).forEach(([planKey, planData]) => {
        buildPlanRow(
          subCard,
          planData,
          [...parentPath, roomKey, subKey, planKey],
          planKey,
        );
      });

      roomCard.appendChild(subCard);
    });
  } else {
    Object.entries(roomData).forEach(([planKey, planData]) => {
      buildPlanRow(
        roomCard,
        planData,
        [...parentPath, roomKey, planKey],
        planKey,
      );
    });
  }

  parent.appendChild(roomCard);
}

function buildPlanRow(parent, planData, path, planLabel) {
  const row = document.createElement("div");
  row.className = "plan-row";

  const title = document.createElement("div");
  title.className = "plan-title";
  title.textContent = friendlyKey(planLabel);
  row.appendChild(title);

  const inputs = document.createElement("div");
  inputs.className = "plan-inputs";

  Object.entries(planData).forEach(([personKey, value]) => {
    const field = document.createElement("label");
    field.className = "input-field";

    const label = document.createElement("span");
    label.textContent = friendlyKey(personKey);
    field.appendChild(label);

    const priceEntry = document.createElement("div");
    priceEntry.className = "price-entry";

    const prefix = document.createElement("span");
    prefix.className = "currency-prefix";
    prefix.textContent = "₹";
    priceEntry.appendChild(prefix);

    const input = document.createElement("input");
    input.type = "number";
    input.value = value;
    input.min = "0";
    input.dataset.path = JSON.stringify([...path, personKey]);
    input.dataset.type = "number";
    input.title = "Enter the price amount in rupees";
    priceEntry.appendChild(input);

    field.appendChild(priceEntry);
    inputs.appendChild(field);
  });

  row.appendChild(inputs);
  parent.appendChild(row);
}

function updateRawJson(data) {
  const rawJson = document.getElementById("rawJson");
  rawJson.value = JSON.stringify({ prices: data }, null, 2);
}

function collectFormData() {
  const inputs = Array.from(document.querySelectorAll("#editor input"));
  const result = {};

  inputs.forEach((input) => {
    const path = JSON.parse(input.dataset.path);
    const type = input.dataset.type;
    const rawValue = input.value;
    const parsed = type === "number" ? Number(rawValue) : rawValue;
    setValueAtPath(result, path, parsed);
  });

  return result;
}

function downloadJson(data) {
  const content = JSON.stringify({ prices: data }, null, 2);
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "calculator-prices.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function showStatus(message, success = true) {
  const status = document.getElementById("status");
  status.textContent = message;
  status.style.background = success ? "#ecfdf5" : "#fee2e2";
  status.style.color = success ? "#166534" : "#991b1b";
  status.classList.add("visible");
}

function clearStatus() {
  const status = document.getElementById("status");
  status.classList.remove("visible");
}

function showModal(title, message) {
  const overlay = document.getElementById("modalOverlay");
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalMessage").textContent = message;
  const linkContainer = document.getElementById("modalLinkContainer");
  linkContainer.innerHTML = "";

  overlay.hidden = false;
  overlay.style.display = "flex";
}

function closeModal() {
  const overlay = document.getElementById("modalOverlay");
  overlay.style.display = "none";
  overlay.hidden = true;
}

async function loadConfig() {
  const editor = document.getElementById("editor");
  editor.innerHTML = "";
  clearStatus();

  try {
    const response = await fetch("calculator-prices.json");
    if (!response.ok) {
      throw new Error(`Unable to load config (${response.status})`);
    }
    const json = await response.json();
    const data = json.prices || {};
    buildEditor(editor, data);
    updateRawJson(data);
    showStatus(
      "Loaded configuration successfully. Edit values and click Update prices to save changes.",
      true,
    );
  } catch (error) {
    console.error(error);
    editor.innerHTML =
      '<p style="color:#b91c1c;">Failed to load config. Make sure the file exists at <code>agent/calculator-prices.json</code> and the page is served over HTTP.</p>';
    showStatus(error.message, false);
  }
}

function setupActions() {
  const downloadBtn = document.getElementById("downloadBtn");
  const reloadBtn = document.getElementById("reloadBtn");
  const toggleJsonBtn = document.getElementById("toggleJsonBtn");
  const rawJson = document.getElementById("rawJson");

  downloadBtn.addEventListener("click", async () => {
    const data = collectFormData();
    try {
      const response = await fetch("/api/save-prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prices: data,
          commitMessage: "Update calculator prices from admin UI",
          adminPassword: window.__ADMIN_PASSWORD || null,
        }),
      });

      // Read raw text first to avoid JSON parse errors on empty/non-json responses
      const raw = await response.text();
      let result = null;
      try {
        result = raw ? JSON.parse(raw) : null;
      } catch (err) {
        // keep raw text for error reporting
        result = null;
      }

      if (!response.ok) {
        let hint = "";
        if (response.status === 405) {
          hint =
            " (Method not allowed). Is your deployment able to serve API functions?";
        } else if (response.status === 404) {
          hint =
            " (Not found). Are serverless functions deployed or is the endpoint path correct?";
        }
        const serverMsg =
          (result && (result.error || result.message)) ||
          raw ||
          response.statusText ||
          "Unknown error";
        throw new Error(`${serverMsg}${hint}`);
      }

      updateRawJson(data);
      showStatus(
        "Pricing config saved successfully. Please wait about 30 seconds for live changes.",
        true,
      );
      showModal(
        "Update complete",
        "Your pricing update has been saved. Please wait about 30 seconds for the changes to appear live.",
      );
    } catch (error) {
      console.error(error);
      showStatus(error.message, false);
      showModal("Failed to save", error.message);
    }
  });

  reloadBtn.addEventListener("click", () => {
    loadConfig();
  });

  toggleJsonBtn.addEventListener("click", () => {
    const isHidden = rawJson.hidden;
    rawJson.hidden = !isHidden;
    toggleJsonBtn.textContent = isHidden ? "Hide raw JSON" : "Show raw JSON";
  });

  document.getElementById("editor").addEventListener("input", () => {
    const data = collectFormData();
    updateRawJson(data);
  });

  const closeBtn = document.getElementById("closeModalBtn");
  closeBtn.addEventListener("click", closeModal);
  const modalOverlay = document.getElementById("modalOverlay");
  modalOverlay.addEventListener("click", (event) => {
    if (event.target === modalOverlay) {
      closeModal();
    }
  });

  // Close modal on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

function setLoginStatus(msg, isError) {
  const el = document.getElementById("loginStatus");
  el.textContent = msg || "";
  el.style.display = msg ? "block" : "none";
  el.style.color = isError ? "#b91c1c" : "#166534";
}

async function doLogin(password) {
  try {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const text = await res.text();
    let body = null;
    try {
      body = text ? JSON.parse(text) : null;
    } catch (e) {
      body = null;
    }
    if (!res.ok) {
      const msg =
        (body && (body.error || body.message)) || text || res.statusText;
      setLoginStatus(msg, true);
      return false;
    }
    // keep password in memory only for this session
    window.__ADMIN_PASSWORD = password;
    setLoginStatus("", false);
    // hide login overlay and initialize editor
    const overlay = document.getElementById("loginOverlay");
    overlay.classList.remove("show");
    overlay.hidden = true;
    overlay.style.display = "none";
    setupActions();
    loadConfig();
    return true;
  } catch (err) {
    setLoginStatus("Unable to contact authentication endpoint.", true);
    return false;
  }
}

function initLoginHandlers() {
  const loginBtn = document.getElementById("loginBtn");
  const input = document.getElementById("adminPasswordInput");
  loginBtn.addEventListener("click", () => doLogin(input.value));
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") doLogin(input.value);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  // show login overlay and wait for authentication before loading editor
  const overlay = document.getElementById("loginOverlay");
  overlay.classList.add("show");
  overlay.hidden = false;
  initLoginHandlers();

  const statusOverlay = document.getElementById("modalOverlay");
  statusOverlay.classList.remove("show");
  statusOverlay.hidden = true;
});
