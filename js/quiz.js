// HTCS401 Mock Exam Quiz Controller

const QUIZ_QUESTIONS = [
    {
        q: "What does Claude Shannon's Information Entropy \\(H(X)\\) measure?",
        options: [
            "The transmission bandwidth of a fiber optic cable",
            "The average amount of uncertainty or surprise in a source",
            "The strength of an AES-256 encryption key",
            "The absolute speed of electronic packet delivery"
        ],
        answer: 1,
        explanation: "Shannon's entropy measures the average uncertainty, unpredictability, or information content produced by a random source. In security, higher entropy implies greater unpredictability (harder-to-guess keys/passwords)."
    },
    {
        q: "In Shannon's General Communication System model, which component is directly affected by the 'Noise Source'?",
        options: [
            "Information Source",
            "Transmitter (Encryption)",
            "Receiver (Decryption)",
            "Channel"
        ],
        answer: 3,
        explanation: "Noise represents external interference or distortion (and in cyber security, potential attackers or active interceptors) that directly affects the signal passing through the transmission Channel."
    },
    {
        q: "Which probability distribution is best suited for modeling skewed, multiplicative financial losses from mega-breaches?",
        options: [
            "Poisson Distribution",
            "Binomial Distribution",
            "Lognormal Distribution",
            "Normal (Gaussian) Distribution"
        ],
        answer: 2,
        explanation: "Financial losses from cyber breaches are non-negative and scale multiplicatively (e.g., recovery costs multiplied by fines, multiplied by reputational churn). The heavy-tailed Lognormal distribution is ideal for capturing these rare but high-magnitude 'fat-tail' events."
    },
    {
        q: "For a message with 4 data bits (\\(m=4\\)), what is the minimum number of redundant bits (\\(r\\)) required to encode a Hamming Code?",
        options: [
            "2 bits",
            "3 bits",
            "4 bits",
            "5 bits"
        ],
        answer: 1,
        explanation: "Using the Hamming relation: \\(2^r \\ge m + r + 1\\). For \\(m=4\\), if we check \\(r=3\\): \\(2^3 = 8 \\ge 4 + 3 + 1 = 8\\). The condition is satisfied, so a minimum of 3 redundant parity bits are required."
    },
    {
        q: "In a standard (7,4) Hamming Code with parity positions at 1, 2, and 4, which data bits are checked by Parity Bit \\(P_1\\)?",
        options: [
            "Data Bits at positions 3, 5, 7",
            "Data Bits at positions 3, 6, 7",
            "Data Bits at positions 5, 6, 7",
            "Data Bits at positions 2, 4, 6"
        ],
        answer: 0,
        explanation: "Parity bit \\(P_1\\) (position 1) checks all bit positions whose binary representation has the least significant bit set to 1 (odd positions: 1, 3, 5, 7). Position 1 is the parity bit itself, so it checks data bits at positions 3, 5, and 7."
    },
    {
        q: "What is the block size of the Advanced Encryption Standard (AES)?",
        options: [
            "64 bits",
            "128 bits",
            "192 bits",
            "256 bits"
        ],
        answer: 1,
        explanation: "Regardless of the key size selected (128, 192, or 256 bits), AES is a block cipher that operates on a fixed data block size of 128 bits (represented as a 4x4 matrix of bytes)."
    },
    {
        q: "Which AES round transformation provides confusion by replacing each byte of the state with another using a lookup table?",
        options: [
            "ShiftRows",
            "MixColumns",
            "SubBytes",
            "AddRoundKey"
        ],
        answer: 2,
        explanation: "SubBytes performs a byte-by-byte substitution using a non-linear Rijndael S-Box lookup table. This step provides the cryptographic property of confusion (masking the relationship between plaintext and key)."
    },
    {
        q: "How many round transformations are executed for AES-256?",
        options: [
            "10 Rounds",
            "12 Rounds",
            "14 Rounds",
            "16 Rounds"
        ],
        answer: 2,
        explanation: "The number of rounds in AES depends on the key size: AES-128 executes 10 rounds, AES-192 executes 12 rounds, and AES-256 executes 14 rounds."
    },
    {
        q: "In a Diffie-Hellman exchange with prime \\(p=23\\) and generator \\(g=5\\), if Alice's private key is \\(a=6\\), what is her public value \\(A\\)?",
        options: [
            "A = 4",
            "A = 8",
            "A = 9",
            "A = 12"
        ],
        answer: 1,
        explanation: "Alice calculates: \\(A = g^a \\pmod p = 5^6 \\pmod{23}\\). Since \\(5^2 = 25 \\equiv 2 \\pmod{23}\\), we can compute \\(5^6 = (5^2)^3 \\equiv 2^3 = 8 \\pmod{23}\\). Therefore, her public key \\(A = 8\\)."
    },
    {
        q: "In a Shamir (3, 5) threshold scheme, how many shares are needed to successfully reconstruct the secret?",
        options: [
            "Any 2 shares",
            "Any 3 shares",
            "Any 4 shares",
            "All 5 shares"
        ],
        answer: 1,
        explanation: "In a \\((k, n)\\) threshold scheme, \\(k\\) is the threshold. Any \\(k\\) or more shares can reconstruct the secret, whereas any \\(k-1\\) or fewer shares reveal absolutely nothing. Here, \\(k=3\\), so 3 shares are needed."
    },
    {
        q: "In Shamir's threshold scheme, at what coordinate position is the secret polynomial evaluated to reconstruct the secret constant?",
        options: [
            "x = 0",
            "x = 1",
            "x = threshold (k)",
            "x = infinity"
        ],
        answer: 0,
        explanation: "The secret is placed as the constant term \\(a_0\\) in the polynomial \\(f(x) = a_0 + a_1x + a_2x^2...\\). Evaluating at \\(x=0\\) gives \\(f(0) = a_0 = S\\). Thus, Lagrange interpolation reconstructs the polynomial value at \\(x=0\\)."
    },
    {
        q: "What is the primary role of a Certificate Authority (CA) in a Public Key Infrastructure (PKI)?",
        options: [
            "Encrypting website database queries",
            "Verifying identities and signing digital certificates to bind public keys to entities",
            "Storing and protecting users' private keys",
            "Filtering incoming packets as a firewall"
        ],
        answer: 1,
        explanation: "A CA is a trusted third-party organization that validates the identity of an applicant (e.g., website domain holder) and signs a digital certificate containing their public key, guaranteeing its authenticity."
    },
    {
        q: "Which PKI component is used to query whether a certificate has been revoked before its expiration date?",
        options: [
            "Registration Authority (RA)",
            "Certificate Revocation List (CRL)",
            "Hardware Security Module (HSM)",
            "Session Key Manager"
        ],
        answer: 1,
        explanation: "A Certificate Revocation List (CRL) is a database list maintained by a CA containing certificates that have been revoked (due to private key exposure, etc.) prior to their original expiration dates."
    },
    {
        q: "Which stage of the digital forensics process focuses on creating bit-stream copies (images) of media using write-blockers to prevent modification?",
        options: [
            "Identification",
            "Preservation",
            "Analysis",
            "Documentation"
        ],
        answer: 1,
        explanation: "The Preservation phase ensures that original digital evidence is unaltered. Forensic examiners use write-blockers and create bit-stream duplicates (imaging) which are verified with cryptographic hashes (MD5/SHA256)."
    },
    {
        q: "What digital logic operator is used to perform syndrome calculations in Hamming Codes?",
        options: [
            "Logical AND",
            "Logical OR",
            "Exclusive OR (XOR)",
            "Logical NOT"
        ],
        answer: 2,
        explanation: "Hamming code parity and syndrome equations are based on modulo-2 arithmetic. In electronic circuitry, modulo-2 addition is implemented using the Exclusive OR (XOR, \\(\\oplus\\)) logical gate."
    }
];

