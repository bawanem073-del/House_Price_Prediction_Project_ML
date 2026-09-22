
/* =========================================================
   HOUSEPRICE AI
   Frontend JavaScript
   ========================================================= */


/* =========================================================
   API CONFIGURATION
   ========================================================= */

// FastAPI backend URL
const CONFIG = {
    API_BASE_URL: "https://house-price-prediction-project-ml-ra9d.onrender.com",
    PREDICT_ENDPOINT: "/predict"
};


fetch("https://house-price-prediction-project-ml-ra9d.onrender.com/predict", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
})

// If the frontend is served from another origin/port,
// FastAPI may require CORS configuration.
// The backend itself should not be modified by this frontend.


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const predictionForm = document.getElementById("predictionForm");

const predictButton = document.getElementById("predictButton");
const buttonContent = document.getElementById("buttonContent");

const resultCard = document.getElementById("resultCard");
const predictedPrice = document.getElementById("predictedPrice");

const predictAgain = document.getElementById("predictAgain");
const clearFormButton = document.getElementById("clearForm");

const formMessage = document.getElementById("formMessage");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

const themeToggle = document.getElementById("themeToggle");


/* =========================================================
   ALLOWED VALUES
   ========================================================= */

const allowedTypes = ["h", "t", "u"];

const allowedSuburbs = [
    "Other",
    "Reservoir",
    "Richmond",
    "Bentleigh East",
    "Preston",
    "Brunswick",
    "Essendon",
    "South Yarra",
    "Glen Iris",
    "Hawthorn"
];

const allowedSellers = [
    "Other",
    "Nelson",
    "Jellis",
    "hockingstuart",
    "Barry",
    "Ray",
    "Marshall",
    "Buxton",
    "Biggin",
    "Brad"
];


/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */

menuToggle.addEventListener("click", () => {

    const isOpen = navLinks.classList.toggle("active");

    menuToggle.setAttribute("aria-expanded", isOpen);

    const icon = menuToggle.querySelector("i");

    if (isOpen) {
        icon.className = "fa-solid fa-xmark";
    } else {
        icon.className = "fa-solid fa-bars";
    }
});


/* Close mobile navigation after clicking a link */

document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("active");

        menuToggle.setAttribute("aria-expanded", "false");

        menuToggle.querySelector("i").className =
            "fa-solid fa-bars";
    });

});


/* =========================================================
   DARK MODE
   ========================================================= */

const savedTheme = localStorage.getItem("houseprice-theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    updateThemeIcon();
}

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");

    const theme = document.body.classList.contains("dark-mode")
        ? "dark"
        : "light";

    localStorage.setItem("houseprice-theme", theme);

    updateThemeIcon();
});


function updateThemeIcon() {

    const icon = themeToggle.querySelector("i");

    if (document.body.classList.contains("dark-mode")) {

        icon.className = "fa-solid fa-sun";

    } else {

        icon.className = "fa-solid fa-moon";

    }
}


/* =========================================================
   VALIDATION HELPERS
   ========================================================= */

function showFieldError(fieldId, message) {

    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`);

    if (!field || !errorElement) {
        return;
    }

    const formGroup = field.closest(".form-group");

    formGroup.classList.add("invalid");

    errorElement.textContent = message;
}


function clearFieldError(fieldId) {

    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`);

    if (!field || !errorElement) {
        return;
    }

    const formGroup = field.closest(".form-group");

    formGroup.classList.remove("invalid");

    errorElement.textContent = "";
}


function clearAllErrors() {

    const fields = [
        "Rooms",
        "Bathroom",
        "Car",
        "Distance",
        "BuildingArea",
        "Landsize",
        "Age",
        "Type",
        "Grouped_Suburb",
        "Grouped_SellerG"
    ];

    fields.forEach(clearFieldError);
}


/* =========================================================
   FORM VALIDATION
   ========================================================= */

