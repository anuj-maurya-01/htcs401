// HTCS401 Interactive Visualizers

// AES S-Box Array (Standard Rijndael S-Box)
const AES_SBOX = [
    0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
    0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
    0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
    0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
    0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
    0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
    0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
    0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
    0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
    0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
    0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
    0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
    0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
    0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
    0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
    0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16
];

// Global State for AES Visualizer
let aesState = Array(16).fill(0).map((_, i) => "AESCRYPTOGRAPHY".charCodeAt(i) || 0x20);

// Initialize visualizers when tab triggers
document.addEventListener('DOMContentLoaded', () => {
    initAESVisualizer();
    initPKIFlow();
});

// ----------------------------------------------------
// 1. AES Round Visualizer
// ----------------------------------------------------
function initAESVisualizer() {
    renderAESGrid();
    
    // Add input change listener
    const input = document.getElementById('aes-input-string');
    if (input) {
        input.addEventListener('input', (e) => {
            const str = e.target.value.padEnd(16, ' ').substring(0, 16);
            aesState = Array.from(str).map(c => c.charCodeAt(0));
            renderAESGrid();
            document.getElementById('aes-log').innerHTML = 'State initialized with input string. Click operations below to simulate an AES round.';
        });
    }
}

function renderAESGrid() {
    const grid = document.getElementById('aes-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    // AES state is structured column-major
    // Row index runs from 0 to 3, Column index from 0 to 3
    // Cell index in 1D array is: row + col * 4
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            const idx = r + c * 4;
            const byteVal = aesState[idx];
            const hexStr = byteVal.toString(16).toUpperCase().padStart(2, '0');
            const asciiChar = byteVal >= 32 && byteVal <= 126 ? String.fromCharCode(byteVal) : '.';
            
            const cell = document.createElement('div');
            cell.id = `aes-cell-${r}-${c}`;
            cell.className = 'aes-cell border theme-border p-3 flex flex-col items-center justify-center font-mono rounded bg-white dark:bg-slate-800 transition-all duration-300';
            cell.innerHTML = `
                <span class="text-sm font-bold text-slate-800 dark:text-slate-100">${hexStr}</span>
                <span class="text-[10px] text-slate-400 font-medium">${asciiChar}</span>
            `;
            grid.appendChild(cell);
        }
    }
}

// AES SubBytes Animation & Calculation
function triggerAESSubBytes() {
    clearAESClasses();
    const log = document.getElementById('aes-log');
    
    // Animate cell substitution
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            const idx = r + c * 4;
            const cell = document.getElementById(`aes-cell-${r}-${c}`);
            
            setTimeout(() => {
                cell.classList.add('active-sub');
                const prevVal = aesState[idx];
                aesState[idx] = AES_SBOX[prevVal];
                
                // Update text
                const hexStr = aesState[idx].toString(16).toUpperCase().padStart(2, '0');
                const asciiChar = aesState[idx] >= 32 && aesState[idx] <= 126 ? String.fromCharCode(aesState[idx]) : '.';
                cell.innerHTML = `
                    <span class="text-sm font-bold text-white">${hexStr}</span>
                    <span class="text-[10px] text-yellow-200">${asciiChar}</span>
                `;
            }, (r + c) * 100);
        }
    }
    
    log.innerHTML = `
        <div class="space-y-1">
            <p class="font-semibold text-amber-700 dark:text-amber-400">Operation: SubBytes (Confusion)</p>
            <p class="text-xs">Each byte in the state matrix is replaced with a corresponding entry from the <b>Rijndael S-Box</b> lookup table. This provides non-linearity to resist mathematical cryptanalysis.</p>
            <p class="text-xs font-mono mt-1 bg-slate-100 dark:bg-slate-800 p-1 rounded">Example: S-Box[0x41] ('A') -> 0x83</p>
        </div>
    `;
}

