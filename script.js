// 22360859323 Enes Malik Altınpınar
const dataBitsInput = document.getElementById("dataBits");
const calculateButton = document.getElementById("calculate");
const hammingCodeTable = document.getElementById("hammingCodeTable");
const memoryTable = document.getElementById("memoryTable");
const errorBitInput = document.getElementById("errorBit");
const correctErrorButton = document.getElementById("correctError");

let hammingCode = [];

calculateButton.addEventListener("click", () => {
    const dataBits = parseInt(dataBitsInput.value);
    if (![4, 8, 16].includes(dataBits)) {
        alert("Lütfen 4, 8 veya 16 bitlik bir veri girin.");
        return;
    }

    const data = prompt(`${dataBits} bitlik veriyi girin (0 ve 1'lerden oluşan):`);
    if (!/^[01]{4,16}$/.test(data) || data.length !== dataBits) {
        alert("Geçersiz veri girişi. Lütfen doğru uzunlukta 0 ve 1'lerden oluşan bir veri girin.");
        return;
    }

    hammingCode = calculateHammingCode(data.split('').map(Number)); 
    displayResults(hammingCode);
});

correctErrorButton.addEventListener("click", () => {
    const errorBit = parseInt(errorBitInput.value) - 1;
    if (!isNaN(errorBit) && errorBit >= 0 && errorBit < hammingCode.length) {
        hammingCode[errorBit] ^= 1; 
        displayResults(hammingCode);
    } else {
        alert("Geçersiz hata biti pozisyonu.");
    }
});

// Hamming kodu hesaplama fonksiyonu
function calculateHammingCode(data) {
    const dataBits = data.length;
    const totalBits = dataBits + Math.ceil(Math.log2(dataBits + 1));
    let hammingCode = [];

    // Veri bitlerini ve eşlik bitleri için yer tutucuları ekleyin
    let j = 0;
    for (let i = 1; i <= totalBits; i++) {
        if (Math.log2(i) % 1 === 0) {
            hammingCode.push(0); 
        } else {
            hammingCode.push(data[j]);
            j++;
        }
    }

    // Eşlik bitlerini hesapla
    for (let i = 0; i < totalBits; i++) {
        if (Math.log2(i + 1) % 1 !== 0) continue; 

        let parity = 0;
        for (let j = i; j < totalBits; j += (i + 1)) {
            for (let k = j; k < j + i + 1 && k < totalBits; k++) {
                parity ^= hammingCode[k];
            }
        }
        hammingCode[i] = parity;
    }

    return hammingCode;
}

// Sonuçları göster fonksiyonu
function displayResults(hammingCode) {
    hammingCodeTable.innerHTML = "";
    memoryTable.innerHTML = "";

    // Hamming kod tablosunu görüntüle
    const headerRowHamming = hammingCodeTable.insertRow();
    headerRowHamming.insertCell().textContent = "Bit Pozisyonu";
    headerRowHamming.insertCell().textContent = "Hamming Kodu";

    for (let i = 0; i < hammingCode.length; i++) {
        const row = hammingCodeTable.insertRow();
        row.insertCell().textContent = i + 1;
        const bitCell = row.insertCell();
        bitCell.textContent = hammingCode[i];
        bitCell.classList.add("bit-cell");
        if (Math.log2(i + 1) % 1 === 0) {
            bitCell.classList.add("parity-bit");
        }

        // Hataları kontrol edin ve kırmızı ile vurgula
        if (calculateParity(hammingCode, i) !== hammingCode[i]) {
            bitCell.classList.add("error-bit");
        }
    }
    

    // Bellek tablosunu görüntüle
    const headerRowMemory = memoryTable.insertRow();
    headerRowMemory.insertCell().textContent = "Bellek";
    const memoryRowData = memoryTable.insertRow();
    for (let i = 0; i < hammingCode.length; i++) {
        const cell = memoryRowData.insertCell();
        cell.textContent = hammingCode[i];
        cell.classList.add("bit-cell");
        if (Math.log2(i + 1) % 1 === 0) {
            cell.classList.add("parity-bit");
        }
        // Hataları kontrol edin ve kırmızı ile vurgula
        if (calculateParity(hammingCode, i) !== hammingCode[i]) {
            cell.classList.add("error-bit");
        }
    }
}

// Belirli bir bit konumu için pariteyi hesaplayan yardımcı fonksiyon
function calculateParity(hammingCode, bitPosition) {
    let parity = 0;
    for (let j = bitPosition; j < hammingCode.length; j++) {
        if ((j & bitPosition) === bitPosition) {
            parity ^= hammingCode[j];
        }
    }
    return parity;
}
