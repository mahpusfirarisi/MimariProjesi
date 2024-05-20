// Get DOM elements
const dataBitsInput = document.getElementById("dataBits");
const calculateButton = document.getElementById("calculate");
const hammingCodeTable = document.getElementById("hammingCodeTable");
const memoryTable = document.getElementById("memoryTable");
const errorBitInput = document.getElementById("errorBit");
const correctErrorButton = document.getElementById("correctError");

// Global hammingCode variable
let hammingCode = [];

// Event listeners
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
        hammingCode[errorBit] ^= 1; // Flip the bit
        displayResults(hammingCode);
    } else {
        alert("Geçersiz hata biti pozisyonu.");
    }
});

// Hamming code calculation function
function calculateHammingCode(data) {
    const dataBits = data.length;
    const totalBits = dataBits + Math.ceil(Math.log2(dataBits + 1));
    let hammingCode = [];

    // Insert data bits and placeholders for parity bits
    let j = 0;
    for (let i = 1; i <= totalBits; i++) {
        if (Math.log2(i) % 1 === 0) {
            hammingCode.push(0); // Placeholder for parity bit
        } else {
            hammingCode.push(data[j]);
            j++;
        }
    }

    // Calculate parity bits
    for (let i = 0; i < totalBits; i++) {
        if (Math.log2(i + 1) % 1 !== 0) continue; // Skip data bit positions

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

// Display results function
function displayResults(hammingCode) {
    hammingCodeTable.innerHTML = "";
    memoryTable.innerHTML = "";

    // Display Hamming code table
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

        // Check for errors and highlight in red
        if (calculateParity(hammingCode, i) !== hammingCode[i]) {
            bitCell.classList.add("error-bit");
        }
    }
    

    // Display memory table
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
        // Check for errors and highlight in red
        if (calculateParity(hammingCode, i) !== hammingCode[i]) {
            cell.classList.add("error-bit");
        }
    }
}

// Helper function to calculate parity for a given bit position
function calculateParity(hammingCode, bitPosition) {
    let parity = 0;
    for (let j = bitPosition; j < hammingCode.length; j++) {
        if ((j & bitPosition) === bitPosition) {
            parity ^= hammingCode[j];
        }
    }
    return parity;
}
