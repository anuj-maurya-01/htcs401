// HTCS401 Interactive Mathematics Engine

// Helper: Factorial
function factorial(num) {
    if (num < 0) return 1;
    let rval = 1;
    for (let i = 2; i <= num; i++) rval = rval * i;
    return rval;
}

// Helper: Combinations nCr
function nCr(n, r) {
    if (r < 0 || r > n) return 0;
    return Math.round(factorial(n) / (factorial(r) * factorial(n - r)));
}

// Helper: Modular Exponentiation (base^exp % mod)
function modPow(base, exp, mod) {
    let res = 1;
    base = base % mod;
    while (exp > 0) {
        if (exp % 2 === 1) res = (res * base) % mod;
        base = (base * base) % mod;
        exp = Math.floor(exp / 2);
    }
    return res;
}

// Helper: Check Primality
function isPrime(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
}

// ----------------------------------------------------
// 1. Shannon Entropy Calculator
// ----------------------------------------------------
function calculateEntropy() {
    const inputType = document.getElementById('entropy-input-type').value;
    let probabilities = [];
    let breakdownHTML = '';
    let totalEntropy = 0;

    if (inputType === 'text') {
        const text = document.getElementById('entropy-text-input').value;
        if (!text) {
            alert('Please enter some text!');
            return;
        }

        const frequencies = {};
        const len = text.length;

        // Count frequencies
        for (let i = 0; i < len; i++) {
            const char = text[i];
            frequencies[char] = (frequencies[char] || 0) + 1;
        }

        breakdownHTML += `<p class="mb-3 text-sm font-semibold">Length of text: ${len} characters. Unique characters: ${Object.keys(frequencies).length}</p>`;
        breakdownHTML += `
            <table class="w-full calc-table text-left text-xs mb-4">
                <thead>
                    <tr>
                        <th class="p-2 border">Symbol</th>
                        <th class="p-2 border">Count</th>
                        <th class="p-2 border">Probability \\(p_i\\)</th>
                        <th class="p-2 border">\\(-p_i \\log_2(p_i)\\)</th>
                    </tr>
                </thead>
                <tbody>
        `;

        for (const char in frequencies) {
            const count = frequencies[char];
            const p = count / len;
            const term = -p * Math.log2(p);
            totalEntropy += term;
            const displayChar = char === ' ' ? 'Space' : char;

            breakdownHTML += `
                <tr>
                    <td class="p-2 border font-mono">${displayChar}</td>
                    <td class="p-2 border">${count}</td>
                    <td class="p-2 border">${p.toFixed(4)}</td>
                    <td class="p-2 border">${term.toFixed(4)}</td>
                </tr>
            `;
        }
        breakdownHTML += `</tbody></table>`;
    } else {
        const probsStr = document.getElementById('entropy-probs-input').value;
        if (!probsStr) {
            alert('Please enter probabilities!');
            return;
        }

        const parts = probsStr.split(',').map(s => parseFloat(s.trim()));
        const sum = parts.reduce((a, b) => a + b, 0);

        if (parts.some(isNaN) || parts.some(p => p < 0 || p > 1)) {
            alert('Please enter valid probabilities between 0 and 1.');
            return;
        }

        if (Math.abs(sum - 1.0) > 0.02) {
            breakdownHTML += `<div class="alert-warning p-3 rounded mb-3 text-xs"><b>Warning:</b> Probabilities sum to ${sum.toFixed(4)} (must sum to approximately 1.0). Normalizing for calculations.</div>`;
        }

        breakdownHTML += `
            <table class="w-full calc-table text-left text-xs mb-4">
                <thead>
                    <tr>
                        <th class="p-2 border">Symbol</th>
                        <th class="p-2 border">Given \\(p_i\\)</th>
                        <th class="p-2 border">Normalized \\(p'_i\\)</th>
                        <th class="p-2 border">\\(-p'_i \\log_2(p'_i)\\)</th>
                    </tr>
                </thead>
                <tbody>
        `;

        parts.forEach((p, idx) => {
            const pNorm = p / sum;
            const term = -pNorm * Math.log2(pNorm);
            totalEntropy += term;
            breakdownHTML += `
                <tr>
                    <td class="p-2 border">\\(X_{${idx + 1}}\\)</td>
                    <td class="p-2 border">${p.toFixed(4)}</td>
                    <td class="p-2 border">${pNorm.toFixed(4)}</td>
                    <td class="p-2 border">${term.toFixed(4)}</td>
                </tr>
            `;
        });
        breakdownHTML += `</tbody></table>`;
    }

    const outputContainer = document.getElementById('entropy-output');
    outputContainer.innerHTML = `
        <div class="alert-success p-4 rounded-lg">
            <h4 class="font-bold text-sm mb-2">Calculation Results</h4>
            ${breakdownHTML}
            <div class="mt-4 p-3 bg-white dark:bg-slate-800 rounded border theme-border font-mono text-center">
                <span class="text-xs text-slate-500 font-bold block">SHANNON ENTROPY H(X)</span>
                <span class="text-2xl font-bold text-blue-600 dark:text-blue-400">${totalEntropy.toFixed(5)} bits/symbol</span>
            </div>
        </div>
    `;

    // Typeset formulas in output
    if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([outputContainer]);
    }
}