function validateForm() {

    clearAllErrors();

    formMessage.textContent = "";
    formMessage.className = "form-message";

    let isValid = true;


    /* ---------- Rooms ---------- */

    const rooms = Number(
        document.getElementById("Rooms").value
    );

    if (
        !Number.isFinite(rooms) ||
        rooms < 0 ||
        rooms > 20 ||
        !Number.isInteger(rooms)
    ) {

        showFieldError(
            "Rooms",
            "Rooms must be an integer between 0 and 20."
        );

        isValid = false;
    }


    /* ---------- Bathroom ---------- */

    const bathroom = Number(
        document.getElementById("Bathroom").value
    );

    if (
        !Number.isFinite(bathroom) ||
        bathroom < 0 ||
        bathroom > 10 ||
        !Number.isInteger(bathroom)
    ) {

        showFieldError(
            "Bathroom",
            "Bathroom must be an integer between 0 and 10."
        );

        isValid = false;
    }


    /* ---------- Car ---------- */

    const car = Number(
        document.getElementById("Car").value
    );

    if (
        !Number.isFinite(car) ||
        car < 0 ||
        car > 5 ||
        !Number.isInteger(car)
    ) {

        showFieldError(
            "Car",
            "Car spaces must be an integer between 0 and 5."
        );

        isValid = false;
    }


    /* ---------- Distance ---------- */

    const distance = Number(
        document.getElementById("Distance").value
    );

    if (!Number.isFinite(distance) || distance < 0) {

        showFieldError(
            "Distance",
            "Distance must be 0 or greater."
        );

        isValid = false;
    }


    /* ---------- Building Area ---------- */

    const buildingArea = Number(
        document.getElementById("BuildingArea").value
    );

    if (!Number.isFinite(buildingArea) || buildingArea < 0) {

        showFieldError(
            "BuildingArea",
            "Building area must be 0 or greater."
        );

        isValid = false;
    }


    /* ---------- Landsize ---------- */

    const landsize = Number(
        document.getElementById("Landsize").value
    );

    if (!Number.isFinite(landsize) || landsize < 0) {

        showFieldError(
            "Landsize",
            "Landsize must be 0 or greater."
        );

        isValid = false;
    }


    /* ---------- Age ----------
       FLOAT VALIDATION
       Examples:
       10
       10.5
       25.2
       0.5
    */

    const age = Number(
        document.getElementById("Age").value
    );

    if (!Number.isFinite(age) || age < 0) {

        showFieldError(
            "Age",
            "Age must be 0 or greater."
        );

        isValid = false;
    }


    /* ---------- Type ---------- */

    const type = document.getElementById("Type").value;

    if (!allowedTypes.includes(type)) {

        showFieldError(
            "Type",
            "Please select a valid property type."
        );

        isValid = false;
    }


    /* ---------- Suburb ---------- */

    const suburb =
        document.getElementById("Grouped_Suburb").value;

    if (!allowedSuburbs.includes(suburb)) {

        showFieldError(
            "Grouped_Suburb",
            "Please select a valid suburb."
        );

        isValid = false;
    }


    /* ---------- Seller ---------- */

    const seller =
        document.getElementById("Grouped_SellerG").value;

    if (!allowedSellers.includes(seller)) {

        showFieldError(
            "Grouped_SellerG",
            "Please select a valid seller group."
        );

        isValid = false;
    }


    if (!isValid) {

        formMessage.textContent =
            "Please correct the highlighted fields.";

        formMessage.className =
            "form-message error";
    }

    return isValid;
}


/* =========================================================
   GET FORM DATA
   ========================================================= */

function getFormData() {

    return {

        // Exact backend field names
        Rooms: Number(
            document.getElementById("Rooms").value
        ),

        Bathroom: Number(
            document.getElementById("Bathroom").value
        ),

        Car: Number(
            document.getElementById("Car").value
        ),

        Distance: Number(
            document.getElementById("Distance").value
        ),

        BuildingArea: Number(
            document.getElementById("BuildingArea").value
        ),

        Landsize: Number(
            document.getElementById("Landsize").value
        ),

        // Age is FLOAT
        Age: Number(
            document.getElementById("Age").value
        ),

        Type:
            document.getElementById("Type").value,

        Grouped_Suburb:
            document.getElementById("Grouped_Suburb").value,

        Grouped_SellerG:
            document.getElementById("Grouped_SellerG").value
    };
}


/* =========================================================
   LOADING STATE
   ========================================================= */

function setLoading(isLoading) {

    predictButton.disabled = isLoading;

    if (isLoading) {

        predictButton.classList.add("loading");

    } else {

        predictButton.classList.remove("loading");
    }
}


/* =========================================================
   PREDICT PRICE
   ========================================================= */

predictionForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    /* Validate first */

    if (!validateForm()) {

        showToast(
            "Please check the entered property details."
        );

        return;
    }


    /* Get exact JSON payload */

    const data = getFormData();


    /* Loading */

    setLoading(true);

    resultCard.hidden = true;

    formMessage.textContent =
        "AI model is analyzing the property features...";

    formMessage.className =
        "form-message";


    try {

        /* =====================================================
           REAL API REQUEST
           POST http://127.0.0.1:8000/predict
           ===================================================== */

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)
        });


        /* ---------- HTTP 422 ---------- */

        if (response.status === 422) {

            formMessage.textContent =
                "Please check the entered property details.";

            formMessage.className =
                "form-message error";

            showToast(
                "Please check the entered property details."
            );

            return;
        }


        /* ---------- Other server errors ---------- */

        if (!response.ok) {

            formMessage.textContent =
                "Something went wrong while generating the prediction.";

            formMessage.className =
                "form-message error";

            showToast(
                "Something went wrong while generating the prediction."
            );

            return;
        }


        /* ---------- Parse API response ---------- */

        const result = await response.json();


        /* ---------- Validate prediction ---------- */

        if (
            typeof result.predicted_price !== "number" ||
            !Number.isFinite(result.predicted_price)
        ) {

            formMessage.textContent =
                "The server returned an invalid prediction.";

            formMessage.className =
                "form-message error";

            showToast(
                "The server returned an invalid prediction."
            );

            return;
        }


        /* ---------- Display actual API result ---------- */

        showPrediction(result.predicted_price);


        formMessage.textContent =
            "Prediction generated successfully.";

        formMessage.className =
            "form-message success";


    } catch (error) {

        /*
         * Do not expose raw JavaScript errors to the user.
         * This usually means FastAPI is not running or
         * the browser cannot connect to the backend.
         */

        formMessage.textContent =
            "Unable to connect to the prediction server.";

        formMessage.className =
            "form-message error";

        showToast(
            "Unable to connect to the prediction server."
        );

    } finally {

        setLoading(false);
    }

});