let quizCurrentIndex = 0;
let quizAnswers = Array(QUIZ_QUESTIONS.length).fill(null);
let quizSubmitted = false;

document.addEventListener('DOMContentLoaded', () => {
    initQuiz();
});

function initQuiz() {
    renderQuizQuestion();
    updateQuizNav();
}

function renderQuizQuestion() {
    const qBox = document.getElementById('quiz-question-box');
    if (!qBox) return;

    const qData = QUIZ_QUESTIONS[quizCurrentIndex];
    const prevAnswer = quizAnswers[quizCurrentIndex];
    
    let optionsHTML = '';
    qData.options.forEach((opt, idx) => {
        let btnClass = 'w-full text-left p-3.5 border rounded-lg text-xs font-medium transition-colors ';
        
        if (quizSubmitted) {
            // Evaluated style
            if (idx === qData.answer) {
                // Correct answer
                btnClass += 'bg-green-100 border-green-400 text-green-800 dark:bg-green-950/20 dark:border-green-800 dark:text-green-300 font-semibold';
            } else if (prevAnswer === idx && prevAnswer !== qData.answer) {
                // User chose incorrect
                btnClass += 'bg-red-100 border-red-400 text-red-800 dark:bg-red-950/20 dark:border-red-800 dark:text-red-300';
            } else {
                btnClass += 'bg-white dark:bg-slate-800 theme-border opacity-60';
            }
        } else {
            // Active selection style
            if (prevAnswer === idx) {
                btnClass += 'bg-blue-100 border-blue-500 text-blue-800 dark:bg-blue-950 dark:border-blue-500 dark:text-blue-300 font-semibold';
            } else {
                btnClass += 'bg-white dark:bg-slate-800 theme-border hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer';
            }
        }

        const disabledAttr = quizSubmitted ? 'disabled' : '';
        optionsHTML += `
            <button onclick="selectQuizOption(${idx})" ${disabledAttr} class="${btnClass}">
                <span class="inline-block mr-2 font-bold">${String.fromCharCode(65 + idx)})</span> ${opt}
            </button>
        `;
    });

    let explanationHTML = '';
    if (quizSubmitted) {
        explanationHTML = `
            <div class="mt-4 p-4 alert-success rounded-lg text-xs space-y-1.5">
                <p class="font-bold">📚 Study explanation:</p>
                <p>${qData.explanation}</p>
            </div>
        `;
    }

    qBox.innerHTML = `
        <div class="space-y-4">
            <div class="flex justify-between items-center text-xs font-semibold text-slate-500">
                <span>QUESTION ${quizCurrentIndex + 1} OF ${QUIZ_QUESTIONS.length}</span>
                <span>${quizSubmitted ? 'Review Mode' : 'Practice Quiz'}</span>
            </div>
            <h3 class="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug">
                ${qData.q}
            </h3>
            <div class="grid grid-cols-1 gap-3 mt-3">
                ${optionsHTML}
            </div>
            ${explanationHTML}
        </div>
    `;

    // Typeset MathJax in quiz container
    if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([qBox]).catch(err => console.log(err));
    }
}

