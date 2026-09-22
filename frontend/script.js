/* =========================================================
   HOUSEPRICE AI - Frontend JavaScript
   ========================================================= */

/* =========================================================
   API CONFIGURATION
   ========================================================= */
const CONFIG = {
    API_BASE_URL: "https://house-price-prediction-project-ml-ra9d.onrender.com",
    PREDICT_ENDPOINT: "/predict"
};

/* =========================================================
   DOM ELEMENTS
   ========================================================= */
// Navigation & Theme
const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

// Prediction Form
const predictionForm = document.getElementById("predictionForm");
const predictButton = document.getElementById("predictButton");
const buttonContent = document.getElementById("buttonContent");
const buttonLoading = document.getElementById("buttonLoading");
const formMessage = document.getElementById("formMessage");

// Result Card
const resultCard = document.getElementById("resultCard");
const predictedPrice = document.getElementById("predictedPrice");
const predictAgainBtn = document.getElementById("predictAgain");
const clearFormBtn = document.getElementById("clearForm");

// Contact Form
const contactForm = document.getElementById("contactForm");

// Toast
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");

/* =========================================================
   INITIALIZATION & EVENT LISTENERS
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    setupNavigation();
    setupFormValidation();
    setupPredictionForm();
    setupResultActions();
    setupContactForm();
});

/* =========================================================
   THEME TOGGLE (Dark / Light Mode)
   ========================================================= */
function initTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");
        if (themeToggle) themeToggle.textContent = "☀️";
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark-theme");
            const isDark = document.body.classList.contains("dark-theme");
            themeToggle.textContent = isDark ? "☀️" : "🌙";
            localStorage.setItem("theme", isDark ? "dark" : "light");
        });
    }
}

/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */
function setupNavigation() {
    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("active");
            menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });

        // Close mobile menu when clicking nav links
        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });
    }
}

/* =========================================================
   FORM VALIDATION & ERROR CLEARING
   ========================================================= */
function setupFormValidation() {
    const inputs = predictionForm.querySelectorAll("input, select");
    inputs.forEach(input => {
        input.addEventListener("input", () => clearFieldError(input.id));
        input.addEventListener("change", () => clearFieldError(input.id));
    });
}

function clearFieldError(fieldId) {
    const errorSpan = document.getElementById(`${fieldId}-error`);
    if (errorSpan) errorSpan.textContent = "";
    
    const field = document.getElementById(fieldId);
    if (field) field.classList.remove("invalid");
}

function showFieldError(fieldId, message) {
    const errorSpan = document.getElementById(`${fieldId}-error`);
    if (errorSpan) errorSpan.textContent = message;
    
    const field = document.getElementById(fieldId);
    if (field) field.classList.add("invalid");
}

function validateForm() {
    let isValid = true;
    const requiredFields = [
        { id: "Rooms", label: "Rooms" },
        { id: "Bathroom", label: "Bathroom" },
        { id: "Car", label: "Car spaces" },
        { id: "Distance", label: "Distance" },
        { id: "BuildingArea", label: "Building area" },
        { id: "Landsize", label: "Landsize" },
        { id: "Age", label: "Property age" },
        { id: "Type", label: "Property type" },
        { id: "Grouped_Suburb", label: "Suburb" },
        { id: "Grouped_SellerG", label: "Seller" }
    ];

    requiredFields.forEach(({ id, label }) => {
        const input = document.getElementById(id);
        if (!input || !input.value.trim()) {
            showFieldError(id, `${label} is required.`);
            isValid = false;
        } else if (input.type === "number" && parseFloat(input.value) < 0) {
            showFieldError(id, `${label} cannot be negative.`);
            isValid = false;
        }
    });

    return isValid;
}

/* =========================================================
   PREDICTION API SUBMISSION
   ========================================================= */