// AES ShiftRows Animation & Calculation
function triggerAESShiftRows() {
    clearAESClasses();
    const log = document.getElementById('aes-log');
    
    // Shift row values (column-major state array)
    // Row 0: no shift
    // Row 1: Left shift by 1. index mapping: [1, 5, 9, 13] -> [5, 9, 13, 1]
    // Row 2: Left shift by 2. index mapping: [2, 6, 10, 14] -> [10, 14, 2, 6]
    // Row 3: Left shift by 3. index mapping: [3, 7, 11, 15] -> [15, 3, 7, 11]
    
    const newState = [...aesState];
    
    // Row 1 shift
    newState[1] = aesState[5];
    newState[5] = aesState[9];
    newState[9] = aesState[13];
    newState[13] = aesState[1];
    
    // Row 2 shift
    newState[2] = aesState[10];
    newState[6] = aesState[14];
    newState[10] = aesState[2];
    newState[14] = aesState[6];
    
    // Row 3 shift
    newState[3] = aesState[15];
    newState[7] = aesState[3];
    newState[11] = aesState[7];
    newState[15] = aesState[11];
    
    // Animate row by row
    for (let r = 1; r < 4; r++) {
        setTimeout(() => {
            for (let c = 0; c < 4; c++) {
                const cell = document.getElementById(`aes-cell-${r}-${c}`);
                cell.classList.add('active-shift');
            }
        }, r * 200);
    }
    
    setTimeout(() => {
        aesState = newState;
        renderAESGrid();
        // Highlight shifted
        for (let r = 1; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                document.getElementById(`aes-cell-${r}-${c}`).classList.add('active-shift');
            }
        }
    }, 900);

    log.innerHTML = `
        <div class="space-y-1">
            <p class="font-semibold text-blue-600 dark:text-blue-400">Operation: ShiftRows (Diffusion)</p>
            <p class="text-xs">Bytes in the last three rows of the State are cyclically shifted to the left by offset steps:</p>
            <ul class="list-disc ml-5 text-xs">
                <li>Row 0: Shifted 0 positions</li>
                <li>Row 1: Shifted 1 position</li>
                <li>Row 2: Shifted 2 positions</li>
                <li>Row 3: Shifted 3 positions</li>
            </ul>
        </div>
    `;
}

// AES MixColumns Simulation
function triggerAESMixColumns() {
    clearAESClasses();
    const log = document.getElementById('aes-log');
    
    // Perform simplified mixing operation to simulate multiplication in GF(2^8)
    // To make it interesting, we XOR rows with adjacent row bytes
    const newState = [...aesState];
    
    for (let c = 0; c < 4; c++) {
        setTimeout(() => {
            // Highlight column
            for (let r = 0; r < 4; r++) {
                document.getElementById(`aes-cell-${r}-${c}`).classList.add('active-mix');
            }
            
            // Mix equations column-major:
            const s0 = aesState[0 + c * 4];
            const s1 = aesState[1 + c * 4];
            const s2 = aesState[2 + c * 4];
            const s3 = aesState[3 + c * 4];
            
            // Simplified GF(2^8) mix matrix multiplication
            newState[0 + c * 4] = ((s0 * 2) ^ (s1 * 3) ^ s2 ^ s3) % 256;
            newState[1 + c * 4] = (s0 ^ (s1 * 2) ^ (s2 * 3) ^ s3) % 256;
            newState[2 + c * 4] = (s0 ^ s1 ^ (s2 * 2) ^ (s3 * 3)) % 256;
            newState[3 + c * 4] = ((s0 * 3) ^ s1 ^ s2 ^ (s2 * 2)) % 256;
            
            // Update cells
            for (let r = 0; r < 4; r++) {
                const idx = r + c * 4;
                const hexStr = newState[idx].toString(16).toUpperCase().padStart(2, '0');
                const asciiChar = newState[idx] >= 32 && newState[idx] <= 126 ? String.fromCharCode(newState[idx]) : '.';
                document.getElementById(`aes-cell-${r}-${c}`).innerHTML = `
                    <span class="text-sm font-bold text-white">${hexStr}</span>
                    <span class="text-[10px] text-emerald-100">${asciiChar}</span>
                `;
            }
        }, c * 250);
    }
    
    setTimeout(() => {
        aesState = newState;
    }, 1100);

    log.innerHTML = `
        <div class="space-y-1">
            <p class="font-semibold text-emerald-600 dark:text-emerald-400">Operation: MixColumns (Diffusion)</p>
            <p class="text-xs">Each column of the State is treated as a polynomial over Galois Field \\(GF(2^8)\\) and multiplied modulo \\(x^4 + 1\\) with a fixed polynomial. Together with ShiftRows, this ensures every bit of the output ciphertext depends on every bit of the input plaintext after a few rounds.</p>
        </div>
    `;
}

// AES AddRoundKey Simulation
function triggerAESAddRoundKey() {
    clearAESClasses();
    const log = document.getElementById('aes-log');
    
    // XOR key (simple sequence)
    const roundKey = [0x54, 0x68, 0x65, 0x53, 0x65, 0x63, 0x72, 0x65, 0x74, 0x4B, 0x65, 0x79, 0x31, 0x32, 0x33, 0x34]; // "TheSecretKey1234"
    
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            const idx = r + c * 4;
            const cell = document.getElementById(`aes-cell-${r}-${c}`);
            
            setTimeout(() => {
                cell.classList.add('active-key');
                aesState[idx] = aesState[idx] ^ roundKey[idx];
                
                const hexStr = aesState[idx].toString(16).toUpperCase().padStart(2, '0');
                const asciiChar = aesState[idx] >= 32 && aesState[idx] <= 126 ? String.fromCharCode(aesState[idx]) : '.';
                cell.innerHTML = `
                    <span class="text-sm font-bold text-white">${hexStr}</span>
                    <span class="text-[10px] text-purple-200">${asciiChar}</span>
                `;
            }, (r + c) * 100);
        }
    }
    
    log.innerHTML = `
        <div class="space-y-1">
            <p class="font-semibold text-purple-600 dark:text-purple-400">Operation: AddRoundKey (XOR)</p>
            <p class="text-xs">A Round Key is applied to the State by a simple bitwise <b>XOR (\\(\\oplus\\))</b> operation. In this visualizer, the state is XORed with a 128-bit key derived from the key schedule.</p>
            <p class="text-xs font-mono mt-1 bg-slate-100 dark:bg-slate-800 p-1 rounded">Example: State Byte \\(\\oplus\\) Key Byte = Output Cipher Byte</p>
        </div>
    `;
}