function selectQuizOption(optIndex) {
    if (quizSubmitted) return;
    quizAnswers[quizCurrentIndex] = optIndex;
    renderQuizQuestion();
}

function quizPrev() {
    if (quizCurrentIndex > 0) {
        quizCurrentIndex--;
        renderQuizQuestion();
        updateQuizNav();
    }
}

function quizNext() {
    if (quizCurrentIndex < QUIZ_QUESTIONS.length - 1) {
        quizCurrentIndex++;
        renderQuizQuestion();
        updateQuizNav();
    }
}

function updateQuizNav() {
    const prevBtn = document.getElementById('quiz-prev-btn');
    const nextBtn = document.getElementById('quiz-next-btn');
    const submitBtn = document.getElementById('quiz-submit-btn');
    
    if (prevBtn) prevBtn.disabled = (quizCurrentIndex === 0);
    
    if (quizCurrentIndex === QUIZ_QUESTIONS.length - 1) {
        if (nextBtn) nextBtn.classList.add('hidden');
        if (submitBtn && !quizSubmitted) submitBtn.classList.remove('hidden');
    } else {
        if (nextBtn) nextBtn.classList.remove('hidden');
        if (submitBtn) submitBtn.classList.add('hidden');
    }
}

function submitQuiz() {
    // Check if all answered
    const unanswered = quizAnswers.findIndex(ans => ans === null);
    if (unanswered !== -1 && !confirm('You have unanswered questions. Do you want to submit anyway?')) {
        return;
    }

    quizSubmitted = true;
    
    // Compute Score
    let score = 0;
    QUIZ_QUESTIONS.forEach((q, idx) => {
        if (quizAnswers[idx] === q.answer) {
            score++;
        }
    });

    const scorePct = Math.round((score / QUIZ_QUESTIONS.length) * 100);
    let feedbackMsg = '';
    if (scorePct >= 80) feedbackMsg = 'Excellent! You are fully prepared for the 10-mark questions!';
    else if (scorePct >= 50) feedbackMsg = 'Good effort! Review the blueprints and calculators to improve your score.';
    else feedbackMsg = 'Study the blueprints and retry the interactive visualizers to master these units.';

    // Hide controls
    const navBar = document.getElementById('quiz-nav-controls');
    if (navBar) navBar.classList.add('hidden');
    
    const submitBtn = document.getElementById('quiz-submit-btn');
    if (submitBtn) submitBtn.classList.add('hidden');

    const resultBox = document.getElementById('quiz-results-box');
    if (resultBox) {
        resultBox.innerHTML = `
            <div class="alert-success p-6 rounded-lg text-center space-y-4">
                <span class="text-4xl">🏆</span>
                <h4 class="text-lg font-bold">Quiz Results Submitted!</h4>
                <div class="text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">
                    ${score} / ${QUIZ_QUESTIONS.length}
                </div>
                <p class="text-xs text-slate-600 dark:text-slate-300 font-medium max-w-md mx-auto">
                    Percentage: <b>${scorePct}%</b><br>
                    ${feedbackMsg}
                </p>
                <div class="flex justify-center gap-3 pt-2">
                    <button onclick="reviewQuizAnswers()" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-xs transition-colors">Review Questions</button>
                    <button onclick="resetQuiz()" class="bg-slate-500 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded text-xs transition-colors">Retake Quiz</button>
                </div>
            </div>
        `;
        resultBox.classList.remove('hidden');
        document.getElementById('quiz-question-box').classList.add('hidden');
    }
}

