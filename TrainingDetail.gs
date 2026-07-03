function getDetailTraining(idTraining) {

    Logger.log("ID DITERIMA:");
    Logger.log(idTraining);
  
    const ss = SpreadsheetApp.getActiveSpreadsheet();
  
    const trainingSheet =
      ss.getSheetByName(CONFIG.SHEETS.TRAINING);
  
    const pesertaSheet =
      ss.getSheetByName(CONFIG.SHEETS.PESERTA);
  
    const trainingPesertaSheet =
      ss.getSheetByName(CONFIG.SHEETS.TRAINING_PESERTA);
  
    const dokumentasiSheet =
      ss.getSheetByName(CONFIG.SHEETS.DOKUMENTASI);
  
    const trainingData =
      trainingSheet.getDataRange().getValues();
  
    const pesertaData =
      pesertaSheet.getDataRange().getValues();
  
    const trainingPesertaData =
      trainingPesertaSheet.getDataRange().getValues();
  
    const dokumentasiData =
      dokumentasiSheet.getDataRange().getValues();
  
    let training = null;
  
    // =====================
    // DATA TRAINING
    // =====================
  
    for(let i=1;i<trainingData.length;i++){
  
      Logger.log(
        "Sheet ID = " + trainingData[i][0] +
        " | Param = " + idTraining
      );
  
      if(
        String(trainingData[i][0]) ===
        String(idTraining)
      ){
  
        training = {
  
          id: trainingData[i][0],
  
          tanggal: Utilities.formatDate(
            new Date(trainingData[i][1]),
            Session.getScriptTimeZone(),
            "dd/MM/yyyy"
          ),
  
          sekolah: trainingData[i][2],
  
          jenjang: trainingData[i][3],
  
          materi: trainingData[i][4],
  
          jumlahSiswa: trainingData[i][5],
  
          catatan: trainingData[i][6]
  
        };
  
        break;
  
      }
  
    }
  
    if(!training){
      throw new Error(
        "Training tidak ditemukan."
      );
    }
  
    // =====================
    // MAP PESERTA
    // =====================
  
    const pesertaMap = {};
  
    for(let i=1;i<pesertaData.length;i++){
  
      pesertaMap[
        pesertaData[i][0]
      ] = pesertaData[i][2];
  
    }
  
    // =====================
    // TIM TRAINING
    // =====================
  
    const timTraining = [];
  
    for(let i=1;i<trainingPesertaData.length;i++){
  
      if(
        String(trainingPesertaData[i][1]) ===
        String(idTraining)
      ){
  
        timTraining.push({
  
          nama:
            pesertaMap[
              trainingPesertaData[i][2]
            ] || "-",
  
          peran:
            trainingPesertaData[i][3]
  
        });
  
      }
  
    }
  
    // =====================
    // DOKUMENTASI
    // =====================
  
    const dokumentasi = [];
  
    for(let i=1;i<dokumentasiData.length;i++){
  
      if(
        String(dokumentasiData[i][2]) ===
        String(idTraining)
      ){
  
        dokumentasi.push({
  
          fileId:
            dokumentasiData[i][4],
  
          url:
            dokumentasiData[i][5],
  
          keterangan:
            dokumentasiData[i][6]
  
        });
  
      }
  
    }
  
    Logger.log(dokumentasi);
  
    return {
  
      training: training,
  
      timTraining: timTraining,
  
      dokumentasi: dokumentasi
  
    };
  
  }