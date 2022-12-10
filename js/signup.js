const signUpForm = document.getElementById("signup-form");
const inputElements = document.getElementsByTagName("input");
const errorElements = document.getElementsByClassName("error-message");

signUpForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(signUpForm);
  const userData = Object.fromEntries(formData);

  const { username, email, password, password_confirmation } = userData;

  if (!isValidUserName(username)) return;
  if (!isValidEmail(email)) return;
  if (!isValidPassword(password, password_confirmation)) return;

  fetch("https://goldblv.com/api/hiring/tasks/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((res) => res.json())
    .then((data) => {
      localStorage.setItem("userEmail", data.email);
      window.location.href = "./home.html";
    });
});

// Hide all error message when user write in any input again
Array.from(inputElements).forEach((input) => {
  input.addEventListener("keydown", () => {
    Array.from(errorElements).forEach((element) => (element.style.opacity = "0"));
  });
});

function isValidUserName(username) {
  const usernameError = document.getElementById("username-error");

  // Regex test if string consists only of letters and numbers
  const regexTest = /^[A-Za-z0-9]*$/.test(username);

  // Regex test if string starts with numbers
  const startWithNum = /^[0-9]/.test(username);

  // Regex test if string ends with numbers
  const endWithNum = /[0-9]+$/.test(username);

  let errorMessage;

  if (!regexTest) {
    errorMessage = "Username must consist only letters and numbers.";
  } else if (startWithNum) {
    errorMessage = "Username must not start with only number.";
  } else if (endWithNum) {
    errorMessage = "Username must not end with only number.";
  } else if (username.length < 5 || username.length > 15) {
    errorMessage = "Username must consist of 5 to 15 characters.";
  }

  if (regexTest && !startWithNum && !endWithNum && username.length >= 5 && username.length <= 15) {
    return true;
  } else {
    usernameError.textContent = errorMessage;
    usernameError.style.opacity = "1";
    return false;
  }
}

function isValidEmail(email) {
  const emailError = document.getElementById("email-error");
  const regexEmailTest = /^\S+@\S+\.\S+$/.test(email);

  if (regexEmailTest) {
    return true;
  } else {
    emailError.textContent = "Please enter a valid email";
    emailError.style.opacity = "1";
    return false;
  }
}

function isValidPassword(password, passwordConfirm) {
  const passwordError = document.getElementById("password-error");
  const regexPasswordTest = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password);
  const passwordsMatch = password === passwordConfirm;

  let errorMessage;

  if (!passwordsMatch) {
    errorMessage = "Passwords must match";
  } else if (!regexPasswordTest) {
    errorMessage = "Password must be min 8 letters, with at least a symbol, upper and lower case letters and a number";
  }

  if (regexPasswordTest && passwordsMatch) {
    return true;
  } else {
    passwordError.textContent = errorMessage;
    passwordError.style.opacity = "1";
    return false;
  }
}
