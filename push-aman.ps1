# =====================================================================
#  push-aman.ps1  -  Cek akun GitHub dulu, baru git add / commit / push
#  Untuk Bang Syam (2 akun: ITM-achcc dan Djebod)
#
#  Cara pakai (di folder project):
#     push-aman                      -> tanya-tanya interaktif
#     push-aman -Pesan "fitur baru"  -> langsung pakai pesan commit ini
#     push-aman -Akun Djebod         -> paksa pakai akun tertentu
# =====================================================================

param(
    [ValidateSet("Djebod", "ITM-achcc")]
    [string]$Akun,
    [string]$Pesan
)

$DaftarAkun = [ordered]@{
    "ITM-achcc" = "itm@astoncirebon.com"
    "Djebod"    = "syam.rakhmany@gmail.com"
}

function Info($t)  { Write-Host $t -ForegroundColor Cyan }
function Oke($t)   { Write-Host "  [OK]  $t" -ForegroundColor Green }
function Salah($t) { Write-Host "  [X]   $t" -ForegroundColor Red }
function Awas($t)  { Write-Host "  [!]   $t" -ForegroundColor Yellow }
function Tanya($t) {
    $j = Read-Host "$t (y/n)"
    return ($j -match '^(y|ya|yes)$')
}

Write-Host ""
Info "=============================================="
Info "   PUSH AMAN - cek akun GitHub sebelum push"
Info "=============================================="

# --- 1. Git terpasang? -------------------------------------------------
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Salah "Git belum terpasang. Install dari https://git-scm.com lalu buka ulang terminal."
    exit 1
}

# --- 2. Folder ini repo git? -------------------------------------------
$null = git rev-parse --is-inside-work-tree 2>$null
if ($LASTEXITCODE -ne 0) {
    Salah "Folder ini belum repo Git: $((Get-Location).Path)"
    Write-Host "        Pastikan sudah 'cd' ke folder project, atau jalankan 'git init' dulu."
    exit 1
}

# --- 3. Baca alamat repo (remote origin) -------------------------------
$remote = git remote get-url origin 2>$null
if (-not $remote) {
    Salah "Belum ada alamat repo (remote 'origin')."
    Write-Host "        Tambahkan dulu, contoh:"
    Write-Host "        git remote add origin https://Djebod@github.com/Djebod/nama-repo.git"
    exit 1
}

$pemilik = $null; $repo = $null; $pakaiSsh = $false
if ($remote -match 'github\.com[:/]+([^/]+)/([^/]+?)(\.git)?/?$') {
    $pemilik = $Matches[1]
    $repo    = $Matches[2]
}
if ($remote -match '^(git@|ssh://)') { $pakaiSsh = $true }

Write-Host ""
Info "Alamat repo : $remote"
if ($pemilik) { Info "Pemilik repo: $pemilik" }

# --- 4. Tentukan akun --------------------------------------------------
if (-not $Akun) {
    if ($pemilik -and $DaftarAkun.Contains($pemilik)) {
        $Akun = $pemilik
        Oke "Akun terdeteksi dari alamat repo: $Akun"
    } else {
        Write-Host ""
        Write-Host "  Push ke akun yang mana?"
        Write-Host "    1. ITM-achcc  (itm@astoncirebon.com)"
        Write-Host "    2. Djebod     (syam.rakhmany@gmail.com)"
        $p = Read-Host "  Pilih 1 atau 2"
        switch ($p) {
            "1" { $Akun = "ITM-achcc" }
            "2" { $Akun = "Djebod" }
            default { Salah "Pilihan tidak dikenal. Dibatalkan."; exit 1 }
        }
    }
}
# Samakan penulisan huruf besar/kecil dengan nama akun resmi
foreach ($k in $DaftarAkun.Keys) { if ($k -eq $Akun) { $Akun = $k } }
$Email = $DaftarAkun[$Akun]

