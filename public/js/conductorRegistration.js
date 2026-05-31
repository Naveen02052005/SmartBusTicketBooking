function validateForm() {

    const fullName = document.getElementById("fullName").value.trim();
    const employeeId = document.getElementById("employeeId").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const licenseNumber = document.getElementById("licenseNumber").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const terms = document.getElementById("terms").checked;

    const fullNameError = document.getElementById("fullName-error");
    const employeeIdError = document.getElementById("employeeId-error");
    const emailError = document.getElementById("email-error");
    const phoneError = document.getElementById("phone-error");
    const licenseNumberError = document.getElementById("licenseNumber-error");
    const passwordError = document.getElementById("password-error");
    const confirmError = document.getElementById("confirmPassword-error");
    const termsError = document.getElementById("terms-error");

    if (fullNameError) fullNameError.textContent = "";
    if (employeeIdError) employeeIdError.textContent = "";
    if (emailError) emailError.textContent = "";
    if (phoneError) phoneError.textContent = "";
    if (licenseNumberError) licenseNumberError.textContent = "";
    if (passwordError) passwordError.textContent = "";
    if (confirmError) confirmError.textContent = "";
    if (termsError) termsError.textContent = "";

    let isValid = true;

    if (fullName === "" || /\d/.test(fullName)) {
        fullNameError.textContent = "Please enter your full name properly.";
        isValid = false;
    }

    if (employeeId === "") {
        employeeIdError.textContent = "Please enter your employee ID.";
        isValid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        emailError.textContent = "Please enter a valid email address.";
        isValid = false;
    }

    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(phone)) {
        phoneError.textContent = "Please enter a valid 10-digit phone number.";
        isValid = false;
    }

    if (licenseNumber === "") {
        licenseNumberError.textContent = "Please enter a valid license number.";
        isValid = false;
    }

    if (password === "" || password.length < 6) {
        passwordError.textContent = "Password must be at least 6 characters.";
        isValid = false;
    }

    if (confirmPassword !== password) {
        confirmError.textContent = "Passwords do not match.";
        isValid = false;
    }

    if (!terms) {
        termsError.textContent = "Please accept the terms and conditions.";
        isValid = false;
    }

    return isValid;
}
function resetErrors()
{
    document.getElementById("fullName-error").textContent="";
    document.getElementById("employeeId-error").textContent="";
    document.getElementById("email-error").textContent="";
    document.getElementById("phone-error").textContent="";
    document.getElementById("licenseNumber-error").textContent="";
    document.getElementById("password-error").textContent="";
    
     const backendErrors = document.querySelectorAll(".error");
  backendErrors.forEach(err => (err.style.display = "none"));
}



const togglePassword = document.getElementById("togglePassword");
const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

togglePassword.addEventListener("click", function () {

    if (password.type === "password") {
        password.type = "text";
        this.classList.remove("fa-eye");
        this.classList.add("fa-eye-slash");
    } else {
        password.type = "password";
        this.classList.remove("fa-eye-slash");
        this.classList.add("fa-eye");
    }
});

toggleConfirmPassword.addEventListener("click",function () {
    if(confirmPassword.type === "password"){
        confirmPassword.type = "text";
        this.classList.remove("fa-eye");
        this.classList.add("fa-eye-slash");
    }
    else{
        confirmPassword.type = "password";
        this.classList.remove("fa-eye-slash");
        this.classList.add("fa-eye");
    }
});
