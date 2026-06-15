# 🎓 HTCS401: AKTU Exam Companion & Study Guide

An interactive, premium web application designed to help computer science and information technology students master the **HTCS401** syllabus (Information Theory, Coding, and Computer Security) for the Dr. A.P.J. Abdul Kalam Technical University (AKTU) exams. 

Deployable directly to **GitHub Pages**, this companion combines theoretical 10-mark blueprints, structural diagrams, step-by-step mathematical calculators, cryptographic visualizers, progress checkers, and mock quizzes.

---

## 🚀 Key Features

### 1. Interactive calculators & Engines
* 📊 **Shannon Entropy Calculator**: Computes symbols, frequencies, probabilities, and entropy $H(X)$ from any custom text or raw probabilities.
* 📈 **Discrete & Continuous Distribution Simulators**: Evaluates probability distributions including:
  * **Binomial Distribution**: Calculates combination states $P(X=k) = {n \choose k} p^k (1-p)^{n-k}$.
  * **Poisson Distribution**: Calculates rate events $P(X=k) = \frac{e^{-\lambda} \lambda^k}{k!}$.
* 📡 **Hamming Code (7,4) Parity Generator & Decoder**:
  * **Encoder**: Place bits, calculate parity bits $P_1, P_2, P_4$, and view the encoded 7-bit codeword.
  * **Decoder**: Introduce errors, calculate syndromes, locate parity violations, and correct single-bit errors step-by-step.
* 🔑 **Diffie-Hellman Key Exchange Simulator**: Conduct key sharing with public parameters ($p$, $g$) and private exponents ($a$, $b$) including step-by-step modular arithmetic verification.
* 🧩 **Shamir's (k, n) Threshold Scheme Engine**: Splits a secret value into $n$ parts requiring $k$ parts for reconstruction via Lagrange Polynomial Interpolation.

### 2. Guided Architectural Visualizers
* 🛡️ **AES Round Transformation Simulator**: Visualizes the internal $4 \times 4$ byte State matrix through Confusion & Diffusion operations: `SubBytes`, `ShiftRows`, `MixColumns`, and `AddRoundKey`.
* 🏛️ **PKI & Certificate Issuance Flow**: Animated step-by-step visualization of Certificate Authorities (CA), Registration Authorities (RA), and certificate validation.

### 3. Exam Success Toolkit
* 📝 **10-Mark Answer Blueprints**: Scoring advice for each major topic, detailing point breakdowns (e.g., definitions, diagrams, derivations) required to secure full marks.
* 🎯 **Exam Readiness Quiz**: Interactive 15-question mock test tracking performance and providing detailed rationale for correct answers.
* ✅ **Syllabus Checklist**: A persistent checkoff tool backed by local browser storage to monitor study coverage.
* 🌗 **Aesthetics & Theme**: Responsive layout with premium light and deep dark visual styles, searchable indexes, and MathJax-powered typography.

---

## 📂 Project Structure

```
htcs401-main/
├── .github/workflows/
│   └── deploy.yml          # GitHub Pages deployment pipeline
├── css/
│   └── style.css               # Styling tokens, responsive grid, glassmorphic themes
├── js/
│   ├── app.js                  # Routing, sidebar search, theme state, checkbox persistence
│   ├── calculators.js          # Math modules (Entropy, Distributions, Hamming, DH, Shamir)
│   ├── visualizers.js          # Interactive visual modules (AES, PKI Flows)
│   └── quiz.js                 # MCQ database, grading engine, and explanations
├── index.html                  # Main application structure
├── LICENSE                     # MIT License
└── README.md                   # Documentation (this file)
```

---

## 🛠️ Local Development

No complex setup, build tools, or packages are required. Since it is constructed with a modern, client-side static stack, you can run it immediately:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/htcs401-main.git
   cd htcs401-main
   ```
2. **Open in Browser**:
   * Double-click `index.html` or run a local server:
   * **Python**: `python -m http.server 8000` (Visit `http://localhost:8000`)
   * **VS Code Live Server**: Right-click `index.html` -> "Open with Live Server"

---

## 🌐 Automatic Deployment

A GitHub Pages deployment script is configured under `.github/workflows/deploy.yml`. 
To deploy:
1. Push this project to your GitHub repository.
2. In your repository settings, navigate to **Pages**.
3. Under **Build and deployment**, select **GitHub Actions** as the source.
4. The site will automatically build and publish to your GitHub Pages URL (e.g., `https://your-username.github.io/htcs401-main/`).

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](file:///d:/Anuj/aiml project/htcs401-main/htcs401-main/LICENSE) file for details.
