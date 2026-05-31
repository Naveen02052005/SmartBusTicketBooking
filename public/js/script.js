// const ticketData = {
//     ticketId: "SB123456",
//     passenger: "John Doe",
//     seat: "A12",
//     busId: "BUS102",
//     status: "VALID"
// };

// new QRCode(document.getElementById("qrcode"), {
//     text: JSON.stringify(ticketData),
//     width: 150,
//     height: 150
// });


// Bootstrap validation

(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()


document.addEventListener("DOMContentLoaded", () => {
    const adultsInput = document.getElementById("adults");
    const childrenInput = document.getElementById("children");
    const totalTicketsInput = document.getElementById("totalTickets");

    function updateTotalTickets() {
        const adults = parseInt(adultsInput.value) || 0;
        const children = parseInt(childrenInput.value) || 0;
        totalTicketsInput.value = adults + children;
    }

    adultsInput.addEventListener("input", updateTotalTickets);
    childrenInput.addEventListener("input", updateTotalTickets);
});