// Toggle Entropy Input Fields
function toggleEntropyInputs() {
    const type = document.getElementById('entropy-input-type').value;
    const textGroup = document.getElementById('entropy-text-group');
    const probsGroup = document.getElementById('entropy-probs-group');

    if (type === 'text') {
        textGroup.classList.remove('hidden');
        probsGroup.classList.add('hidden');
    } else {
        textGroup.classList.add('hidden');
        probsGroup.classList.remove('hidden');
    }
}

// ----------------------------------------------------
// 2. Probability Distributions Calculator
// ----------------------------------------------------
function calculateDistributions() {
    const type = document.getElementById('dist-type').value;
    const resultBox = document.getElementById('dist-output');
    let outputHTML = '';

    if (type === 'binomial') {
        const n = parseInt(document.getElementById('binom-n').value);
        const p = parseFloat(document.getElementById('binom-p').value);
        const k = parseInt(document.getElementById('binom-k').value);

        if (isNaN(n) || isNaN(p) || isNaN(k) || n < 0 || p < 0 || p > 1 || k < 0 || k > n) {
            alert('Invalid values! Ensure \\(0 \\le k \\le n\\) and \\(0 \\le p \\le 1\\).');
            return;
        }

        const comb = nCr(n, k);
        const pk = Math.pow(p, k);
        const qnk = Math.pow(1 - p, n - k);
        const prob = comb * pk * qnk;

        outputHTML = `
            <div class="alert-success p-4 rounded-lg space-y-3">
                <h4 class="font-bold text-sm mb-2">Binomial Distribution Step-by-Step</h4>
                <div class="text-xs space-y-1">
                    <p><b>Formula:</b> \\(P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}\\)</p>
                    <p><b>Step 1: Calculate Combinations</b></p>
                    <p class="font-mono bg-white dark:bg-slate-800 p-2 rounded">
                        \\(\\binom{${n}}{${k}} = \\frac{${n}!}{${k}!(${n}-${k})!} = ${comb}\\)
                    </p>
                    <p><b>Step 2: Calculate Powers</b></p>
                    <p class="font-mono bg-white dark:bg-slate-800 p-2 rounded">
                        \\(p^k = ${p}^{${k}} = ${pk.toFixed(6)}\\)<br>
                        \\((1-p)^{n-k} = (1-${p})^{${n - k}} = ${(1 - p).toFixed(4)}^{${n - k}} = ${qnk.toFixed(6)}\\)
                    </p>
                    <p><b>Step 3: Combine Terms</b></p>
                    <p class="font-mono bg-white dark:bg-slate-800 p-2 rounded">
                        \\(P(X = ${k}) = ${comb} \\times ${pk.toFixed(6)} \\times ${qnk.toFixed(6)} = ${prob.toFixed(8)}\\)
                    </p>
                </div>
                <div class="mt-4 p-3 bg-white dark:bg-slate-800 rounded border theme-border font-mono text-center">
                    <span class="text-xs text-slate-500 font-bold block">P(X = ${k})</span>
                    <span class="text-xl font-bold text-blue-600 dark:text-blue-400">${(prob * 100).toFixed(4)}% (${prob.toFixed(8)})</span>
                </div>
            </div>
        `;
    } else if (type === 'poisson') {
        const lambda = parseFloat(document.getElementById('poiss-lambda').value);
        const k = parseInt(document.getElementById('poiss-k').value);

        if (isNaN(lambda) || isNaN(k) || lambda <= 0 || k < 0) {
            alert('Invalid values! Ensure \\(\\lambda > 0\\) and \\(k \\ge 0\\).');
            return;
        }

        const expL = Math.exp(-lambda);
        const lambK = Math.pow(lambda, k);
        const factK = factorial(k);
        const prob = (expL * lambK) / factK;

        outputHTML = `
            <div class="alert-success p-4 rounded-lg space-y-3">
                <h4 class="font-bold text-sm mb-2">Poisson Distribution Step-by-Step</h4>
                <div class="text-xs space-y-1">
                    <p><b>Formula:</b> \\(P(X = k) = \\frac{e^{-\\lambda} \\lambda^k}{k!}\\)</p>
                    <p><b>Step 1: Calculate \\(e^{-\\lambda}\\)</b></p>
                    <p class="font-mono bg-white dark:bg-slate-800 p-2 rounded">
                        \\(e^{-${lambda}} = ${expL.toFixed(8)}\\)
                    </p>
                    <p><b>Step 2: Calculate \\(\\lambda^k\\)</b></p>
                    <p class="font-mono bg-white dark:bg-slate-800 p-2 rounded">
                        \\(${lambda}^{${k}} = ${lambK.toFixed(8)}\\)
                    </p>
                    <p><b>Step 3: Calculate \\(k!\\)</b></p>
                    <p class="font-mono bg-white dark:bg-slate-800 p-2 rounded">
                        \\(${k}! = ${factK}\\)
                    </p>
                    <p><b>Step 4: Combine Terms</b></p>
                    <p class="font-mono bg-white dark:bg-slate-800 p-2 rounded">
                        \\(P(X = ${k}) = \\frac{${expL.toFixed(8)} \\times ${lambK.toFixed(8)}}{${factK}} = ${prob.toFixed(8)}\\)
                    </p>
                </div>
                <div class="mt-4 p-3 bg-white dark:bg-slate-800 rounded border theme-border font-mono text-center">
                    <span class="text-xs text-slate-500 font-bold block">P(X = ${k})</span>
                    <span class="text-xl font-bold text-blue-600 dark:text-blue-400">${(prob * 100).toFixed(4)}% (${prob.toFixed(8)})</span>
                </div>
            </div>
        `;
    }

    resultBox.innerHTML = outputHTML;
    if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([resultBox]);
    }
}

