function checkRole(email) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.USERS);
    if (!sheet) return "TIDAK_TERDAFTAR";
    
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      const userEmail = String(data[i][1]).trim();
      const role = String(data[i][3]).trim();
      const status = String(data[i][4]).trim().toUpperCase();
  
      if (userEmail === email && status === "AKTIF") {
        return role;
      }
    }
    
    return "TIDAK_TERDAFTAR";
  }