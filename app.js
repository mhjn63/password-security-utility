// Application Data
const appData = {
  commonPatterns: [
    "qwerty", "qwertyuiop", "asdfgh", "zxcvbn", "123456", "password", "admin", "letmein", "welcome", "monkey"
  ],
  breachedPasswords: [
    "123456", "password", "password123", "admin", "qwerty", "letmein", "welcome", "monkey", "dragon", "master"
  ],
  strengthCriteria: {
    length: {min: 8, good: 12, excellent: 16},
    characterTypes: {minimum: 2, good: 3, excellent: 4},
    entropy: {weak: 30, medium: 50, strong: 70}
  },
  commonSubstitutions: {
    "a": "@", "e": "3", "i": "1", "o": "0", "s": "$", "t": "7"
  },
  wordList: ["password", "admin", "user", "login", "test", "welcome", "master", "dragon", "shadow", "ninja"]
};

// DOM Elements
const elements = {
  // Navigation
  navItems: document.querySelectorAll('.nav-item'),
  tabContents: document.querySelectorAll('.tab-content'),
  themeToggle: document.getElementById('themeToggle'),
  
  // Password Analyzer
  passwordInput: document.getElementById('passwordInput'),
  togglePassword: document.getElementById('togglePassword'),
  strengthBar: document.getElementById('strengthBar'),
  strengthLabel: document.getElementById('strengthLabel'),
  lengthResult: document.getElementById('lengthResult'),
  charTypesResult: document.getElementById('charTypesResult'),
  crackTimeResult: document.getElementById('crackTimeResult'),
  feedbackList: document.getElementById('feedbackList'),
  
  // Password Generator
  lengthSlider: document.getElementById('lengthSlider'),
  lengthValue: document.getElementById('lengthValue'),
  includeUpper: document.getElementById('includeUpper'),
  includeLower: document.getElementById('includeLower'),
  includeNumbers: document.getElementById('includeNumbers'),
  includeSymbols: document.getElementById('includeSymbols'),
  excludeSimilar: document.getElementById('excludeSimilar'),
  memorableMode: document.getElementById('memorableMode'),
  generateBtn: document.getElementById('generateBtn'),
  copyBtn: document.getElementById('copyBtn'),
  generatedPassword: document.getElementById('generatedPassword'),
  generatedStrength: document.getElementById('generatedStrength'),
  
  // Breach Checker
  breachInput: document.getElementById('breachInput'),
  toggleBreachPassword: document.getElementById('toggleBreachPassword'),
  checkBreachBtn: document.getElementById('checkBreachBtn'),
  breachIndicator: document.getElementById('breachIndicator'),
  breachStatusText: document.getElementById('breachStatusText'),
  breachRecommendations: document.getElementById('breachRecommendations'),
  breachResults: document.getElementById('breachResults'),
  
  // Entropy Calculator
  entropyInput: document.getElementById('entropyInput'),
  toggleEntropyPassword: document.getElementById('toggleEntropyPassword'),
  entropyValue: document.getElementById('entropyValue'),
  possibleCombinations: document.getElementById('possibleCombinations'),
  characterPool: document.getElementById('characterPool'),
  entropyChart: document.getElementById('entropyChart'),
  entropyExplanation: document.getElementById('entropyExplanation'),
  
  // Pattern Recognition
  patternInput: document.getElementById('patternInput'),
  togglePatternPassword: document.getElementById('togglePatternPassword'),
  analyzePatternBtn: document.getElementById('analyzePatternBtn'),
  keyboardPatterns: document.getElementById('keyboardPatterns'),
  substitutionPatterns: document.getElementById('substitutionPatterns'),
  dictionaryPatterns: document.getElementById('dictionaryPatterns'),
  sequentialPatterns: document.getElementById('sequentialPatterns'),
  aiScore: document.getElementById('aiScore'),
  scoreExplanation: document.getElementById('scoreExplanation')
};

