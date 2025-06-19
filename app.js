// Password Strength Tester Application

class PasswordStrengthTester {
    constructor() {
        this.commonWeakPasswords = [
            "123456", "password", "123456789", "12345678", "12345", "111111", "1234567", "sunshine", "qwerty", "iloveyou", "princess", "admin", "welcome", "666666", "abc123", "football", "123123", "monkey", "654321", "charlie", "aa123456", "donald", "password1", "qwerty123", "123qwe", "zxcvbnm", "1q2w3e4r", "baseball", "dragon", "master", "michelle", "jordan", "superman", "harley", "shadow", "trustno1", "hunter", "tigger", "123abc", "letmein", "solo", "mustang", "access", "loveme", "buster", "1234567890", "soccer", "1234", "Bailey", "Ashley"
        ];

        this.keyboardPatterns = [
            "qwerty", "qwertyuiop", "asdf", "asdfgh", "asdfghjkl", "zxcvbn", "zxcvbnm", "1234567890", "qazwsx", "1q2w3e", "1qaz2wsx"
        ];

        this.characterSets = {
            lowercase: 26,
            uppercase: 26,
            numbers: 10,
            symbols: 32
        };

        this.strengthCriteria = [
            {
                name: "Length (8+ characters)",
                description: "Password should be at least 8 characters long, 12+ recommended",
                weight: 25
            },
            {
                name: "Lowercase letters",
                description: "Include at least one lowercase letter (a-z)",
                weight: 15
            },
            {
                name: "Uppercase letters", 
                description: "Include at least one uppercase letter (A-Z)",
                weight: 15
            },
            {
                name: "Numbers",
                description: "Include at least one number (0-9)",
                weight: 15
            },
            {
                name: "Special characters",
                description: "Include at least one special character (!@#$%^&*)",
                weight: 20
            },
            {
                name: "No common patterns",
                description: "Avoid dictionary words, keyboard patterns, and sequences",
                weight: 10
            }
        ];

        this.securityTips = [
            "Use a mix of uppercase and lowercase letters, numbers, and symbols",
            "Avoid using personal information like names, birthdays, or addresses",
            "Don't use common words or phrases that can be found in dictionaries",
            "Avoid keyboard patterns like 'qwerty' or '123456'",
            "Consider using passphrases with 4-7 random words",
            "Use different passwords for different accounts",
            "Consider using a password manager to generate and store complex passwords"
        ];

        this.passwordVisible = false;
        
        this.initializeElements();
        this.bindEvents();
        this.populateStaticContent();
    }

    initializeElements() {
        this.passwordInput = document.getElementById('password-input');
        this.togglePasswordBtn = document.getElementById('toggle-password');
        this.strengthBar = document.getElementById('strength-bar');
        this.strengthLabel = document.getElementById('strength-label');
        this.scoreValue = document.getElementById('score-value');
        this.requirementsList = document.getElementById('requirements-list');
        this.entropyValue = document.getElementById('entropy-value');
        this.crackTime = document.getElementById('crack-time');
        this.charVariety = document.getElementById('char-variety');
        this.recommendationsList = document.getElementById('recommendations-list');
        this.clearPasswordBtn = document.getElementById('clear-password');
        
        // Generator elements
        this.passwordLength = document.getElementById('password-length');
        this.lengthDisplay = document.getElementById('length-display');
        this.includeUppercase = document.getElementById('include-uppercase');
        this.includeLowercase = document.getElementById('include-lowercase');
        this.includeNumbers = document.getElementById('include-numbers');
        this.includeSymbols = document.getElementById('include-symbols');
        this.generatePasswordBtn = document.getElementById('generate-password');
        this.generatedPassword = document.getElementById('generated-password');
        this.copyPasswordBtn = document.getElementById('copy-password');
    }

