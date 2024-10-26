const fs = require("node:fs");
const path = require("node:path");
const readline = require("node:readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const app = {};

// Membuat folder
app.makeFolder = () => {
  rl.question("Masukan Nama Folder: ", (folderName) => {
    fs.mkdir(path.join(__dirname, folderName), (err) => {
      if (err) return console.error("Gagal membuat folder:", err);
      console.log("Folder berhasil dibuat:", folderName);
      rl.close();
    });
  });
};

// Membuat file
app.makeFile = () => {
  rl.question("Masukkan nama file (termasuk ekstensi): ", (fileName) => {
    fs.writeFile(path.join(__dirname, fileName), "", (err) => {
      if (err) return console.error("Gagal membuat file:", err);
      console.log("File berhasil dibuat:", fileName);
      rl.close();
    });
  });
};

// Merapikan file berdasarkan ekstensi
app.extSorter = () => {
  const sourceDir = path.join(__dirname, "unorganize_folder");
  fs.readdir(sourceDir, (err, files) => {
    if (err) return console.error("Gagal membaca folder:", err);

    files.forEach((file) => {
      const ext = path.extname(file).substring(1); // Mendapatkan ekstensi file
      const destDir = path.join(__dirname, ext);

      if (!fs.existsSync(destDir)) fs.mkdirSync(destDir);

      fs.rename(path.join(sourceDir, file), path.join(destDir, file), (err) => {
        if (err) console.error("Gagal memindahkan file:", err);
        else console.log(`File ${file} berhasil dipindahkan ke folder ${ext}`);
      });
    });
  });
};

// Membaca isi folder
app.readFolder = () => {
  rl.question("Masukkan nama folder yang ingin dibaca: ", (folderName) => {
    const dirPath = path.join(__dirname, folderName);
    fs.readdir(dirPath, (err, files) => {
      if (err) return console.error("Gagal membaca folder:", err);

      const fileDetails = files.map((file) => {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);
        return {
          namaFile: file,
          extensi: path.extname(file).substring(1),
          jenisFile: ["jpg", "png"].includes(path.extname(file).substring(1))
            ? "gambar"
            : "text",
          tanggalDibuat: stats.birthtime.toISOString().split("T")[0],
          ukuranFile: `${(stats.size / 1024).toFixed(2)}kb`,
        };
      });

      fileDetails.sort(
        (a, b) => new Date(a.tanggalDibuat) - new Date(b.tanggalDibuat)
      );
      console.log(JSON.stringify(fileDetails, null, 2));
      rl.close();
    });
  });
};

// Membaca isi file
app.readFile = () => {
  rl.question("Masukkan nama file yang ingin dibaca: ", (fileName) => {
    const filePath = path.join(__dirname, fileName);
    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) return console.error("Gagal membaca file:", err);
      console.log(`Isi dari file ${fileName}:\n\n${data}`);
      rl.close();
    });
  });
};

module.exports = app;
