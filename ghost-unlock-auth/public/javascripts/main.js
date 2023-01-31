$(document).ready(function () {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  const code = params.code;
  const signupForm = $(".gh-unlock_signup-form");
  const submitBtn = $(".gh-unlock_signup-btn");
  const emailModal = $("#gh-unlock_signup-modal");
  
  const openModal = function ($el) {
    $el.addClass("is-active");
  };
  

submitBtn.on("click", function (e) {
  e.preventDefault();
  const formData = signupForm.serializeArray();
  const userEmail = formData[0].value;
  console.log(userEmail)
  submitBtn.addClass("is-loading")

    fetch("https://ac58-197-210-54-211.eu.ngrok.io/signup/verify", {
      method: "POST",
      mode: "same-origin",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify({ email: userEmail, code }), // body data type must match "Content-Type" header
    })
      // .then((res) => res.json())
      .then((res) => {
        if (res && res.status === 201) {
          openModal(emailModal);
          return res.json();
        } else {
          submitBtn.removeClass("is-loading")
          submitBtn.text("Try again")
          return res.json();
        }
      })
      .then((res) => console.log("data", res));
  });
});