// Application State
let currentTheme = 'light';
let currentPassword = '';

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  setupNavigation();
  setupThemeToggle();
  setupPasswordAnalyzer();
  setupPasswordGenerator();
  setupBreachChecker();
  setupEntropyCalculator();
  setupPatternRecognition();
  setupPasswordToggles();
  setupMobileMenu();
  
  // Load user preferences
  loadUserPreferences();
}

// Navigation System
function setupNavigation() {
  elements.navItems.forEach(item => {
    item.addEventListener('click', function() {
      const tabId = this.dataset.tab;
      switchTab(tabId);
    });
  });
}

function switchTab(tabId) {
  // Update nav items
  elements.navItems.forEach(item => {
    item.classList.remove('active');
    if (item.dataset.tab === tabId) {
      item.classList.add('active');
    }
  });
  
  // Update tab content
  elements.tabContents.forEach(content => {
    content.classList.remove('active');
    if (content.id === tabId) {
      content.classList.add('active');
    }
  });
}

// Theme Toggle
function setupThemeToggle() {
  elements.themeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-color-scheme', currentTheme);
  
  const themeIcon = elements.themeToggle.querySelector('.theme-icon');
  themeIcon.textContent = currentTheme === 'light' ? '🌙' : '☀️';
  
  saveUserPreferences();
}

// Password Analyzer
function setupPasswordAnalyzer() {
  elements.passwordInput.addEventListener('input', function() {
    const password = this.value;
    analyzePassword(password);
  });
}

function analyzePassword(password) {
  if (!password) {
    resetAnalysisDisplay();
    return;
  }
  
  const analysis = {
    length: password.length,
    characterTypes: getCharacterTypes(password),
    entropy: calculateEntropy(password),
    patterns: detectPatterns(password),
    crackTime: estimateCrackTime(password)
  };
  
  const strength = calculateStrength(analysis);
  updateStrengthDisplay(strength, analysis);
}

function getCharacterTypes(password) {
  const types = {
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /[0-9]/.test(password),
    symbols: /[^a-zA-Z0-9]/.test(password)
  };
  
  return Object.values(types).filter(Boolean).length;
}

function calculateEntropy(password) {
  let charsetSize = 0;
  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/[0-9]/.test(password)) charsetSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32;
  
  return Math.log2(Math.pow(charsetSize, password.length));
}

function estimateCrackTime(password) {
  const entropy = calculateEntropy(password);
  const guessesPerSecond = 1000000000; // 1 billion guesses per second
  const totalGuesses = Math.pow(2, entropy) / 2; // Average case
  const seconds = totalGuesses / guessesPerSecond;
  
  if (seconds < 60) return 'Less than 1 minute';
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
  if (seconds < 31536000000) return `${Math.round(seconds / 31536000)} years`;
  return 'Centuries';
}

function calculateStrength(analysis) {
  let score = 0;
  
  // Length scoring
  if (analysis.length >= appData.strengthCriteria.length.excellent) score += 25;
  else if (analysis.length >= appData.strengthCriteria.length.good) score += 15;
  else if (analysis.length >= appData.strengthCriteria.length.min) score += 5;
  
  // Character type scoring
  if (analysis.characterTypes >= appData.strengthCriteria.characterTypes.excellent) score += 25;
  else if (analysis.characterTypes >= appData.strengthCriteria.characterTypes.good) score += 15;
  else if (analysis.characterTypes >= appData.strengthCriteria.characterTypes.minimum) score += 5;
  
  // Entropy scoring
  if (analysis.entropy >= appData.strengthCriteria.entropy.strong) score += 25;
  else if (analysis.entropy >= appData.strengthCriteria.entropy.medium) score += 15;
  else if (analysis.entropy >= appData.strengthCriteria.entropy.weak) score += 5;
  
  // Pattern penalties
  score -= analysis.patterns.length * 5;
  
  // Normalize to 0-100
  score = Math.max(0, Math.min(100, score + 25));
  
  if (score >= 80) return 'strong';
  if (score >= 60) return 'good';
  if (score >= 40) return 'fair';
  return 'weak';
}

