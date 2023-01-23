$(document).ready(function () {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  const code = params.code;
  const signupForm = $(".gh-unlock_signup-form");
  const submitBtn = $(".gh-unlock_signup-btn");

  const submitForm = async function (url = "", data = {}) {
    const response = await fetch(url, {
      method: "POST",
      mode: "same-origin",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json;
  }

  submitBtn.on("click", function (e) {
    e.preventDefault();
    const formData = signupForm.serializeArray();
    const userEmail = formData[0].value;
    console.log("Email: ", userEmail);
    console.log("Code: ", code);
    submitForm('https://1e8d-102-36-149-129.eu.ngrok.io/signup/verify', {
      email: userEmail,
      code,
    }).then((data) => {
      console.log(data); // JSON data parsed by `data.json()` call
    });
  });
});
