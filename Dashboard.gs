function getDashboardPembimbing() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const dokumentasiSheet =
      ss.getSheetByName(
        CONFIG.SHEETS.DOKUMENTASI
      );
    const dokumentasiData =
      dokumentasiSheet
        .getDataRange()
        .getValues();
    const pesertaData = ss
      .getSheetByName(CONFIG.SHEETS.PESERTA)
      .getDataRange()
      .getValues();
    const absensiData = ss
      .getSheetByName(CONFIG.SHEETS.ABSENSI)
      .getDataRange()
      .getValues();
    const trainingData = ss
      .getSheetByName(CONFIG.SHEETS.TRAINING)
      .getDataRange()
      .getValues();
    const today = Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      "yyyy-MM-dd"
    );
  
    // ==========================
    // Mapping Kehadiran Hari Ini
    // ==========================
  
    const absenHariIni = {};
    for (let i = 1; i < absensiData.length; i++) {
      let tanggalAbsen = "";
      try {
        tanggalAbsen = Utilities.formatDate(
          new Date(absensiData[i][1]),
          Session.getScriptTimeZone(),
          "yyyy-MM-dd"
        );
      } catch (err) {
        continue;
      }
      if (tanggalAbsen !== today) continue;
      const idPeserta = String(absensiData[i][2]);
      absenHariIni[idPeserta] = {
        jamMasuk: absensiData[i][3]
          ? Utilities.formatDate(
              new Date(absensiData[i][3]),
              Session.getScriptTimeZone(),
              "HH:mm:ss"
            )
          : "-",
        jamPulang: absensiData[i][4] || "-"
      };
    }
  
    // ==========================
    // Statistik Peserta
    // ==========================
  
    let pesertaAktif = 0;
    let hadirHariIni = 0;
  
    const monitoring = [];
    for (let i = 1; i < pesertaData.length; i++) {
      const idPeserta = String(pesertaData[i][0]);
      const nama = pesertaData[i][2];
      const statusPeserta = pesertaData[i][8];
      if (statusPeserta !== "Aktif") continue;
      pesertaAktif++;
      const dataAbsen = absenHariIni[idPeserta];
      const hadir = !!dataAbsen;
      if (hadir) hadirHariIni++;
      monitoring.push({
        nama: nama,
        status: hadir ? "Hadir" : "Belum Absen",
        jamMasuk: hadir
          ? dataAbsen.jamMasuk
          : "-"
      });
    }
  
    // ==========================
    // Training Hari Ini
    // ==========================
  
    let trainingHariIni = 0;
  
    const trainingToday = [];
    for (let i = 1; i < trainingData.length; i++) {
      let tanggalTraining = "";
      try {
        tanggalTraining = Utilities.formatDate(
          new Date(trainingData[i][1]),
          Session.getScriptTimeZone(),
          "yyyy-MM-dd"
        );
      } catch (err) {
        continue;
      }
      if (tanggalTraining !== today) continue;
      trainingHariIni++;
      trainingToday.push({
        sekolah: trainingData[i][2],
        jenjang: trainingData[i][3],
        materi: trainingData[i][4],
        jumlahSiswa: trainingData[i][5]
      });
    }
  
    monitoring.sort((a, b) =>
      a.nama.localeCompare(b.nama)
    );
  
    const pesertaList = [];
    for (let i = 1; i < pesertaData.length; i++) {
      const idPeserta =
        String(pesertaData[i][0]);
      const nama =
        pesertaData[i][2];
      const statusPeserta =
        pesertaData[i][8];
      let totalHadir = 0;
      for (let j = 1; j < absensiData.length; j++) {
        if (
          String(absensiData[j][2]) === idPeserta
        ) {
          totalHadir++;
        }
      }
  
      pesertaList.push({
        id: idPeserta,
        nama: nama,
        status: statusPeserta,
        totalHadir: totalHadir
  
      });
  
    }
  
    // ==========================
    // DATA TRAINING SIDEBAR
    // ==========================
  
    const sekolahUnik = new Set();
  
    const trainingList = [];
    let totalSiswaTraining = 0;
  
    for (let i = 1; i < trainingData.length; i++) {
      sekolahUnik.add(
        trainingData[i][2]
      );
      totalSiswaTraining += Number(
        trainingData[i][5]
      ) || 0;
      Logger.log(trainingData[i][0]);
  
      trainingList.push({
        id: trainingData[i][0],
        tanggal: Utilities.formatDate(
          new Date(trainingData[i][1]),
          Session.getScriptTimeZone(),
          "dd/MM/yyyy"
        ),
  
        sekolah: trainingData[i][2],
        jenjang: trainingData[i][3],
        materi: trainingData[i][4],
        jumlahSiswa: trainingData[i][5]
      });
  
    }
  
    // ==========================
    // GALERI DOKUMENTASI TRAINING
    // ==========================
  
  
    const dokumentasiList = [];
  
    for(let i=1;i<dokumentasiData.length;i++){
      dokumentasiList.push({
        id:
          dokumentasiData[i][0],
        tanggal:
          Utilities.formatDate(
            new Date(
              dokumentasiData[i][1]
            ),
            Session.getScriptTimeZone(),
            "dd/MM/yyyy"
          ),
  
        trainingId:
          dokumentasiData[i][2],
        pesertaId:
          dokumentasiData[i][3],
        fileId:
          dokumentasiData[i][4],
        url:
          dokumentasiData[i][5],
        keterangan:
          dokumentasiData[i][6]
      });
  
    }
  
    Logger.log("RETURN SIAP");
    Logger.log(
      JSON.stringify({
        pesertaAktif,
        trainingList,
        dokumentasiList
      })
    );
  
    return {
      pesertaAktif: pesertaAktif,
      hadirHariIni: hadirHariIni,
      belumAbsen: pesertaAktif - hadirHariIni,
      trainingHariIni: trainingHariIni,
      monitoring: monitoring,
      trainingToday: trainingToday,
      pesertaList: pesertaList,
      totalTraining: trainingData.length - 1,
      totalSekolah: sekolahUnik.size,
      totalSiswaTraining: totalSiswaTraining,
      trainingList: trainingList,
      dokumentasiList: dokumentasiList,
      absensiList: getDataAbsensi(),
      penilaianList: getDataPenilaian()
    };
  
  }
  
  function testDashboard() {
    const hasil =
      getDashboardPembimbing();
  
    Logger.log(hasil);
  
    return hasil;
  
  }
  
  function getDataAbsensi() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
  
    const pesertaData = ss
      .getSheetByName(CONFIG.SHEETS.PESERTA)
      .getDataRange()
      .getValues();
  
    const absensiData = ss
      .getSheetByName(CONFIG.SHEETS.ABSENSI)
      .getDataRange()
      .getValues();
  
    const pesertaMap = {};
  
    for(let i=1;i<pesertaData.length;i++){
      pesertaMap[
        pesertaData[i][0]
      ] = pesertaData[i][2];
    }
  
    const result = [];
  
    for(let i=1;i<absensiData.length;i++){
      result.push({
        tanggal:
          Utilities.formatDate(
            new Date(absensiData[i][1]),
            Session.getScriptTimeZone(),
            "dd/MM/yyyy"
          ),
  
        nama:
          pesertaMap[
            absensiData[i][2]
          ] || "-",
  
        jamMasuk:
          absensiData[i][3]
          ? Utilities.formatDate(
              new Date(absensiData[i][3]),
              Session.getScriptTimeZone(),
              "HH:mm:ss"
            )
          : "-",
  
        jamPulang:
          absensiData[i][4]
          ? Utilities.formatDate(
              new Date(absensiData[i][4]),
              Session.getScriptTimeZone(),
              "HH:mm:ss"
            )
          : "-"
      });
  
    }
  
    Logger.log(
      "Jumlah absensi: " +
      absensiData.length
    );
  
    Logger.log(
      JSON.stringify(result)
    );
  
    return result;
  
  }
  
  function getPesertaPenilaian() {
    const sheet = SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(
        CONFIG.SHEETS.PESERTA
      );
  
    const data =
      sheet.getDataRange()
      .getValues();
  
    const result = [];
  
    for(let i=1;i<data.length;i++){
      if(data[i][8] !== "Aktif")
        continue;
      result.push({
        id: data[i][0],
        nama: data[i][2]
      });
    }
  
    return result;
  }
  
  function getDataPenilaian() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const penilaianData = ss
      .getSheetByName(CONFIG.SHEETS.PENILAIAN)
      .getDataRange()
      .getValues();
  
    const pesertaData = ss
      .getSheetByName(CONFIG.SHEETS.PESERTA)
      .getDataRange()
      .getValues();
  
    const pesertaMap = {};
  
    for(let i=1;i<pesertaData.length;i++){
      pesertaMap[
        pesertaData[i][0]
      ] = pesertaData[i][2];
    }
  
    const result = [];
  
    for(let i=1;i<penilaianData.length;i++){
      const disiplin = Number(penilaianData[i][4]);
      const tanggung = Number(penilaianData[i][5]);
      const komunikasi = Number(penilaianData[i][6]);
      const kerjasama = Number(penilaianData[i][7]);
      const inisiatif = Number(penilaianData[i][8]);
      const rata2 =
        (
          disiplin +
          tanggung +
          komunikasi +
          kerjasama +
          inisiatif
        ) / 5;
  
      result.push({
        id: penilaianData[i][0],
        pesertaId: penilaianData[i][1],
        nama:
          pesertaMap[
            penilaianData[i][1]
          ] || "-",
        tanggal:
          Utilities.formatDate(
            new Date(
              penilaianData[i][2]
            ),
            Session.getScriptTimeZone(),
            "dd/MM/yyyy"
          ),
  
        minggu:
          penilaianData[i][3],
        disiplin,
        tanggung,
        komunikasi,
        kerjasama,
        inisiatif,
        catatan:
          penilaianData[i][9],
        rata2:
          rata2.toFixed(1)
      });
    }
  
    return result;
  }