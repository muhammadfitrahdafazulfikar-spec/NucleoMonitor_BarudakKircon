
export class Laporan {
    static STORAGE_KEY = "nucleoMonitorLaporanLingkungan";

    constructor(udara, air, tanah) {
        this.udara = Number(udara);
        this.air = Number(air);
        this.tanah = Number(tanah);
    }

    validasi() {
        return [this.udara, this.air, this.tanah].every(
            nilai => Number.isFinite(nilai) && nilai >= 0
        );
    }

    simpan() {
        if (!this.validasi()) {
            throw new Error("Data harus berupa angka valid dan tidak negatif.");
        }

        const dataBaru = {
            udara: this.udara,
            air: this.air,
            tanah: this.tanah,
            waktu: new Date().toISOString()
        };

        localStorage.setItem(
            Laporan.STORAGE_KEY,
            JSON.stringify(dataBaru)
        );

        return dataBaru;
    }

    static ambilData() {
        const data = localStorage.getItem(Laporan.STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    }
}
