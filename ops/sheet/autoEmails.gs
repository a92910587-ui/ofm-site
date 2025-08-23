// Envoi automatique d’emails à partir des templates HTML
const AGENCY_NAME = "Nova Agency";
const FROM_NAME = "Nova Agency Bot";

function tpl(name, stage_name, email, links, target, message) {
  const html = HtmlService.createTemplateFromFile(name)
    .evaluate().getContent()
    .replace(/{{stage_name}}/g, stage_name)
    .replace(/{{email}}/g, email)
    .replace(/{{links}}/g, links)
    .replace(/{{target}}/g, target)
    .replace(/{{message}}/g, message);
  return html;
}

function sendHtml(to, html, subject) {
  GmailApp.sendEmail(to, subject, "HTML only", {
    name: FROM_NAME,
    htmlBody: html,
  });
}

function cronProcessLeads() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Feuille 1");
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idx = {
    stage: headers.indexOf("stage_name"),
    email: headers.indexOf("email"),
    links: headers.indexOf("links"),
    target: headers.indexOf("target"),
    message: headers.indexOf("message")
  };
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const email = row[idx.email];
    if (!email) continue;

    const html = tpl("01-accuse-de-reception", row[idx.stage], email, row[idx.links], row[idx.target], row[idx.message]);
    sendHtml(email, html, "📩 Nova Agency - Accusé de réception");
  }
}
