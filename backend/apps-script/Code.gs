/**
 * Hotel Neo KBP — Upload Foto ke Google Drive
 * Dipanggil dari server Next.js (lib/upload.ts). Terima data URL JPEG, simpan ke folder Drive,
 * balikkan ID file & URL yang bisa ditampilkan langsung sebagai <img>.
 *
 * CARA PASANG: lihat README.md bagian "Google Drive untuk foto".
 */

var FOLDER_ID = "PASTE_ID_FOLDER_DRIVE_DISINI";   // ganti dengan ID folder Drive
var SECRET    = "ganti-dengan-kata-rahasia";       // samakan dengan UPLOAD_SECRET di Vercel (opsional)

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents || "{}");
    if (SECRET && body.secret !== SECRET) return out({ status: "error", message: "Secret salah" });
    if (!body.foto || body.foto.indexOf("data:image/") !== 0) return out({ status: "error", message: "Foto tidak valid" });

    var mime = body.foto.substring(5, body.foto.indexOf(";"));          // image/jpeg
    var base64 = body.foto.split(",")[1];
    var ext = mime === "image/png" ? ".png" : mime === "image/webp" ? ".webp" : ".jpg";
    var nama = (body.nama || "foto").replace(/[^a-zA-Z0-9_-]/g, "_") + "_" + Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyyMMdd_HHmmss") + ext;

    var folder = DriveApp.getFolderById(FOLDER_ID);
    // Subfolder per modul supaya rapi (paket/, checklist/, dll.)
    if (body.folder) {
      var sub = folder.getFoldersByName(body.folder);
      folder = sub.hasNext() ? sub.next() : folder.createFolder(body.folder);
    }
    var blob = Utilities.newBlob(Utilities.base64Decode(base64), mime, nama);
    var file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    var id = file.getId();
    return out({
      status: "ok",
      id: id,
      // URL ini bisa langsung dipakai di <img src>
      url: "https://drive.google.com/thumbnail?id=" + id + "&sz=w1200",
      view: file.getUrl()
    });
  } catch (err) {
    return out({ status: "error", message: String(err) });
  }
}

function doGet() {
  return out({ status: "ok", app: "Hotel Neo KBP upload" });
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
