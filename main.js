// DOM Elements
const generateBtn = document.getElementById("generate");
const passwordInput = document.getElementById("password");
const copyBtn = document.getElementById("copy");
const lengthSlider = document.getElementById("length");
const lengthValue = document.getElementById("lengthValue");
const strengthDiv = document.getElementById("strength");

// Character sets
const chars = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

// Update length display
lengthSlider.addEventListener("input", () => {
  lengthValue.textContent = lengthSlider.value;
});

// Generate secure password using Web Crypto API
function generateSecurePassword(length, charSet) {
  const array = new Uint8Array(length);
  console.log("New array: ", array);

  crypto.getRandomValues(array);

  let chars = [];

  for (let i = 0; i < length; i++) {
    chars.push(charSet[array[i] % charSet.length]);
  }

  return chars.join("");
}

// Calculate password strength
function calculateStrength(password) {
  let score = 0;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  const levels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  return levels[score] || "Very Weak";
}

generateBtn.addEventListener("click", () => {
  const length = parseInt(lengthSlider.value);
  let charSet = "";

  if (document.getElementById("uppercase").checked) charSet += chars.uppercase;
  if (document.getElementById("lowercase").checked) charSet += chars.lowercase;
  if (document.getElementById("numbers").checked) charSet += chars.numbers;
  if (document.getElementById("symbols").checked) charSet += chars.symbols;

  console.log("Character Set: ", charSet);

  if (charSet === "") {
    alert("Select at least one character type!");
    return;
  }

  const password = generateSecurePassword(length, charSet);
  passwordInput.value = password;

  const strength = calculateStrength(password);
  strengthDiv.textContent = `Strength: ${strength}`;
  strengthDiv.className = `strength ${strength
    .toLowerCase()
    .replace(" ", "-")}`;
});

copyBtn.addEventListener("click", async () => {
  const textToCopy = passwordInput.value;

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(textToCopy);
    } else {
      // ⚠️ Fallback para navegadores antiguos
      passwordInput.select();
      document.execCommand("copy");
    }

    copyBtn.textContent = "Copied!";
    setTimeout(() => (copyBtn.textContent = "Copy"), 2000);
  } catch (err) {
    console.error("Error copying to clipboard:", err);
    alert("Could not copy to clipboard 😢");
  }
});

// Generate initial password
generateBtn.click();
