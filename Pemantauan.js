
import { Laporan } from "./Laporan.js";
import { MatriksPemantauan } from "./MatriksPemantauan.js";

class Pemantauan {
    constructor() {
        this.matriks = new MatriksPemantauan();
    }

    tampilkan(id, teks) {
        document.getElementById(id).textContent = teks;
    }

    tampilkanStatus(id, status) {
        const elemen = document.getElementById(id);

        elemen.textContent = status;

        const warna = {
            "Aman": "text-green-700",
            "Waspada": "text-amber-600",
            "Bahaya": "text-red-700",
            "Data Belum Lengkap": "text-slate-500"
        };

        elemen.className =
            "mt-2 font-bold " + (warna[status] || "text-slate-500");
    }

    tampilkanParameter(kunci, hasil) {
        const prefix = {
            udara: "udara",
            air: "air",
            tanah: "tanah"
        }[kunci];

        if (!hasil) {
            this.tampilkan(prefix + "Nilai", "--");
            this.tampilkan(prefix + "Status", "Data tidak tersedia");
            return;
        }

        this.tampilkan(
            prefix + "Nilai",
            `${hasil.nilai} ${hasil.satuan}`
        );

        this.tampilkan(prefix + "Status", hasil.status);
    }

    tampilkanMatriks(hasil) {
        const tabel = document.getElementById("matriksBody");
        tabel.replaceChildren();

        for (const kunci of ["udara", "air", "tanah"]) {
            const data = hasil[kunci];
            const baris = document.createElement("tr");

            const isi = [
                data?.nama ?? kunci,
                data ? `${data.nilai} ${data.satuan}` : "--",
                data ? data.batasAman : "--",
                data ? data.batasWaspada : "--",
                data ? data.skor : "--",
                data?.status ?? "Data belum lengkap"
            ];

            isi.forEach((nilai, indeks) => {
                const sel = document.createElement("td");
                sel.className = "border-b border-slate-100 px-4 py-4";
                sel.textContent = nilai;

                if (indeks === 5 && data) {
                    const warna = {
                        Aman: "text-green-700",
                        Waspada: "text-amber-600",
                        Bahaya: "text-red-700"
                    };

                    sel.className +=
                        " font-bold " + warna[data.status];
                }

                baris.appendChild(sel);
            });

            tabel.appendChild(baris);
        }
    }

    muatData() {
        const data = Laporan.ambilData();

        if (!data) {
            this.tampilkan(
                "pesanData",
                "Belum ada data laporan. Masukkan data melalui halaman Laporan."
            );

            this.tampilkanStatus(
                "statusKeseluruhan",
                "Data Belum Lengkap"
            );

            this.tampilkan("skorKeseluruhan", "--");
            this.tampilkan("risikoTertinggi", "Belum diketahui");

            this.tampilkanMatriks({
                udara: null,
                air: null,
                tanah: null
            });

            for (const kunci of ["udara", "air", "tanah"]) {
                this.tampilkanParameter(kunci, null);
            }

            return;
        }

        const hasil = this.matriks.proses(data);
        const keseluruhan = this.matriks.statusKeseluruhan(hasil);

        this.tampilkan(
            "pesanData",
            "Data laporan berhasil dibaca."
        );

        this.tampilkanStatus(
            "statusKeseluruhan",
            keseluruhan.status
        );

        this.tampilkan(
            "skorKeseluruhan",
            keseluruhan.skor === null
                ? "--"
                : `${keseluruhan.skor} / 2`
        );

        const parameterValid = Object.values(hasil)
            .filter(item => item !== null);

        const risiko = parameterValid.length
            ? parameterValid.reduce((tertinggi, item) =>
                item.skor > tertinggi.skor ? item : tertinggi
            )
            : null;

        this.tampilkan(
            "risikoTertinggi",
            risiko
                ? `${risiko.nama} (${risiko.status})`
                : "Belum diketahui"
        );

        for (const kunci of ["udara", "air", "tanah"]) {
            this.tampilkanParameter(kunci, hasil[kunci]);
        }

        this.tampilkanMatriks(hasil);
    }

    jalankan() {
        this.muatData();

        document.getElementById("refreshButton")
            .addEventListener("click", () => this.muatData());

        // Perbarui tampilan jika laporan berubah di tab lain.
        window.addEventListener("storage", event => {
            if (event.key === Laporan.STORAGE_KEY) {
                this.muatData();
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const aplikasi = new Pemantauan();
    aplikasi.jalankan();
});
