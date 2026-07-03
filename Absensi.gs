function cekAbsenHariIni(idPeserta) {

    const sheet = SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(CONFIG.SHEETS.ABSENSI);
  
    if (!sheet) {
      throw new Error("Sheet Absensi tidak ditemukan.");
    }
  
    const data = sheet.getDataRange().getValues();
  
    const today = Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      "yyyy-MM-dd"
    );
  
    for (let i = 1; i < data.length; i++) {
  
      let tanggalSheet = "";
  
      try {
  
        tanggalSheet = Utilities.formatDate(
          new Date(data[i][1]),
          Session.getScriptTimeZone(),
          "yyyy-MM-dd"
        );
  
      } catch (err) {
        continue;
      }
  
      const pesertaSheet = String(data[i][2]).trim();
  
      if (
        tanggalSheet === today &&
        pesertaSheet === String(idPeserta).trim()
      ) {
  
        return {
          sudahAbsen: true,
          row: i + 1,
          jamMasuk: data[i][3],
          jamPulang: data[i][4]
        };
  
      }
  
    }
  
    return {
      sudahAbsen: false,
      row: null,
      jamMasuk: "",
      jamPulang: ""
    };
  
  }
  
  function simpanAbsen(tipe) {
  
    const email = Session.getActiveUser().getEmail();
  
    const idPeserta = getPesertaId(email);
  
    if (!idPeserta) {
      throw new Error("Data peserta tidak ditemukan.");
    }
  
    const sheet = SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(CONFIG.SHEETS.ABSENSI);
  
    if (!sheet) {
      throw new Error("Sheet Absensi tidak ditemukan.");
    }
  
    const now = new Date();
  
    const tanggal = Utilities.formatDate(
      now,
      Session.getScriptTimeZone(),
      "yyyy-MM-dd"
    );
  
    const waktu = Utilities.formatDate(
      now,
      Session.getScriptTimeZone(),
      "HH:mm:ss"
    );
  
    const dataHariIni = cekAbsenHariIni(idPeserta);
  
    Logger.log(JSON.stringify(dataHariIni));
  
    // =====================
    // ABSEN MASUK
    // =====================
  
    if (tipe === "Masuk") {
  
      if (
        dataHariIni.sudahAbsen &&
        dataHariIni.jamMasuk
      ) {
  
        throw new Error(
          "Anda sudah melakukan absen masuk hari ini."
        );
  
      }
  
      sheet.appendRow([
        generateId("ABS"),
        tanggal,
        idPeserta,
        waktu,
        "",
        "Hadir",
        "Absen Masuk"
      ]);
  
      return "Absen masuk berhasil pada " + waktu;
  
    }
  
    // =====================
    // ABSEN PULANG
    // =====================
  
    if (tipe === "Pulang") {
  
      if (
        !dataHariIni.sudahAbsen ||
        !dataHariIni.jamMasuk
      ) {
  
        throw new Error(
          "Belum melakukan absen masuk."
        );
  
      }
  
      if (dataHariIni.jamPulang) {
  
        throw new Error(
          "Anda sudah melakukan absen pulang."
        );
  
      }
  
      sheet
        .getRange(dataHariIni.row, 5)
        .setValue(waktu);
  
      sheet
        .getRange(dataHariIni.row, 7)
        .setValue("Absen Masuk & Pulang");
  
      return "Absen pulang berhasil pada " + waktu;
  
    }
  
    throw new Error("Tipe absensi tidak valid.");
  
  }
  
  function getRiwayatAbsen(idPeserta) {
  
    const sheet = SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(CONFIG.SHEETS.ABSENSI);
  
    const data = sheet.getDataRange().getValues();
  
    const hasil = [];
  
    for (let i = 1; i < data.length; i++) {
  
      if (
        String(data[i][2]) === String(idPeserta)
      ) {
  
        hasil.push({
          idAbsen: data[i][0],
          tanggal: data[i][1],
          jamMasuk: data[i][3],
          jamPulang: data[i][4],
          status: data[i][5],
          keterangan: data[i][6]
        });
  
      }
  
    }
  
    return hasil;
  
  }