function toggleDistInputs() {
    const type = document.getElementById('dist-type').value;
    const binomGroup = document.getElementById('binom-group');
    const poissGroup = document.getElementById('poiss-group');

    if (type === 'binomial') {
        binomGroup.classList.remove('hidden');
        poissGroup.classList.add('hidden');
    } else {
        binomGroup.classList.add('hidden');
        poissGroup.classList.remove('hidden');
    }
}

// ----------------------------------------------------
// 3. Hamming Code (7, 4) Engine
// ----------------------------------------------------
function runHammingEncoder() {
    const inputStr = document.getElementById('hamming-encode-input').value;
    if (!/^[01]{4}$/.test(inputStr)) {
        alert('Please enter exactly 4 binary bits (e.g. 1101)');
        return;
    }

    const d = inputStr.split('').map(Number);
    // Data bits mapping: d[0]=D3, d[1]=D5, d[2]=D6, d[3]=D7
    const d3 = d[0];
    const d5 = d[1];
    const d6 = d[2];
    const d7 = d[3];

    // Parity calculation (Even Parity)
    const p1 = d3 ^ d5 ^ d7;
    const p2 = d3 ^ d6 ^ d7;
    const p4 = d5 ^ d6 ^ d7;

    const codeword = [p1, p2, d3, p4, d5, d6, d7];

    const outBox = document.getElementById('hamming-encode-output');
    outBox.innerHTML = `
        <div class="alert-success p-4 rounded-lg space-y-3">
            <h4 class="font-bold text-sm">Codeword Generation (Even Parity)</h4>
            <div class="text-xs space-y-2">
                <p><b>Step 1: Define Bits</b><br>
                Data Bits: \\(D_3 = ${d3}, D_5 = ${d5}, D_6 = ${d6}, D_7 = ${d7}\\)
                </p>
                <p><b>Step 2: Solve Parities (XOR Operations)</b><br>
                \\(P_1 = D_3 \\oplus D_5 \\oplus D_7 = ${d3} \\oplus ${d5} \\oplus ${d7} = ${p1}\\)<br>
                \\(P_2 = D_3 \\oplus D_6 \\oplus D_7 = ${d3} \\oplus ${d6} \\oplus ${d7} = ${p2}\\)<br>
                \\(P_4 = D_5 \\oplus D_6 \\oplus D_7 = ${d5} \\oplus ${d6} \\oplus ${d7} = ${p4}\\)
                </p>
                
                <p><b>Step 3: Construct the Codeword Table</b></p>
                <table class="w-full text-center border-collapse calc-table mt-1">
                    <thead>
                        <tr class="bg-slate-100 dark:bg-slate-800 text-[10px]">
                            <th class="p-1.5 border">7</th>
                            <th class="p-1.5 border">6</th>
                            <th class="p-1.5 border">5</th>
                            <th class="p-1.5 border">4 (P4)</th>
                            <th class="p-1.5 border">3</th>
                            <th class="p-1.5 border">2 (P2)</th>
                            <th class="p-1.5 border">1 (P1)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="p-2 border font-bold text-blue-600 dark:text-blue-400">${d7}</td>
                            <td class="p-2 border font-bold text-blue-600 dark:text-blue-400">${d6}</td>
                            <td class="p-2 border font-bold text-blue-600 dark:text-blue-400">${d5}</td>
                            <td class="p-2 border bg-amber-50 dark:bg-amber-950/20 font-bold text-yellow-600">${p4}</td>
                            <td class="p-2 border font-bold text-blue-600 dark:text-blue-400">${d3}</td>
                            <td class="p-2 border bg-amber-50 dark:bg-amber-950/20 font-bold text-yellow-600">${p2}</td>
                            <td class="p-2 border bg-amber-50 dark:bg-amber-950/20 font-bold text-yellow-600">${p1}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="mt-4 p-3 bg-white dark:bg-slate-800 rounded border theme-border font-mono text-center">
                <span class="text-xs text-slate-500 font-bold block">7-BIT CODEWORD</span>
                <span class="text-2xl font-bold text-green-600 dark:text-green-400 tracking-widest">${codeword.join('')}</span>
            </div>
        </div>
    `;

    if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([outBox]);
    }

    // Auto-populate the decoder input to ease user testing
    document.getElementById('hamming-decode-input').value = codeword.join('');
}

