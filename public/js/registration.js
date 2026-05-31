function validateForm1()
{
    const name=document.getElementById("name").value;
    const email=document.getElementById("email").value;
    const pass=document.getElementById("password").value;
    const confirmPass=document.getElementById("ConfirmPassword").value;
    const phone =document.getElementById("phone").value;

    const nameErr=document.getElementById("name-error");
    const emailErr=document.getElementById("email-error");
    const passErr=document.getElementById("password-error");
    const phoneErr=document.getElementById("phone-error")
    const confirmErr = document.getElementById("confirm-error");

    nameErr.textContent="";
    emailErr.textContent="";
    passErr.textContent="";
    confirmErr.textContent="";
    phoneErr.textContent="";

    let isValid=true;
    if(name==="" || /\d/.test(name))
    {
        nameErr.textContent="Please enter your name properly.";
        isValid=false;
    }



   const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
    emailErr.textContent = "Please enter a valid email address.";
    isValid = false;
    }
    

    if(pass==="" || pass.length<6)
    {
        passErr.textContent="Please enter a password with at least 6 characters.";
        isValid=false;
    }

     if (confirmPass !== pass) {
        confirmErr.textContent = "Passwords do not match.";
        isValid = false;
    }
    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(phone)) {
        phoneErr.textContent = "Please enter a valid 10-digit phone number.";
        isValid = false;
    }

    return isValid;
}
function resetErrors()
{
    document.getElementById("name-error").textContent="";
    document.getElementById("email-error").textContent="";
    document.getElementById("password-error").textContent="";
    document.getElementById("phone-error").textContent="";
     const backendErrors = document.querySelectorAll(".error");
  backendErrors.forEach(err => (err.style.display = "none"));
}



const togglePassword = document.getElementById("togglePassword");
const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("ConfirmPassword");

togglePassword.addEventListener("click", function () {

    if (password.type === "password") {
        password.type = "password";
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
        confirmPassword.type = "password";
        this.classList.remove("fa-eye");
        this.classList.add("fa-eye-slash");
    }
    else{
        confirmPassword.type = "password";
        this.classList.remove("fa-eye-slash");
        this.classList.add("fa-eye");
    }
});