function reviewQuizAnswers() {
    // Hide results box, show question box, and bring back navigation
    document.getElementById('quiz-results-box').classList.add('hidden');
    document.getElementById('quiz-question-box').classList.remove('hidden');
    
    const navBar = document.getElementById('quiz-nav-controls');
    if (navBar) navBar.classList.remove('hidden');
    
    // Go to first question
    quizCurrentIndex = 0;
    renderQuizQuestion();
    updateQuizNav();
    
    // Add a reset button to nav bar if not already present
    let resetContainer = document.getElementById('quiz-review-reset-container');
    if (!resetContainer) {
        resetContainer = document.createElement('div');
        resetContainer.id = 'quiz-review-reset-container';
        resetContainer.className = 'mt-4 flex justify-center';
        resetContainer.innerHTML = `
            <button onclick="resetQuiz()" class="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded text-xs transition-colors">
                Reset & Retake Quiz
            </button>
        `;
        document.getElementById('quiz-section-container').appendChild(resetContainer);
    }
}

function resetQuiz() {
    quizCurrentIndex = 0;
    quizAnswers = Array(QUIZ_QUESTIONS.length).fill(null);
    quizSubmitted = false;

    // Reset UI visibility
    document.getElementById('quiz-results-box').classList.add('hidden');
    document.getElementById('quiz-question-box').classList.remove('hidden');
    
    const navBar = document.getElementById('quiz-nav-controls');
    if (navBar) navBar.classList.remove('hidden');
    
    const reviewReset = document.getElementById('quiz-review-reset-container');
    if (reviewReset) reviewReset.remove();

    initQuiz();
}
