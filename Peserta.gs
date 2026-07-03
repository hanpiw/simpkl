function getPesertaId(email) {

    const sheet = SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(CONFIG.SHEETS.PESERTA);
  
    if (!sheet) return null;
  
    const data = sheet.getDataRange().getValues();
  
    for (let i = 1; i < data.length; i++) {
  
      if (data[i][1] === email) {
  
        return data[i][0];
  
      }
  
    }
  
    return null;
  
  }
  
  function getPesertaByEmail(email) {
  
    const sheet = SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(CONFIG.SHEETS.PESERTA);
  
    if (!sheet) return null;
  
    const data = sheet.getDataRange().getValues();
  
    for (let i = 1; i < data.length; i++) {
  
      if (data[i][1] === email) {
  
        return {
          id: data[i][0],
          nama: data[i][2],
          sekolah: data[i][3],
          jurusan: data[i][4],
          telepon: data[i][5],
          mulai: data[i][6],
          selesai: data[i][7],
          status: data[i][8]
        };
  
      }
  
    }
  
    return null;
  
  }