function setupPredictionForm() {
    if (!predictionForm) return;

    predictionForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        if (formMessage) formMessage.textContent = "";

        if (!validateForm()) {
            showToast("Please fill in all required fields accurately.");
            return;
        }

        // Gather Payload matching backend parameters
        const formData = {
            Rooms: parseInt(document.getElementById("Rooms").value, 10),
            Bathroom: parseInt(document.getElementById("Bathroom").value, 10),
            Car: parseInt(document.getElementById("Car").value, 10),
            Distance: parseFloat(document.getElementById("Distance").value),
            BuildingArea: parseFloat(document.getElementById("BuildingArea").value),
            Landsize: parseFloat(document.getElementById("Landsize").value),
            Age: parseFloat(document.getElementById("Age").value),
            Type: document.getElementById("Type").value,
            Grouped_Suburb: document.getElementById("Grouped_Suburb").value,
            Grouped_SellerG: document.getElementById("Grouped_SellerG").value
        };

        setLoadingState(true);

        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.PREDICT_ENDPOINT}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.detail || `API request failed with status ${response.status}`);
            }

            const data = await response.json();
            
            // Extract prediction price from potential backend formats
            const rawPrice = data.prediction ?? data.predicted_price ?? data.price ?? data;
            
            if (rawPrice === undefined || isNaN(Number(rawPrice))) {
                throw new Error("Invalid response format received from prediction service.");
            }

            displayResult(Number(rawPrice));

        } catch (error) {
            console.error("Prediction Error:", error);
            if (formMessage) {
                formMessage.textContent = error.message || "Failed to fetch prediction. Please try again.";
                formMessage.className = "form-message error";
            }
            showToast("Error making prediction. Check inputs or try again later.");
        } finally {
            setLoadingState(false);
        }
    });
}

function setLoadingState(isLoading) {
    if (predictButton) predictButton.disabled = isLoading;
    if (buttonContent) buttonContent.style.display = isLoading ? "none" : "inline-flex";
    if (buttonLoading) buttonLoading.style.display = isLoading ? "inline-flex" : "none";
}

/* =========================================================
   RESULT DISPLAY & ACTIONS
   ========================================================= */
function displayResult(priceValue) {
    const formattedCurrency = new Intl.NumberFormat("en-AU", {
        style: "currency",
        currency: "AUD",
        maximumFractionDigits: 0
    }).format(priceValue);

    if (predictedPrice) predictedPrice.textContent = formattedCurrency;

    if (resultCard) {
        resultCard.hidden = false;
        resultCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
}

function setupResultActions() {
    if (predictAgainBtn) {
        predictAgainBtn.addEventListener("click", () => {
            if (resultCard) resultCard.hidden = true;
            predictionForm.scrollIntoView({ behavior: "smooth" });
        });
    }

    if (clearFormBtn) {
        clearFormBtn.addEventListener("click", resetPredictionForm);
    }
}

function resetPredictionForm() {
    if (predictionForm) predictionForm.reset();
    if (resultCard) resultCard.hidden = true;
    if (formMessage) formMessage.textContent = "";

    const errorSpans = predictionForm.querySelectorAll(".field-error");
    errorSpans.forEach(span => span.textContent = "");

    const fields = predictionForm.querySelectorAll("input, select");
    fields.forEach(field => field.classList.remove("invalid"));
}

/* =========================================================
   CONTACT FORM SUBMISSION
   ========================================================= */
function setupContactForm() {
    if (!contactForm) return;

    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        const formData = new FormData(contactForm);
        
        // Paste your Web3Forms access key here:
        formData.append("access_key", "9a07fc3d-2753-4ce0-a6f3-54f3b8fe84e1");

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                showToast("Thank you! Your message has been sent.");
                contactForm.reset();
            } else {
                showToast("Failed to send message. Please try again.");
            }
        } catch (error) {
            console.error("Contact Form Error:", error);
            showToast("An error occurred while sending your message.");
        } finally {
            if (submitBtn) submitBtn.disabled = false;
        }
    });
}

/* =========================================================
   TOAST NOTIFICATION HELPER
   ========================================================= */
let toastTimeout;
function showToast(message) {
    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 4000);
}