function runHammingDecoder() {
    const inputStr = document.getElementById('hamming-decode-input').value;
    if (!/^[01]{7}$/.test(inputStr)) {
        alert('Please enter exactly 7 binary bits (e.g. 1100110)');
        return;
    }

    const c = inputStr.split('').map(Number);
    // Codeword indexing matches positions 1 to 7:
    // c[0]=C1, c[1]=C2, c[2]=C3, c[3]=C4, c[4]=C5, c[5]=C6, c[6]=C7
    // Let's reverse to make 1-based index simple:
    // pos[1]=C1, pos[2]=C2, pos[3]=C3, pos[4]=C4, pos[5]=C5, pos[6]=C6, pos[7]=C7
    const c1 = c[6];
    const c2 = c[5];
    const c3 = c[4];
    const c4 = c[3];
    const c5 = c[2];
    const c6 = c[1];
    const c7 = c[0];

    // Compute Syndromes
    const s1 = c1 ^ c3 ^ c5 ^ c7;
    const s2 = c2 ^ c3 ^ c6 ^ c7;
    const s4 = c4 ^ c5 ^ c6 ^ c7;

    const errorPos = (s4 * 4) + (s2 * 2) + s1;
    let correctionHTML = '';
    let correctedCodeword = [...c];

    if (errorPos === 0) {
        correctionHTML = `<div class="alert-success p-3 rounded text-xs font-semibold">No error detected! The codeword is valid.</div>`;
    } else {
        // Correct the errored index (remember index mapping: 1-based errorPos is at index (7 - errorPos))
        const errorIdx = 7 - errorPos;
        correctedCodeword[errorIdx] = correctedCodeword[errorIdx] ^ 1;
        
        correctionHTML = `
            <div class="alert-danger p-3 rounded text-xs">
                <p><b>Error Detected!</b> Syndrome sum is non-zero.</p>
                <p class="font-bold">Error Position: Bit ${errorPos}</p>
                <p>Flipped Bit ${errorPos} from <b>${c[errorIdx]}</b> to <b>${correctedCodeword[errorIdx]}</b>.</p>
            </div>
        `;
    }

    // Extract correct data bits: position 3, 5, 6, 7
    // Which correspond to corrected indices: 4, 2, 1, 0 (or from reverse index: 3, 5, 6, 7)
    const correctedC7 = correctedCodeword[0];
    const correctedC6 = correctedCodeword[1];
    const correctedC5 = correctedCodeword[2];
    const correctedC3 = correctedCodeword[4];
    const dataWord = `${correctedC3}${correctedC5}${correctedC6}${correctedC7}`;

    const outBox = document.getElementById('hamming-decode-output');
    outBox.innerHTML = `
        <div class="alert-success p-4 rounded-lg space-y-3">
            <h4 class="font-bold text-sm">Syndrome Calculations & Decoding</h4>
            <div class="text-xs space-y-2">
                <p><b>Step 1: Calculate Syndromes (XOR checks)</b><br>
                \\(S_1 = C_1 \\oplus C_3 \\oplus C_5 \\oplus C_7 = ${c1} \\oplus ${c3} \\oplus ${c5} \\oplus ${c7} = ${s1}\\)<br>
                \\(S_2 = C_2 \\oplus C_3 \\oplus C_6 \\oplus C_7 = ${c2} \\oplus ${c3} \\oplus ${c6} \\oplus ${c7} = ${s2}\\)<br>
                \\(S_4 = C_4 \\oplus C_5 \\oplus C_6 \\oplus C_7 = ${c4} \\oplus ${c5} \\oplus ${c6} \\oplus ${c7} = ${s4}\\)
                </p>
                <p><b>Step 2: Compute Error Index</b><br>
                \\(E = S_4 S_2 S_1 = (${s4}${s2}${s1})_2 = ${errorPos}\\) (Base 10)
                </p>
                ${correctionHTML}
                
                <p class="mt-2"><b>Step 3: Extract Corrected Data bits (Positions 3, 5, 6, 7)</b></p>
                <div class="grid grid-cols-4 gap-2 text-center max-w-xs font-mono font-bold mt-1">
                    <div class="bg-blue-50 dark:bg-slate-800 p-1 border rounded">C3: ${correctedC3}</div>
                    <div class="bg-blue-50 dark:bg-slate-800 p-1 border rounded">C5: ${correctedC5}</div>
                    <div class="bg-blue-50 dark:bg-slate-800 p-1 border rounded">C6: ${correctedC6}</div>
                    <div class="bg-blue-50 dark:bg-slate-800 p-1 border rounded">C7: ${correctedC7}</div>
                </div>
            </div>
            <div class="mt-4 p-3 bg-white dark:bg-slate-800 rounded border theme-border font-mono text-center">
                <span class="text-xs text-slate-500 font-bold block">EXTRACTED 4-BIT DATA</span>
                <span class="text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-widest">${dataWord}</span>
            </div>
        </div>
    `;

    if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([outBox]);
    }
}