/* =========================================================
   DISPLAY PREDICTION
   ========================================================= */

function showPrediction(value) {

    resultCard.hidden = false;

    animatePrice(value);

    resultCard.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


/* =========================================================
   PRICE ANIMATION
   ========================================================= */

function animatePrice(targetValue) {

    const duration = 900;

    const startTime = performance.now();

    function update(currentTime) {

        const elapsed =
            currentTime - startTime;

        const progress =
            Math.min(elapsed / duration, 1);

        /*
         * Ease-out animation
         */
        const eased =
            1 - Math.pow(1 - progress, 3);

        const currentValue =
            targetValue * eased;

        predictedPrice.textContent =
            formatCurrency(currentValue);

        if (progress < 1) {

            requestAnimationFrame(update);

        } else {

            predictedPrice.textContent =
                formatCurrency(targetValue);
        }
    }

    requestAnimationFrame(update);
}


/* =========================================================
   CURRENCY FORMAT
   ========================================================= */

function formatCurrency(value) {

    return new Intl.NumberFormat("en-AU", {

        style: "currency",

        currency: "AUD",

        maximumFractionDigits: 0

    }).format(value);
}


/* =========================================================
   PREDICT AGAIN
   ========================================================= */

predictAgain.addEventListener("click", () => {

    resultCard.hidden = true;

    document.getElementById("predict").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

});


/* =========================================================
   CLEAR FORM
   ========================================================= */

clearFormButton.addEventListener("click", clearForm);


function clearForm() {

    predictionForm.reset();

    clearAllErrors();

    formMessage.textContent = "";

    formMessage.className = "form-message";

    resultCard.hidden = true;

    predictedPrice.textContent = "$0";

    window.scrollTo({
        top: document.getElementById("predict").offsetTop - 90,
        behavior: "smooth"
    });
}


/* =========================================================
   TOAST
   ========================================================= */

let toastTimer;

function showToast(message) {

    toastMessage.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 4000);
}


/* =========================================================
   CLEAR FIELD ERROR WHEN USER CHANGES INPUT
   ========================================================= */

const formFields = document.querySelectorAll(
    "#predictionForm input, #predictionForm select"
);

formFields.forEach(field => {

    field.addEventListener("input", () => {

        clearFieldError(field.id);

    });

    field.addEventListener("change", () => {

        clearFieldError(field.id);

    });

});


/* =========================================================
   INITIAL STATE
   ========================================================= */

resultCard.hidden = true;


/* =========================================================
   IMPORTANT BACKEND PAYLOAD
   =========================================================

   Example sent to FastAPI:

   {
       "Rooms": 3,
       "Bathroom": 2,
       "Car": 1,
       "Distance": 5.5,
       "BuildingArea": 150,
       "Landsize": 300,
       "Age": 10.5,
       "Type": "h",
       "Grouped_Suburb": "Reservoir",
       "Grouped_SellerG": "Nelson"
   }

   Age is intentionally FLOAT-compatible.
   No parseInt() is used for Age.

   ========================================================= */

/* =========================
   CONTACT FORM
========================= */

const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("contactName").value.trim();
        const email = document.getElementById("contactEmail").value.trim();
        const subject = document.getElementById("contactSubject").value.trim();
        const message = document.getElementById("contactMessage").value.trim();

        if (!name || !email || !subject || !message) {
            showToast("Please fill in all contact fields.", "error");
            return;
        }

        const mailSubject = encodeURIComponent(
            `${subject} - HousePrice AI`
        );

        const mailBody = encodeURIComponent(
            `Hello Mahesh,\n\n` +
            `Name: ${name}\n` +
            `Email: ${email}\n\n` +
            `Message:\n${message}`
        );

        window.location.href =
            `mailto:your-email@example.com?subject=${mailSubject}&body=${mailBody}`;

        showToast("Opening your email application...", "success");
    });
}   