if ($pemilik -and $pemilik -ne $Akun) {
    Awas "Repo ini milik '$pemilik', tapi akun yang dipilih '$Akun'."
    Write-Host "        Push hanya bisa kalau '$Akun' adalah collaborator di repo itu."
    if (-not (Tanya "  Tetap lanjut?")) { Salah "Dibatalkan."; exit 1 }
}

# --- 5. Cek nama, email, dan URL ---------------------------------------
Write-Host ""
Info "Mengecek pengaturan akun project ini..."

$namaSkrg  = git config user.name
$emailSkrg = git config user.email
$perluPerbaiki = $false

if ($namaSkrg -eq $Akun) { Oke "user.name  = $namaSkrg" }
else { Salah "user.name  = '$namaSkrg'  (seharusnya '$Akun')"; $perluPerbaiki = $true }

if ($emailSkrg -eq $Email) { Oke "user.email = $emailSkrg" }
else { Salah "user.email = '$emailSkrg'  (seharusnya '$Email')"; $perluPerbaiki = $true }

$urlBenar = $null
if ($pakaiSsh) {
    Awas "Repo memakai SSH. Nama akun di URL tidak dicek."
    Write-Host "        Cek manual dengan: ssh -T git@github.com"
} elseif ($pemilik -and $repo) {
    $urlBenar = "https://$Akun@github.com/$pemilik/$repo.git"
    if ($remote -eq $urlBenar) { Oke "remote     = $remote" }
    else { Salah "remote     = $remote"; Write-Host "               seharusnya $urlBenar"; $perluPerbaiki = $true }
} else {
    Awas "Alamat repo bukan GitHub standar, URL tidak dicek."
}

if ($perluPerbaiki) {
    Write-Host ""
    if (Tanya "  Perbaiki otomatis sekarang?") {
        git config user.name  "$Akun"
        git config user.email "$Email"
        if ($urlBenar) { git remote set-url origin $urlBenar }
        Oke "Sudah diperbaiki (hanya untuk project ini)."
    } else {
        Salah "Tidak diperbaiki. Push dibatalkan supaya tidak salah akun."
        exit 1
    }
}

# --- 6. Tampilkan perubahan --------------------------------------------
Write-Host ""
Info "File yang berubah (git status):"
git status --short
$adaPerubahan = [bool](git status --porcelain)

# --- 7. git add . & git commit -----------------------------------------
if ($adaPerubahan) {
    Write-Host ""
    Awas "Pastikan tidak ada file rahasia (.env, kunci, password) di daftar atas."
    if (-not (Tanya "  Lanjut simpan semua perubahan ini?")) { Salah "Dibatalkan."; exit 1 }

    if (-not $Pesan) { $Pesan = Read-Host "  Tulis catatan perubahan" }
    if (-not $Pesan) { Salah "Catatan perubahan tidak boleh kosong. Dibatalkan."; exit 1 }

    Write-Host ""
    Info "> git add ."
    git add .
    Info "> git commit -m `"$Pesan`""
    git commit -m "$Pesan"
    if ($LASTEXITCODE -ne 0) { Salah "Commit gagal. Lihat pesan di atas."; exit 1 }
} else {
    Awas "Tidak ada perubahan baru. Lanjut push commit yang belum terkirim (kalau ada)."
}

# --- 8. git push -------------------------------------------------------
Write-Host ""
$null = git rev-parse --abbrev-ref --symbolic-full-name "@{u}" 2>$null
if ($LASTEXITCODE -ne 0) {
    Info "> git push -u origin HEAD   (push pertama untuk branch ini)"
    git push -u origin HEAD
} else {
    Info "> git push"
    git push
}

Write-Host ""
if ($LASTEXITCODE -eq 0) {
    Oke "SELESAI - berhasil push sebagai $Akun"
} else {
    Salah "Push gagal. Penyebab yang paling sering:"
    Write-Host "   - Login tersimpan memakai akun lain -> jalankan:"
    Write-Host "       cmdkey /delete:git:https://github.com"
    Write-Host "     lalu jalankan push-aman lagi dan login sebagai $Akun"
    Write-Host "   - Ada perubahan di GitHub yang belum diambil -> jalankan: git pull --rebase"
    exit 1
}