// ----------------------------------------------------
// 4. Diffie-Hellman Key Exchange Simulator
// ----------------------------------------------------
function runDiffieHellman() {
    const p = parseInt(document.getElementById('dh-p').value);
    const g = parseInt(document.getElementById('dh-g').value);
    const a = parseInt(document.getElementById('dh-a').value);
    const b = parseInt(document.getElementById('dh-b').value);

    if (isNaN(p) || isNaN(g) || isNaN(a) || isNaN(b) || p <= 1 || g <= 0 || a <= 0 || b <= 0) {
        alert('Please fill out all fields with valid positive integers.');
        return;
    }

    if (!isPrime(p)) {
        alert('Warning: Parameters require p to be a prime number. Exponentiation will still run but cryptography is compromised.');
    }

    if (a >= p || b >= p) {
        alert('Recommendation: Keep private keys smaller than p to speed up calculation.');
    }

    // Calculations
    const A = modPow(g, a, p); // A = g^a mod p
    const B = modPow(g, b, p); // B = g^b mod p
    const sA = modPow(B, a, p); // s = B^a mod p
    const sB = modPow(A, b, p); // s = A^b mod p

    const outBox = document.getElementById('dh-output');
    outBox.innerHTML = `
        <div class="alert-success p-4 rounded-lg space-y-4">
            <h4 class="font-bold text-sm">Modular Exponentiation Computations</h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-white dark:bg-slate-800 p-3 rounded border theme-border space-y-2 text-xs">
                    <h5 class="font-bold text-blue-600 dark:text-blue-400">Alice (Private Key: a = ${a})</h5>
                    <p><b>1. Compute Public Key (A):</b><br>
                    \\(A = g^a \\pmod p\\)<br>
                    \\(A = ${g}^{${a}} \\pmod{${p}} = ${A}\\)
                    </p>
                    <p><b>2. Compute Shared Secret (S):</b><br>
                    \\(S = B^a \\pmod p\\)<br>
                    \\(S = ${B}^{${a}} \\pmod{${p}} = ${sA}\\)
                    </p>
                </div>
                
                <div class="bg-white dark:bg-slate-800 p-3 rounded border theme-border space-y-2 text-xs">
                    <h5 class="font-bold text-blue-600 dark:text-blue-400">Bob (Private Key: b = ${b})</h5>
                    <p><b>1. Compute Public Key (B):</b><br>
                    \\(B = g^b \\pmod p\\)<br>
                    \\(B = ${g}^{${b}} \\pmod{${p}} = ${B}\\)
                    </p>
                    <p><b>2. Compute Shared Secret (S):</b><br>
                    \\(S = A^b \\pmod p\\)<br>
                    \\(S = ${A}^{${b}} \\pmod{${p}} = ${sB}\\)
                    </p>
                </div>
            </div>
            
            <div class="mt-4 p-3 bg-white dark:bg-slate-800 rounded border theme-border font-mono text-center">
                <span class="text-xs text-slate-500 font-bold block">SHARED SECRET KEY (S)</span>
                <span class="text-2xl font-bold text-green-600 dark:text-green-400">${sA}</span>
                <span class="text-[10px] text-slate-400 block mt-1">Keys match: ${sA === sB ? '✅ Yes' : '❌ No'}</span>
            </div>
        </div>
    `;

    if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([outBox]);
    }
}

