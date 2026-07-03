function getDetailPeserta(idPeserta) {

    const ss = SpreadsheetApp.getActiveSpreadsheet();
  
    const pesertaSheet =
      ss.getSheetByName(CONFIG.SHEETS.PESERTA);
  
    const absensiSheet =
      ss.getSheetByName(CONFIG.SHEETS.ABSENSI);
  
    const trainingPesertaSheet =
      ss.getSheetByName(CONFIG.SHEETS.TRAINING_PESERTA);
  
    const pesertaData =
      pesertaSheet.getDataRange().getValues();
  
    const absensiData =
      absensiSheet.getDataRange().getValues();
  
    const trainingPesertaData =
      trainingPesertaSheet.getDataRange().getValues();
  
    let peserta = null;
  
    for (let i = 1; i < pesertaData.length; i++) {
      if (String(pesertaData[i][0]) === String(idPeserta)) {
        peserta = {
          id: pesertaData[i][0],
          nama: pesertaData[i][2],
          email: pesertaData[i][3],
          status: pesertaData[i][8]
        };
        break;
      }
    }
  
    if (!peserta) {
      throw new Error("Peserta tidak ditemukan.");
    }
  
    let totalHadir = 0;
    let terakhirAbsen = "-";
  
    for (let i = 1; i < absensiData.length; i++) {
      if (String(absensiData[i][2]) === String(idPeserta)) {
        totalHadir++;
        terakhirAbsen =
          Utilities.formatDate(
            new Date(absensiData[i][1]),
            Session.getScriptTimeZone(),
            "dd/MM/yyyy"
          );
      }
    }
  
    let totalTraining = 0;
  
    for (let i = 1; i < trainingPesertaData.length; i++) {
      // PERBAIKAN: Ubah indeks [1] (ID Training) menjadi [2] (ID Peserta)
      if (String(trainingPesertaData[i][2]) === String(idPeserta)) {
        totalTraining++;
      }
    }
  
    return {
      id: peserta.id,
      nama: peserta.nama,
      email: peserta.email,
      status: peserta.status,
      totalHadir: totalHadir,
      totalTraining: totalTraining,
      terakhirAbsen: terakhirAbsen
    };
  }