    bindEvents() {
        this.passwordInput.addEventListener('input', () => this.analyzePassword());
        this.togglePasswordBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.togglePasswordVisibility();
        });
        this.clearPasswordBtn.addEventListener('click', () => this.clearPassword());
        
        // Generator events
        this.passwordLength.addEventListener('input', () => this.updateLengthDisplay());
        this.generatePasswordBtn.addEventListener('click', () => this.generatePassword());
        this.copyPasswordBtn.addEventListener('click', () => this.copyToClipboard());
    }

    populateStaticContent() {
        // Populate requirements list
        this.requirementsList.innerHTML = this.strengthCriteria.map(criteria => `
            <li class="requirement-item" data-requirement="${criteria.name}">
                <span class="requirement-icon unmet">✗</span>
                <span class="requirement-text unmet">${criteria.description}</span>
            </li>
        `).join('');

        // Populate security tips
        const securityTipsList = document.getElementById('security-tips-list');
        securityTipsList.innerHTML = this.securityTips.map(tip => `
            <li class="security-tip-item">
                <span class="tip-icon">💡</span>
                <span class="tip-text">${tip}</span>
            </li>
        `).join('');
    }

    analyzePassword() {
        const password = this.passwordInput.value;
        
        if (!password) {
            this.resetAnalysis();
            return;
        }

        const analysis = this.performPasswordAnalysis(password);
        this.updateUI(analysis);
    }

    performPasswordAnalysis(password) {
        const analysis = {
            length: password.length,
            hasLowercase: /[a-z]/.test(password),
            hasUppercase: /[A-Z]/.test(password),
            hasNumbers: /\d/.test(password),
            hasSymbols: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
            isCommonPassword: this.isCommonPassword(password),
            hasKeyboardPattern: this.hasKeyboardPattern(password),
            hasSequentialPattern: this.hasSequentialPattern(password),
            hasRepeatedChars: this.hasRepeatedChars(password),
            entropy: this.calculateEntropy(password),
            charVariety: this.getCharacterVariety(password),
            score: 0,
            strengthLevel: 'weak'
        };

        analysis.score = this.calculateScore(analysis);
        analysis.strengthLevel = this.getStrengthLevel(analysis.score);
        analysis.crackTime = this.estimateCrackTime(analysis.entropy);
        analysis.recommendations = this.generateRecommendations(analysis, password);

        return analysis;
    }

    isCommonPassword(password) {
        return this.commonWeakPasswords.includes(password.toLowerCase());
    }

    hasKeyboardPattern(password) {
        const lower = password.toLowerCase();
        return this.keyboardPatterns.some(pattern => lower.includes(pattern));
    }

    hasSequentialPattern(password) {
        // Check for sequential numbers
        const sequentialNumbers = /(?:0123|1234|2345|3456|4567|5678|6789|9876|8765|7654|6543|5432|4321|3210)/;
        // Check for sequential letters
        const sequentialLetters = /(?:abcd|bcde|cdef|defg|efgh|fghi|ghij|hijk|ijkl|jklm|klmn|lmno|mnop|nopq|opqr|pqrs|qrst|rstu|stuv|tuvw|uvwx|vwxy|wxyz|zyxw|yxwv|xwvu|wvut|vuts|utsr|tsrq|srqp|rqpo|qpon|ponm|onml|nmlk|mlkj|lkji|kjih|jihg|ihgf|hgfe|gfed|fedc|edcb|dcba)/;
        
        return sequentialNumbers.test(password) || sequentialLetters.test(password.toLowerCase());
    }

    hasRepeatedChars(password) {
        // Check for 3 or more repeated characters
        return /(.)\1{2,}/.test(password);
    }

    calculateEntropy(password) {
        const charSetSize = this.getCharacterSetSize(password);
        return Math.log2(Math.pow(charSetSize, password.length));
    }

    getCharacterSetSize(password) {
        let size = 0;
        if (/[a-z]/.test(password)) size += this.characterSets.lowercase;
        if (/[A-Z]/.test(password)) size += this.characterSets.uppercase;
        if (/\d/.test(password)) size += this.characterSets.numbers;
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) size += this.characterSets.symbols;
        return size || 1;
    }

    getCharacterVariety(password) {
        let variety = 0;
        if (/[a-z]/.test(password)) variety++;
        if (/[A-Z]/.test(password)) variety++;
        if (/\d/.test(password)) variety++;
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) variety++;
        return variety;
    }

    calculateScore(analysis) {
        let score = 0;

        // Length score
        if (analysis.length >= 8) score += this.strengthCriteria[0].weight;
        if (analysis.length >= 12) score += 10; // Bonus for longer passwords

        // Character type scores
        if (analysis.hasLowercase) score += this.strengthCriteria[1].weight;
        if (analysis.hasUppercase) score += this.strengthCriteria[2].weight;
        if (analysis.hasNumbers) score += this.strengthCriteria[3].weight;
        if (analysis.hasSymbols) score += this.strengthCriteria[4].weight;

        // Pattern penalties
        if (!analysis.isCommonPassword && !analysis.hasKeyboardPattern && 
            !analysis.hasSequentialPattern && !analysis.hasRepeatedChars) {
            score += this.strengthCriteria[5].weight;
        }

        // Entropy bonus
        if (analysis.entropy > 50) score += 5;
        if (analysis.entropy > 80) score += 10;

        return Math.min(score, 100);
    }

    getStrengthLevel(score) {
        if (score < 40) return 'weak';
        if (score < 70) return 'medium';
        return 'strong';
    }

    estimateCrackTime(entropy) {
        // Assuming 1 billion guesses per second
        const guessesPerSecond = 1e9;
        const possibleCombinations = Math.pow(2, entropy);
        const secondsToCrack = possibleCombinations / (2 * guessesPerSecond);

        if (secondsToCrack < 60) return "Less than 1 minute";
        if (secondsToCrack < 3600) return `${Math.round(secondsToCrack / 60)} minutes`;
        if (secondsToCrack < 86400) return `${Math.round(secondsToCrack / 3600)} hours`;
        if (secondsToCrack < 31536000) return `${Math.round(secondsToCrack / 86400)} days`;
        if (secondsToCrack < 31536000000) return `${Math.round(secondsToCrack / 31536000)} years`;
        return "Centuries";
    }

    generateRecommendations(analysis, password) {
        const recommendations = [];

        if (analysis.length < 8) {
            recommendations.push("Use at least 8 characters, 12 or more is recommended");
        }
        if (!analysis.hasLowercase) {
            recommendations.push("Add lowercase letters (a-z)");
        }
        if (!analysis.hasUppercase) {
            recommendations.push("Add uppercase letters (A-Z)");
        }
        if (!analysis.hasNumbers) {
            recommendations.push("Add numbers (0-9)");
        }
        if (!analysis.hasSymbols) {
            recommendations.push("Add special characters (!@#$%^&*)");
        }
        if (analysis.isCommonPassword) {
            recommendations.push("This is a commonly used password - choose something more unique");
        }
        if (analysis.hasKeyboardPattern) {
            recommendations.push("Avoid keyboard patterns like 'qwerty' or '123456'");
        }
        if (analysis.hasSequentialPattern) {
            recommendations.push("Avoid sequential characters like 'abc' or '123'");
        }
        if (analysis.hasRepeatedChars) {
            recommendations.push("Avoid repeating the same character multiple times");
        }

        return recommendations;
    }

    updateUI(analysis) {
        // Update strength meter
        this.strengthBar.style.width = `${analysis.score}%`;
        this.strengthBar.className = `strength-bar ${analysis.strengthLevel}`;
        this.strengthLabel.textContent = this.getStrengthText(analysis.strengthLevel);
        this.strengthLabel.className = `strength-label ${analysis.strengthLevel}`;
        this.scoreValue.textContent = `${Math.round(analysis.score)}%`;

        // Update requirements checklist
        this.updateRequirements(analysis);

        // Update analysis values
        this.entropyValue.textContent = `${Math.round(analysis.entropy)} bits`;
        this.crackTime.textContent = analysis.crackTime;
        this.charVariety.textContent = `${analysis.charVariety} type${analysis.charVariety !== 1 ? 's' : ''}`;

        // Update recommendations
        this.updateRecommendations(analysis.recommendations);
    }

    getStrengthText(level) {
        switch (level) {
            case 'weak': return 'Weak Password';
            case 'medium': return 'Medium Password';
            case 'strong': return 'Strong Password';
            default: return 'Enter a password';
        }
    }

    updateRequirements(analysis) {
        const requirements = this.requirementsList.querySelectorAll('.requirement-item');
        
        const checks = [
            analysis.length >= 8,
            analysis.hasLowercase,
            analysis.hasUppercase,
            analysis.hasNumbers,
            analysis.hasSymbols,
            !analysis.isCommonPassword && !analysis.hasKeyboardPattern && 
            !analysis.hasSequentialPattern && !analysis.hasRepeatedChars
        ];

        requirements.forEach((item, index) => {
            const icon = item.querySelector('.requirement-icon');
            const text = item.querySelector('.requirement-text');
            const isMet = checks[index];

            if (isMet) {
                icon.textContent = '✓';
                icon.className = 'requirement-icon met';
                text.className = 'requirement-text met';
            } else {
                icon.textContent = '✗';
                icon.className = 'requirement-icon unmet';
                text.className = 'requirement-text unmet';
            }
        });
    }

    updateRecommendations(recommendations) {
        if (recommendations.length === 0) {
            this.recommendationsList.innerHTML = '<p class="placeholder-text">Great! Your password meets all security requirements.</p>';
        } else {
            this.recommendationsList.innerHTML = recommendations.map(rec => `
                <div class="recommendation-item">
                    <span class="recommendation-icon">⚠️</span>
                    <span class="recommendation-text">${rec}</span>
                </div>
            `).join('');
        }
    }

    resetAnalysis() {
        this.strengthBar.style.width = '0%';
        this.strengthBar.className = 'strength-bar';
        this.strengthLabel.textContent = 'Enter a password';
        this.strengthLabel.className = 'strength-label';
        this.scoreValue.textContent = '0%';
        
        // Reset requirements
        const requirements = this.requirementsList.querySelectorAll('.requirement-item');
        requirements.forEach(item => {
            const icon = item.querySelector('.requirement-icon');
            const text = item.querySelector('.requirement-text');
            icon.textContent = '✗';
            icon.className = 'requirement-icon unmet';
            text.className = 'requirement-text unmet';
        });

        // Reset analysis values
        this.entropyValue.textContent = '0 bits';
        this.crackTime.textContent = 'N/A';
        this.charVariety.textContent = '0 types';

        // Reset recommendations
        this.recommendationsList.innerHTML = '<p class="placeholder-text">Enter a password to see personalized recommendations</p>';
    }

    togglePasswordVisibility() {
        this.passwordVisible = !this.passwordVisible;
        
        if (this.passwordVisible) {
            this.passwordInput.type = 'text';
            this.togglePasswordBtn.querySelector('.toggle-icon').textContent = '🙈';
        } else {
            this.passwordInput.type = 'password';
            this.togglePasswordBtn.querySelector('.toggle-icon').textContent = '👁️';
        }
    }

    clearPassword() {
        this.passwordInput.value = '';
        this.generatedPassword.value = '';
        this.passwordVisible = false;
        this.passwordInput.type = 'password';
        this.togglePasswordBtn.querySelector('.toggle-icon').textContent = '👁️';
        this.resetAnalysis();
        this.passwordInput.focus();
    }

    updateLengthDisplay() {
        this.lengthDisplay.textContent = this.passwordLength.value;
    }

    generatePassword() {
        const length = parseInt(this.passwordLength.value);
        const includeUpper = this.includeUppercase.checked;
        const includeLower = this.includeLowercase.checked;
        const includeNums = this.includeNumbers.checked;
        const includeSyms = this.includeSymbols.checked;

        if (!includeUpper && !includeLower && !includeNums && !includeSyms) {
            alert('Please select at least one character type');
            return;
        }

        let charset = '';
        if (includeLower) charset += 'abcdefghijklmnopqrstuvwxyz';
        if (includeUpper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (includeNums) charset += '0123456789';
        if (includeSyms) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

        let password = '';
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }

        this.generatedPassword.value = password;
    }

    async copyToClipboard() {
        const password = this.generatedPassword.value;
        if (!password) {
            alert('Generate a password first');
            return;
        }

        try {
            await navigator.clipboard.writeText(password);
            const originalText = this.copyPasswordBtn.textContent;
            this.copyPasswordBtn.textContent = 'Copied!';
            this.copyPasswordBtn.classList.add('btn-copied');
            
            setTimeout(() => {
                this.copyPasswordBtn.textContent = originalText;
                this.copyPasswordBtn.classList.remove('btn-copied');
            }, 2000);
        } catch (err) {
            // Fallback for older browsers
            this.generatedPassword.select();
            document.execCommand('copy');
            alert('Password copied to clipboard');
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PasswordStrengthTester();
});