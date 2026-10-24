// Script Google Apps Script lié au Google Sheet des réponses.
// À coller dans Extensions → Apps Script du Sheet, puis déployer en « Application Web »
// (Exécuter en tant que : moi · Accès : tout le monde). Voir le README.

const HEADERS = ["Date", "Prénom", "Nom", "Réponse", "Commentaire"];
const MAX_NAME = 60;
const MAX_COMMENT = 1000;

function getSheet_() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Empêche une valeur saisie d'être interprétée comme une formule dans le Sheet
function clean_(value, max) {
  const s = String(value || "").trim().slice(0, max);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// Enregistre une réponse
function doPost(e) {
  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return json_({ ok: false, error: "Requête invalide" });
  }

  // Champ piège invisible : rempli uniquement par les robots
  if (data.website) return json_({ ok: true });

  const prenom = clean_(data.prenom, MAX_NAME);
  const nom = clean_(data.nom, MAX_NAME);
  const vient = data.reponse === "oui";
  if (!prenom || !nom) {
    return json_({ ok: false, error: "Prénom et nom obligatoires" });
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    getSheet_().appendRow([
      new Date(),
      prenom,
      nom,
      vient ? "Je viens" : "Je ne viens pas",
      clean_(data.commentaire, MAX_COMMENT),
    ]);
  } finally {
    lock.releaseLock();
  }
  return json_({ ok: true });
}

// Renvoie la liste publique des participants : prénom + initiale du nom,
// sans les commentaires
function doGet() {
  const rows = getSheet_().getDataRange().getValues().slice(1);

  // Si quelqu'un répond plusieurs fois, seule sa dernière réponse compte
  const latest = new Map();
  for (const row of rows) {
    const [prenom, nom] = [row[1], row[2]].map((s) => String(s).trim().replace(/^'/, ""));
    if (!prenom && !nom) continue;
    const key = (prenom + " " + nom).toLowerCase();
    const initiale = nom ? " " + [...nom][0].toUpperCase() + "." : "";
    latest.delete(key);
    latest.set(key, { name: prenom + initiale, vient: row[3] === "Je viens" });
  }

  const names = [...latest.values()].filter((p) => p.vient).map((p) => p.name);
  return json_({ count: names.length, names });
}
