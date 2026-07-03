function uploadDokumentasi(base64File) {

    const folder = DriveApp.getFolderById(
      CONFIG.FOLDER_ID
    );
  
    const contentType = base64File.data.substring(
      5,
      base64File.data.indexOf(';')
    );
  
    const bytes = Utilities.base64Decode(
      base64File.data.split('base64,')[1]
    );
  
    const blob = Utilities.newBlob(
      bytes,
      contentType,
      base64File.name
    );
  
    const file = folder.createFile(blob);
  
    return {
      fileId: file.getId(),
      fileUrl: file.getUrl()
    };
  
  }
  
  function simpanTraining(formData, base64File) {
  
    const email = Session.getActiveUser().getEmail();
  
    const idPeserta = getPesertaId(email);
  
    const trainingSheet = SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(CONFIG.SHEETS.TRAINING);
  
    const pesertaSheet = SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(CONFIG.SHEETS.TRAINING_PESERTA);
  
    const dokumentasiSheet = SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(CONFIG.SHEETS.DOKUMENTASI);
  
    const trainingId = generateId("TR");
  
    const tanggal = Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      "yyyy-MM-dd"
    );
  
    trainingSheet.appendRow([
      trainingId,
      tanggal,
      formData.sekolah,
      formData.jenjang,
      formData.materi,
      formData.jumlahSiswa,
      formData.catatan
    ]);
  
    pesertaSheet.appendRow([
      generateId("TP"),
      trainingId,
      idPeserta,
      formData.peran || "Trainer"
    ]);
  
    if (base64File) {
  
      const fileInfo = uploadDokumentasi(base64File);
  
      dokumentasiSheet.appendRow([
        generateId("DOC"),
        tanggal,
        trainingId,
        idPeserta,
        fileInfo.fileId,
        fileInfo.fileUrl,
        formData.catatan
      ]);
  
    }
  
    return "Training berhasil disimpan.";
  
  }