function clearAESClasses() {
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            const cell = document.getElementById(`aes-cell-${r}-${c}`);
            if (cell) {
                cell.className = 'aes-cell border theme-border p-3 flex flex-col items-center justify-center font-mono rounded bg-white dark:bg-slate-800 transition-all duration-300';
            }
        }
    }
}

// ----------------------------------------------------
// 2. PKI Flow Animator
// ----------------------------------------------------
let pkiStep = 0;
const pkiSteps = [
    {
        desc: "Alice generates a public/private key pair. She submits a Certificate Signing Request (CSR) with her identity and public key to the Certificate Authority (CA).",
        activeNodes: ["pki-alice", "pki-ca"],
        msg: "CSR (Alice's Public Key + Identity)",
        msgFrom: "pki-alice",
        msgTo: "pki-ca"
    },
    {
        desc: "The CA verifies Alice's identity (via Registration Authority processes) and encrypts a hash of Alice's public info with the CA's private key. This forms the CA's signature. The CA sends the signed SSL Certificate back to Alice.",
        activeNodes: ["pki-ca", "pki-alice"],
        msg: "SSL Certificate (Signed by CA)",
        msgFrom: "pki-ca",
        msgTo: "pki-alice"
    },
    {
        desc: "Alice configures her server with the SSL Certificate. Her public website now hosts the certificate for all connecting clients to fetch.",
        activeNodes: ["pki-alice", "pki-server"],
        msg: "Bind Cert to Server",
        msgFrom: "pki-alice",
        msgTo: "pki-server"
    },
    {
        desc: "Bob requests a secure connection to the server. The server sends its certificate. Bob checks his built-in browser database of trusted CA root certificates and verifies the CA's signature using the CA's public key.",
        activeNodes: ["pki-server", "pki-bob"],
        msg: "Fetch Website & SSL Certificate",
        msgFrom: "pki-server",
        msgTo: "pki-bob"
    },
    {
        desc: "Once verified, Bob generates a symmetric session key, encrypts it with Alice's public key (retrieved from her certificate), and sends it to the server. Alice decrypts it with her private key, setting up the secure HTTPS channel.",
        activeNodes: ["pki-bob", "pki-server"],
        msg: "Encrypted Symmetric Session Key",
        msgFrom: "pki-bob",
        msgTo: "pki-server"
    }
];

function initPKIFlow() {
    updatePKIFlowUI();
}

function nextPKIStep() {
    pkiStep = (pkiStep + 1) % pkiSteps.length;
    updatePKIFlowUI();
}

function prevPKIStep() {
    pkiStep = (pkiStep - 1 + pkiSteps.length) % pkiSteps.length;
    updatePKIFlowUI();
}

function updatePKIFlowUI() {
    const stepData = pkiSteps[pkiStep];
    
    // Update step numbers & description
    const descText = document.getElementById('pki-desc');
    const stepNumText = document.getElementById('pki-step-num');
    
    if (descText) descText.textContent = stepData.desc;
    if (stepNumText) stepNumText.textContent = `Step ${pkiStep + 1} of ${pkiSteps.length}`;
    
    // Highlight active nodes
    const nodes = ["pki-alice", "pki-ca", "pki-bob", "pki-server"];
    nodes.forEach(nodeId => {
        const el = document.getElementById(nodeId);
        if (el) {
            if (stepData.activeNodes.includes(nodeId)) {
                el.classList.add('active-node', 'bg-blue-50', 'dark:bg-blue-950/20');
            } else {
                el.classList.remove('active-node', 'bg-blue-50', 'dark:bg-blue-950/20');
            }
        }
    });

    // Render message flying animation description
    const msgEl = document.getElementById('pki-message-box');
    if (msgEl) {
        msgEl.innerHTML = `
            <div class="px-3 py-1 bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-mono text-[10px] rounded border border-amber-200 border-dashed inline-block animate-pulse">
                📨 ${stepData.msg}
            </div>
        `;
    }
}
