function isValidStudentNumber(value) {
  if (typeof value !== "string") {
    return false;
  }
  return /^\d{2}-\d{4}-\d{3}$/.test(value.trim());
}

function isValidPassword(value) {
  if (typeof value !== "string") {
    return false;
  }
  return /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!])\S{8,}$/.test(value);
}

function isValidFullName(value) {
  return typeof value === "string" && value.trim().length >= 2;
}

function isValidEmail(value) {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isValidMobileNumber(value) {
  return typeof value === "string" && /^(09|\+639)\d{9}$/.test(value.trim());
}

function getPasswordProblems(value) {
  const problems = [];
  if (value.length < 8) {
    problems.push("at least 8 characters");
  }
  if (!/[A-Z]/.test(value)) {
    problems.push("one uppercase letter");
  }
  if (!/\d/.test(value)) {
    problems.push("one digit");
  }
  if (!/[@$!]/.test(value)) {
    problems.push("one of @, $, or !");
  }
  if (/\s/.test(value)) {
    problems.push("no spaces");
  }
  return problems;
}

function setupForm() {
  const form = document.getElementById("registrationForm");
  const resetBtn = document.getElementById("resetBtn");
  const fullName = document.getElementById("fullName");
  const studentNumber = document.getElementById("studentNumber");
  const email = document.getElementById("email");
  const mobileNumber = document.getElementById("mobileNumber");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");
  const course = document.getElementById("course");
  const terms = document.getElementById("terms");
  const passwordFeedback = document.getElementById("passwordFeedback");
  const successMessage = document.getElementById("successMessage");
  const registrationSummary = document.getElementById("registrationSummary");

  function showError(field, message) {
    document.getElementById(field.id + "Error").textContent = message;
    field.setAttribute("aria-invalid", "true");
  }

  function clearError(field) {
    document.getElementById(field.id + "Error").textContent = "";
    field.setAttribute("aria-invalid", "false");
  }

  function checkField(field, isValid, message) {
    if (isValid) {
      clearError(field);
    } else {
      showError(field, message);
    }
    return isValid;
  }

  function validateFullName() {
    return checkField(fullName, isValidFullName(fullName.value),
      "Enter your full name (at least 2 characters).");
  }

  function validateStudentNumber() {
    return checkField(studentNumber, isValidStudentNumber(studentNumber.value),
      "Enter a student number in the format 24-1234-123.");
  }

  function validateEmail() {
    return checkField(email, isValidEmail(email.value),
      "Enter a valid email address, like name@example.com.");
  }

  function validateMobileNumber() {
    return checkField(mobileNumber, isValidMobileNumber(mobileNumber.value),
      "Enter a mobile number like 09123456789 or +639123456789, with no spaces or hyphens.");
  }

  function validatePassword() {
    return checkField(password, isValidPassword(password.value),
      "Password must have at least 8 characters, one uppercase letter, one digit, one of @, $, or !, and no spaces.");
  }

  function validateConfirmPassword() {
    if (confirmPassword.value === "") {
      return checkField(confirmPassword, false, "Confirm your password.");
    }
    return checkField(confirmPassword, confirmPassword.value === password.value,
      "Passwords do not match.");
  }

  function validateCourse() {
    const isValid = course.value === "BSIT" || course.value === "BSCS";
    return checkField(course, isValid, "Select your course (BSIT or BSCS).");
  }

  function validateTerms() {
    return checkField(terms, terms.checked, "You must agree to the terms and conditions.");
  }

  function updatePasswordFeedback() {
    passwordFeedback.classList.remove("ok");
    if (password.value === "") {
      passwordFeedback.textContent = "";
      return;
    }
    const problems = getPasswordProblems(password.value);
    if (problems.length === 0) {
      passwordFeedback.textContent = "Password meets all requirements.";
      passwordFeedback.classList.add("ok");
    } else {
      passwordFeedback.textContent = "Password still needs: " + problems.join(", ") + ".";
    }
  }

  function clearOutput() {
    successMessage.textContent = "";
    registrationSummary.hidden = true;
    document.getElementById("summaryName").textContent = "";
    document.getElementById("summaryStudentNumber").textContent = "";
    document.getElementById("summaryEmail").textContent = "";
    document.getElementById("summaryMobileNumber").textContent = "";
    document.getElementById("summaryCourse").textContent = "";
  }

  function clearAllFeedback() {
    [fullName, studentNumber, email, mobileNumber, password, confirmPassword, course, terms]
      .forEach(clearError);
    passwordFeedback.textContent = "";
    passwordFeedback.classList.remove("ok");
    clearOutput();
  }

  function showSummary() {
    document.getElementById("summaryName").textContent = fullName.value.trim();
    document.getElementById("summaryStudentNumber").textContent = studentNumber.value.trim();
    document.getElementById("summaryEmail").textContent = email.value.trim();
    document.getElementById("summaryMobileNumber").textContent = mobileNumber.value.trim();
    document.getElementById("summaryCourse").textContent = course.value;
    successMessage.textContent = "Registration details validated successfully!";
    registrationSummary.hidden = false;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const results = [
      validateFullName(),
      validateStudentNumber(),
      validateEmail(),
      validateMobileNumber(),
      validatePassword(),
      validateConfirmPassword(),
      validateCourse(),
      validateTerms()
    ];

    if (results.every(Boolean)) {
      showSummary();
    } else {
      clearOutput();
    }
  }

  function recheckIfInvalid(field, validator) {
    field.addEventListener("input", function () {
      if (field.getAttribute("aria-invalid") === "true") {
        validator();
      }
    });
  }

  function handleReset(event) {
    event.preventDefault();
    form.reset();
    clearAllFeedback();
  }

  form.addEventListener("submit", handleSubmit);
  resetBtn.addEventListener("click", handleReset);
  form.addEventListener("reset", function () {
    setTimeout(clearAllFeedback, 0);
  });

  password.addEventListener("input", function () {
    updatePasswordFeedback();
    if (confirmPassword.value !== "") {
      validateConfirmPassword();
    }
  });

  fullName.addEventListener("blur", validateFullName);
  course.addEventListener("change", validateCourse);
  terms.addEventListener("change", validateTerms);

  recheckIfInvalid(fullName, validateFullName);
  recheckIfInvalid(studentNumber, validateStudentNumber);
  recheckIfInvalid(email, validateEmail);
  recheckIfInvalid(mobileNumber, validateMobileNumber);
  recheckIfInvalid(password, validatePassword);
  recheckIfInvalid(confirmPassword, validateConfirmPassword);

  clearOutput();
}

if (typeof document !== "undefined") {
  setupForm();
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { isValidStudentNumber, isValidPassword };
}