// ----------------------------------------------------
// 5. Shamir's Secret Sharing Scheme Engine
// ----------------------------------------------------
let activeShares = []; // Store generated shares globally to enable interpolation

function runShamirGenerator() {
    const s = parseInt(document.getElementById('shamir-secret').value);
    const k = parseInt(document.getElementById('shamir-k').value);
    const n = parseInt(document.getElementById('shamir-n').value);

    if (isNaN(s) || isNaN(k) || isNaN(n) || k < 2 || n < k || s < 0) {
        alert('Invalid criteria! Ensure \\(2 \\le k \\le n\\) and secret \\(S \\ge 0\\).');
        return;
    }

    // Generate random coefficients a_1 ... a_{k-1}
    const coeffs = [];
    for (let i = 0; i < k - 1; i++) {
        coeffs.push(Math.floor(Math.random() * 20) + 1); // Coefficients in range 1-20
    }

    // Build the polynomial expression for display
    let polyTerms = [`${s}`];
    coeffs.forEach((c, idx) => {
        polyTerms.push(`${c}x^{${idx + 1}}`);
    });
    const polyDisplay = `f(x) = ` + polyTerms.join(' + ');

    // Calculate n shares
    activeShares = [];
    let sharesHTML = '<ul class="list-disc ml-5 space-y-1">';

    for (let x = 1; x <= n; x++) {
        let y = s;
        coeffs.forEach((c, idx) => {
            y += c * Math.pow(x, idx + 1);
        });
        activeShares.push({ x, y });
        sharesHTML += `<li>Share ${x}: <b>(${x}, ${y})</b></li>`;
    }
    sharesHTML += '</ul>';

    const outBox = document.getElementById('shamir-gen-output');
    outBox.innerHTML = `
        <div class="alert-success p-4 rounded-lg space-y-3 text-xs">
            <h4 class="font-bold text-sm">Polynomial and Shares Created</h4>
            <p><b>1. Constructed Polynomial:</b></p>
            <div class="p-2 bg-white dark:bg-slate-800 rounded font-mono text-center text-sm border theme-border">
                \\(${polyDisplay}\\)
            </div>
            <p><b>2. Generated Shares (x, y):</b></p>
            <div class="p-3 bg-white dark:bg-slate-800 rounded border theme-border font-mono">
                ${sharesHTML}
            </div>
            <div class="alert-warning p-2.5 rounded text-[11px]">
                <b>Instructions:</b> Check any ${k} shares below to reconstruct the secret using Lagrange Interpolation.
            </div>
            <div class="mt-3">
                <p class="font-bold mb-1">Select Shares for Reconstruction:</p>
                <div class="flex flex-wrap gap-3" id="share-select-container">
                    ${activeShares.map((sh, idx) => `
                        <label class="inline-flex items-center space-x-1 font-mono cursor-pointer">
                            <input type="checkbox" name="shamir-share-checkbox" value="${idx}" class="checklist-checkbox form-checkbox h-4 w-4">
                            <span>(${sh.x}, ${sh.y})</span>
                        </label>
                    `).join('')}
                </div>
            </div>
            <button onclick="runShamirReconstructor(${k})" class="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-xs transition-colors">Reconstruct Secret</button>
        </div>
    `;

    if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([outBox]);
    }
}