function updateStrengthDisplay(strength, analysis) {
  // Update strength meter
  elements.strengthBar.className = `meter-fill ${strength}`;
  elements.strengthLabel.className = `strength-label ${strength}`;
  elements.strengthLabel.textContent = strength.charAt(0).toUpperCase() + strength.slice(1);
  
  // Update analysis results
  elements.lengthResult.textContent = `${analysis.length} characters`;
  elements.charTypesResult.textContent = `${analysis.characterTypes}/4 types`;
  elements.crackTimeResult.textContent = analysis.crackTime;
  
  // Update feedback
  updateFeedback(analysis, strength);
}

function updateFeedback(analysis, strength) {
  const feedback = [];
  
  if (analysis.length < appData.strengthCriteria.length.min) {
    feedback.push('Use at least 8 characters');
  }
  if (analysis.characterTypes < 3) {
    feedback.push('Include uppercase, lowercase, numbers, and symbols');
  }
  if (analysis.patterns.length > 0) {
    feedback.push('Avoid common patterns and sequences');
  }
  if (strength === 'weak') {
    feedback.push('Consider using a longer, more complex password');
  }
  if (strength === 'strong') {
    feedback.push('Excellent! This is a strong password');
  }
  
  elements.feedbackList.innerHTML = feedback.map(item => `<li>${item}</li>`).join('');
}

function resetAnalysisDisplay() {
  elements.strengthBar.className = 'meter-fill';
  elements.strengthLabel.className = 'strength-label';
  elements.strengthLabel.textContent = 'Enter a password to analyze';
  elements.lengthResult.textContent = '-';
  elements.charTypesResult.textContent = '-';
  elements.crackTimeResult.textContent = '-';
  elements.feedbackList.innerHTML = '';
}

// Password Generator
function setupPasswordGenerator() {
  elements.lengthSlider.addEventListener('input', function() {
    elements.lengthValue.textContent = this.value;
  });
  
  elements.generateBtn.addEventListener('click', generatePassword);
  elements.copyBtn.addEventListener('click', copyToClipboard);
}

function generatePassword() {
  const options = {
    length: parseInt(elements.lengthSlider.value),
    includeUpper: elements.includeUpper.checked,
    includeLower: elements.includeLower.checked,
    includeNumbers: elements.includeNumbers.checked,
    includeSymbols: elements.includeSymbols.checked,
    excludeSimilar: elements.excludeSimilar.checked,
    memorableMode: elements.memorableMode.checked
  };
  
  let password;
  if (options.memorableMode) {
    password = generateMemorablePassword(options);
  } else {
    password = generateRandomPassword(options);
  }
  
  elements.generatedPassword.textContent = password;
  
  // Analyze generated password
  const analysis = {
    length: password.length,
    characterTypes: getCharacterTypes(password),
    entropy: calculateEntropy(password),
    patterns: detectPatterns(password)
  };
  
  const strength = calculateStrength(analysis);
  elements.generatedStrength.textContent = `Strength: ${strength.charAt(0).toUpperCase() + strength.slice(1)}`;
}

