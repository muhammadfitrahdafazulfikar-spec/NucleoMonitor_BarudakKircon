
export class MatriksPemantauan {
    constructor() {
        this.aturan = {
            udara: {
                nama: "Udara",
                satuan: "unit simulasi",
                batasAman: 30,
                batasWaspada: 50
            },
            air: {
                nama: "Air",
                satuan: "unit simulasi",
                batasAman: 7,
                batasWaspada: 9
            },
            tanah: {
                nama: "Tanah",
                satuan: "unit simulasi",
                batasAman: 40,
                batasWaspada: 60
            }
        };
    }

    hitungStatus(nilai, aturan) {
        if (nilai <= aturan.batasAman) {
            return {
                status: "Aman",
                skor: 0
            };
        }

        if (nilai <= aturan.batasWaspada) {
            return {
                status: "Waspada",
                skor: 1
            };
        }

        return {
            status: "Bahaya",
            skor: 2
        };
    }

    proses(data) {
        const hasil = {};

        for (const parameter of Object.keys(this.aturan)) {
            const nilai = data?.[parameter];
            const aturan = this.aturan[parameter];

            if (
                nilai === null ||
                nilai === undefined ||
                nilai === "" ||
                !Number.isFinite(Number(nilai)) ||
                Number(nilai) < 0
            ) {
                hasil[parameter] = null;
                continue;
            }

            const nilaiAngka = Number(nilai);
            const penilaian = this.hitungStatus(nilaiAngka, aturan);

            hasil[parameter] = {
                nama: aturan.nama,
                nilai: nilaiAngka,
                satuan: aturan.satuan,
                batasAman: aturan.batasAman,
                batasWaspada: aturan.batasWaspada,
                status: penilaian.status,
                skor: penilaian.skor
            };
        }

        return hasil;
    }

    statusKeseluruhan(hasil) {
        const parameter = Object.values(hasil);

        if (
            parameter.length !== 3 ||
            parameter.some(nilai => nilai === null)
        ) {
            return {
                status: "Data Belum Lengkap",
                skor: null
            };
        }

        const skorTertinggi = Math.max(
            ...parameter.map(nilai => nilai.skor)
        );

        const status = ["Aman", "Waspada", "Bahaya"][skorTertinggi];

        return {
            status,
            skor: skorTertinggi
        };
    }
}