function runShamirReconstructor(k) {
    const checkedBoxes = document.querySelectorAll('input[name="shamir-share-checkbox"]:checked');
    const outBox = document.getElementById('shamir-recon-output');
    
    if (checkedBoxes.length !== k) {
        alert(`Please select exactly k = ${k} shares to reconstruct the secret!`);
        return;
    }

    const selectedShares = Array.from(checkedBoxes).map(cb => activeShares[parseInt(cb.value)]);
    
    // Lagrange Interpolation at x = 0
    let stepByStepHTML = '';
    let secret = 0;

    stepByStepHTML += `<p>Using coordinates: ${selectedShares.map(s => `(${s.x}, ${s.y})`).join(', ')}</p>`;
    stepByStepHTML += `<p class="font-semibold mt-2">Lagrange Terms for \\(L_j(0) = \\prod_{m \\ne j} \\frac{-x_m}{x_j - x_m}\\):</p>`;

    selectedShares.forEach((sJ, j) => {
        let num = 1;
        let den = 1;
        let numTerms = [];
        let denTerms = [];

        selectedShares.forEach((sM, m) => {
            if (m !== j) {
                num *= -sM.x;
                den *= (sJ.x - sM.x);
                numTerms.push(`(-${sM.x})`);
                denTerms.push(`(${sJ.x} - ${sM.x})`);
            }
        });

        const termRatio = num / den;
        const addend = sJ.y * termRatio;
        secret += addend;

        stepByStepHTML += `
            <div class="p-2 bg-white dark:bg-slate-800 rounded border theme-border font-mono my-2">
                \\(L_{${j + 1}}(0) = \\frac{${numTerms.join(' \\cdot ')}}{${denTerms.join(' \\cdot ')}} = \\frac{${num}}{${den}} = ${termRatio.toFixed(4)}\\)<br>
                Addend: \\(y_{${j + 1}} \\cdot L_{${j + 1}}(0) = ${sJ.y} \\cdot (${termRatio.toFixed(4)}) = ${addend.toFixed(2)}\\)
            </div>
        `;
    });

    const roundedSecret = Math.round(secret);

    outBox.innerHTML = `
        <div class="alert-success p-4 rounded-lg space-y-3 text-xs mt-4">
            <h4 class="font-bold text-sm">Lagrange Interpolation Reconstruction</h4>
            ${stepByStepHTML}
            <div class="mt-4 p-3 bg-white dark:bg-slate-800 rounded border theme-border font-mono text-center">
                <span class="text-xs text-slate-500 font-bold block">RECONSTRUCTED SECRET KEY (S)</span>
                <span class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">${roundedSecret}</span>
            </div>
        </div>
    `;

    if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([outBox]);
    }
}
