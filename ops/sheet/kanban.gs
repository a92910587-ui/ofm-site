// Menu Nova Agency
function onOpen(){
  SpreadsheetApp.getUi()
    .createMenu('Nova Agency')
    .addItem('Créer vue Kanban','createKanban')
    .addToUi();
}

// Crée/rafraîchit une vue Kanban basique depuis la feuille principale
function createKanban(){
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const src = ss.getSheetByName('Feuille 1') || ss.getSheets()[0];
  const data = src.getDataRange().getValues(); // colonnes attendues: stage_name, email, links, target, message, ts
  if (!data.length){ SpreadsheetApp.getUi().alert('Aucune donnée.'); return; }

  const headers = data[0];
  const idx = {
    stage: headers.indexOf('stage_name'),
    email: headers.indexOf('email'),
    msg:   headers.indexOf('message')
  };
  if (idx.stage === -1 || idx.email === -1){
    SpreadsheetApp.getUi().alert("Colonnes 'stage_name' et 'email' requises."); return;
  }

  const rows = [];
  for (let i=1;i<data.length;i++){
    const r = data[i];
    rows.push(['NEW', r[idx.stage]||'', r[idx.email]||'', r[idx.msg]||'']);
  }

  const k = ss.getSheetByName('Kanban') || ss.insertSheet('Kanban');
  k.clear();
  k.getRange(1,1,1,4).setValues([['Status','Nom de scène','Email','Notes']]).setFontWeight('bold');
  if(rows.length) k.getRange(2,1,rows.length,4).setValues(rows);
  SpreadsheetApp.getUi().alert('Vue Kanban créée/rafraîchie dans l’onglet "Kanban".');
}
