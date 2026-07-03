function simpanPenilaian(data){
    const sheet =
      SpreadsheetApp
        .getActiveSpreadsheet()
        .getSheetByName(
          CONFIG.SHEETS.PENILAIAN
        );
  
    const idNilai =
      "NIL-" +
      Utilities.getUuid()
        .substring(0,8)
        .toUpperCase();
  
    sheet.appendRow([
      idNilai,
      data.idPeserta,
      new Date(),
      data.mingguKe,
      data.disiplin,
      data.tanggungJawab,
      data.komunikasi,
      data.kerjaSama,
      data.inisiatif,
      data.catatan
    ]);
  
    return "Penilaian berhasil disimpan";
  }
  
  function updatePenilaian(data) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.PENILAIAN);
    
    if (!sheet) {
      throw new Error("Sheet Penilaian tidak ditemukan.");
    }
  
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
  
    let rowIndex = -1;
    
    // Mencari baris yang memiliki ID Penilaian (kolom A / indeks 0) sama dengan data.idNilai
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] === data.idNilai) {
        rowIndex = i + 1; // Ditambah 1 karena array mulai dari 0, sedangkan baris Google Sheets mulai dari 1
        break;
      }
    }
  
    if (rowIndex === -1) {
      throw new Error("Data penilaian tidak ditemukan di database.");
    }
  
    // Melakukan update pada baris yang ditemukan. Urutan kolom (mulai dari 1):
    // Kolom C (3) = Tanggal Edit
    // Kolom D (4) = Minggu Ke
    // Kolom E (5) = Disiplin
    // Kolom F (6) = Tanggung Jawab
    // Kolom G (7) = Komunikasi
    // Kolom H (8) = Kerja Sama
    // Kolom I (9) = Inisiatif
    // Kolom J (10)= Catatan
  
    sheet.getRange(rowIndex, 3).setValue(new Date()); 
    sheet.getRange(rowIndex, 4).setValue(data.mingguKe);
    sheet.getRange(rowIndex, 5).setValue(data.disiplin);
    sheet.getRange(rowIndex, 6).setValue(data.tanggungJawab);
    sheet.getRange(rowIndex, 7).setValue(data.komunikasi);
    sheet.getRange(rowIndex, 8).setValue(data.kerjaSama);
    sheet.getRange(rowIndex, 9).setValue(data.inisiatif);
    sheet.getRange(rowIndex, 10).setValue(data.catatan);
  
    return "Data penilaian berhasil di-update.";
  }