function generateRandomPassword(options) {
  let charset = '';
  
  if (options.includeUpper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (options.includeLower) charset += 'abcdefghijklmnopqrstuvwxyz';
  if (options.includeNumbers) charset += '0123456789';
  if (options.includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  if (options.excludeSimilar) {
    charset = charset.replace(/[il1Lo0O]/g, '');
  }
  
  if (!charset) return 'Please select at least one character type';
  
  let password = '';
  for (let i = 0; i < options.length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  
  return password;
}

function generateMemorablePassword(options) {
  const words = ['secure', 'strong', 'bright', 'quick', 'smart', 'happy', 'brave', 'clear', 'fresh', 'solid'];
  const numbers = '0123456789';
  const symbols = '!@#$%^&*';
  
  let password = words[Math.floor(Math.random() * words.length)];
  password += words[Math.floor(Math.random() * words.length)];
  
  if (options.includeNumbers) {
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  
  if (options.includeSymbols) {
    password += symbols.charAt(Math.floor(Math.random() * symbols.length));
  }
  
  // Adjust case
  if (options.includeUpper && options.includeLower) {
    password = password.charAt(0).toUpperCase() + password.slice(1).toLowerCase();
    const midIndex = Math.floor(password.length / 2);
    password = password.substring(0, midIndex) + password.charAt(midIndex).toUpperCase() + password.substring(midIndex + 1);
  } else if (options.includeUpper) {
    password = password.toUpperCase();
  } else if (options.includeLower) {
    password = password.toLowerCase();
  }
  
  return password.slice(0, options.length);
}

function copyToClipboard() {
  const password = elements.generatedPassword.textContent;
  if (password && password !== 'Click "Generate Password" to create a secure password') {
    navigator.clipboard.writeText(password).then(() => {
      elements.copyBtn.textContent = 'Copied!';
      elements.copyBtn.classList.add('success-pulse');
      setTimeout(() => {
        elements.copyBtn.textContent = 'Copy to Clipboard';
        elements.copyBtn.classList.remove('success-pulse');
      }, 2000);
    });
  }
}

// Breach Checker
function setupBreachChecker() {
  elements.checkBreachBtn.addEventListener('click', checkForBreach);
}

function checkForBreach() {
  const password = elements.breachInput.value;
  if (!password) return;
  
  const isCompromised = appData.breachedPasswords.includes(password.toLowerCase());
  
  const resultCard = elements.breachResults.querySelector('.result-card');
  resultCard.className = 'result-card ' + (isCompromised ? 'compromised' : 'safe');
  
  elements.breachIndicator.className = 'status-indicator ' + (isCompromised ? 'compromised' : 'safe');
  
  if (isCompromised) {
    elements.breachStatusText.textContent = 'Password found in known breaches!';
    elements.breachRecommendations.innerHTML = `
      <h4>⚠️ Security Recommendations:</h4>
      <ul>
        <li>Change this password immediately</li>
        <li>Use the password generator to create a new one</li>
        <li>Enable two-factor authentication where possible</li>
        <li>Never reuse this password on other accounts</li>
      </ul>
    `;
  } else {
    elements.breachStatusText.textContent = 'Password not found in known breaches';
    elements.breachRecommendations.innerHTML = `
      <h4>✅ Good News:</h4>
      <p>This password hasn't been found in our database of known breaches. However, continue to use strong, unique passwords for all your accounts.</p>
    `;
  }
}

// Entropy Calculator
function setupEntropyCalculator() {
  elements.entropyInput.addEventListener('input', function() {
    calculatePasswordEntropy(this.value);
  });
}

function calculatePasswordEntropy(password) {
  if (!password) {
    elements.entropyValue.textContent = '0';
    elements.possibleCombinations.textContent = '0';
    elements.characterPool.textContent = '0';
    return;
  }
  
  let charsetSize = 0;
  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/[0-9]/.test(password)) charsetSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32;
  
  const entropy = Math.log2(Math.pow(charsetSize, password.length));
  const combinations = Math.pow(charsetSize, password.length);
  
  elements.entropyValue.textContent = Math.round(entropy);
  elements.possibleCombinations.textContent = combinations.toExponential(2);
  elements.characterPool.textContent = charsetSize;
  
  drawEntropyChart(entropy, password.length, charsetSize);
}

function drawEntropyChart(entropy, length, charsetSize) {
  const canvas = elements.entropyChart;
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  
  // Clear canvas
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-surface').trim();
  ctx.fillRect(0, 0, width, height);
  
  // Draw entropy bar
  const maxEntropy = 200; // Max expected entropy for visualization
  const barWidth = (entropy / maxEntropy) * (width - 40);
  const barHeight = 40;
  const barY = (height - barHeight) / 2;
  
  // Background bar
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-secondary').trim();
  ctx.fillRect(20, barY, width - 40, barHeight);
  
  // Entropy bar
  let barColor = '#ef4444'; // red
  if (entropy > 70) barColor = '#10b981'; // green
  else if (entropy > 50) barColor = '#f59e0b'; // yellow
  else if (entropy > 30) barColor = '#f97316'; // orange
  
  ctx.fillStyle = barColor;
  ctx.fillRect(20, barY, barWidth, barHeight);
  
  // Add text
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-text').trim();
  ctx.font = '14px ' + getComputedStyle(document.documentElement).getPropertyValue('--font-family-base').trim();
  ctx.textAlign = 'center';
  ctx.fillText(`${Math.round(entropy)} bits`, width / 2, barY + barHeight + 25);
}

// Pattern Recognition
function setupPatternRecognition() {
  elements.analyzePatternBtn.addEventListener('click', function() {
    const password = elements.patternInput.value;
    analyzePatterns(password);
  });
}

function analyzePatterns(password) {
  if (!password) return;
  
  const patterns = {
    keyboard: detectKeyboardPatterns(password),
    substitution: detectSubstitutionPatterns(password),
    dictionary: detectDictionaryWords(password),
    sequential: detectSequentialPatterns(password)
  };
  
  updatePatternDisplay(patterns, password);
}

function detectPatterns(password) {
  const patterns = [];
  
  // Check for common patterns
  appData.commonPatterns.forEach(pattern => {
    if (password.toLowerCase().includes(pattern)) {
      patterns.push(pattern);
    }
  });
  
  return patterns;
}

function detectKeyboardPatterns(password) {
  const keyboardPatterns = ['qwerty', 'asdf', 'zxcv', '123456789', '987654321'];
  const found = [];
  
  keyboardPatterns.forEach(pattern => {
    if (password.toLowerCase().includes(pattern)) {
      found.push(pattern);
    }
  });
  
  return found;
}

function detectSubstitutionPatterns(password) {
  const found = [];
  
  Object.entries(appData.commonSubstitutions).forEach(([letter, substitute]) => {
    if (password.includes(substitute)) {
      const baseWord = password.replace(new RegExp(substitute, 'g'), letter);
      if (appData.wordList.some(word => baseWord.toLowerCase().includes(word))) {
        found.push(`${substitute} → ${letter}`);
      }
    }
  });
  
  return found;
}

function detectDictionaryWords(password) {
  const found = [];
  
  appData.wordList.forEach(word => {
    if (password.toLowerCase().includes(word)) {
      found.push(word);
    }
  });
  
  return found;
}

function detectSequentialPatterns(password) {
  const found = [];
  
  // Check for ascending sequences
  for (let i = 0; i < password.length - 2; i++) {
    const char1 = password.charCodeAt(i);
    const char2 = password.charCodeAt(i + 1);
    const char3 = password.charCodeAt(i + 2);
    
    if (char2 === char1 + 1 && char3 === char2 + 1) {
      found.push(password.substring(i, i + 3));
    }
  }
  
  return found;
}

function updatePatternDisplay(patterns, password) {
  elements.keyboardPatterns.innerHTML = patterns.keyboard.length ? 
    patterns.keyboard.map(p => `<span class="pattern-detected">${p}</span>`).join(', ') : 
    'No patterns detected';
    
  elements.substitutionPatterns.innerHTML = patterns.substitution.length ? 
    patterns.substitution.map(p => `<span class="pattern-detected">${p}</span>`).join(', ') : 
    'No patterns detected';
    
  elements.dictionaryPatterns.innerHTML = patterns.dictionary.length ? 
    patterns.dictionary.map(p => `<span class="pattern-detected">${p}</span>`).join(', ') : 
    'No patterns detected';
    
  elements.sequentialPatterns.innerHTML = patterns.sequential.length ? 
    patterns.sequential.map(p => `<span class="pattern-detected">${p}</span>`).join(', ') : 
    'No patterns detected';
  
  // Calculate AI score
  const totalPatterns = Object.values(patterns).flat().length;
  const score = Math.max(0, 100 - (totalPatterns * 15));
  
  elements.aiScore.textContent = `${score}/100`;
  
  let explanation = '';
  if (score >= 90) explanation = 'Excellent! Very few predictable patterns detected.';
  else if (score >= 70) explanation = 'Good! Some minor patterns detected.';
  else if (score >= 50) explanation = 'Fair. Several patterns detected - consider more randomness.';
  else explanation = 'Poor. Many patterns detected - this password is predictable.';
  
  elements.scoreExplanation.textContent = explanation;
}

// Password Visibility Toggles
function setupPasswordToggles() {
  const toggles = [
    {button: elements.togglePassword, input: elements.passwordInput},
    {button: elements.toggleBreachPassword, input: elements.breachInput},
    {button: elements.toggleEntropyPassword, input: elements.entropyInput},
    {button: elements.togglePatternPassword, input: elements.patternInput}
  ];
  
  toggles.forEach(({button, input}) => {
    if (button && input) {
      button.addEventListener('click', () => {
        const type = input.getAttribute('type');
        input.setAttribute('type', type === 'password' ? 'text' : 'password');
        button.textContent = type === 'password' ? '🙈' : '👁️';
      });
    }
  });
}

// Mobile Menu
function setupMobileMenu() {
  // Add mobile menu button if it doesn't exist
  if (window.innerWidth <= 1024) {
    addMobileMenuButton();
  }
  
  window.addEventListener('resize', function() {
    if (window.innerWidth <= 1024) {
      addMobileMenuButton();
    } else {
      removeMobileMenuButton();
    }
  });
}

function addMobileMenuButton() {
  if (document.querySelector('.mobile-menu-btn')) return;
  
  const button = document.createElement('button');
  button.className = 'mobile-menu-btn';
  button.innerHTML = '☰';
  button.addEventListener('click', toggleMobileMenu);
  
  document.body.appendChild(button);
}

function removeMobileMenuButton() {
  const button = document.querySelector('.mobile-menu-btn');
  if (button) button.remove();
}

function toggleMobileMenu() {
  const sidebar = document.querySelector('.sidebar');
  sidebar.classList.toggle('mobile-open');
}

// User Preferences
function saveUserPreferences() {
  const preferences = {
    theme: currentTheme,
    generatorLength: elements.lengthSlider.value,
    generatorOptions: {
      includeUpper: elements.includeUpper.checked,
      includeLower: elements.includeLower.checked,
      includeNumbers: elements.includeNumbers.checked,
      includeSymbols: elements.includeSymbols.checked,
      excludeSimilar: elements.excludeSimilar.checked,
      memorableMode: elements.memorableMode.checked
    }
  };
  
  // In a real app, this would be saved to localStorage
  // For this demo, we'll just keep it in memory
  window.userPreferences = preferences;
}

function loadUserPreferences() {
  // In a real app, this would load from localStorage
  const preferences = window.userPreferences || {
    theme: 'light',
    generatorLength: 12,
    generatorOptions: {
      includeUpper: true,
      includeLower: true,
      includeNumbers: true,
      includeSymbols: true,
      excludeSimilar: false,
      memorableMode: false
    }
  };
  
  // Apply theme
  currentTheme = preferences.theme;
  document.documentElement.setAttribute('data-color-scheme', currentTheme);
  const themeIcon = elements.themeToggle.querySelector('.theme-icon');
  themeIcon.textContent = currentTheme === 'light' ? '🌙' : '☀️';
  
  // Apply generator preferences
  elements.lengthSlider.value = preferences.generatorLength;
  elements.lengthValue.textContent = preferences.generatorLength;
  
  Object.entries(preferences.generatorOptions).forEach(([key, value]) => {
    if (elements[key]) {
      elements[key].checked = value;
    }
  });
}

// Utility Functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}