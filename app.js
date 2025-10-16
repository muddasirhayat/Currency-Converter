window.addEventListener("DOMContentLoaded", function () {
  const BASE_URL =
    "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/";

  const rateBtn = document.querySelector(".swapBtn");
  const fromInput = document.querySelector(".fromInput");
  const toInput = document.querySelector(".toInput");
  const dropDowns = document.querySelectorAll(".currency-select select");
  const rateText = document.querySelector(".cardFooter span");

  for (let select of dropDowns) {
    for (let [currencyCode, countryCode] of Object.entries(countryList)) {
      let option = document.createElement("option");
      option.value = currencyCode;
      option.textContent = currencyCode;

      if (select.name === "from" && currencyCode === "USD") {
        option.selected = true;
      }
      if (select.name === "to" && currencyCode === "PKR") {
        option.selected = true;
      }

      select.appendChild(option);
    }

    select.addEventListener("change", function (e) {
      updateFlag(e.target);
      convertCurrency();
    });
  }

  function updateFlag(element) {
    let currencyCode = element.value;
    let countryCode = countryList[currencyCode];
    let imgTag = element.parentElement.querySelector("img");

    if (imgTag && countryCode) {
      imgTag.src = "https://flagsapi.com/" + countryCode + "/flat/64.png";
    }
  }

  async function convertCurrency() {
    let fromCurrency = dropDowns[0].value.toLowerCase();
    let toCurrency = dropDowns[1].value.toLowerCase();
    let amount = parseFloat(fromInput.value.trim());

    if (isNaN(amount) || amount <= 0) {
      toInput.value = "";
      rateText.textContent = "Enter valid amount";
      return;
    }

    try {
      let response = await fetch(BASE_URL + fromCurrency + ".json");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      let data = await response.json();
      let rate = data[fromCurrency][toCurrency];

      if (!rate) {
        throw new Error("Conversion rate not found");
      }

      let converted = (amount * rate).toFixed(2);
      toInput.value = converted;
      rateText.textContent =
        "1 " +
        fromCurrency.toUpperCase() +
        " = " +
        rate.toFixed(4) +
        " " +
        toCurrency.toUpperCase();
    } catch (error) {
      console.log("Error:", error.message);
      toInput.value = "";
      rateText.textContent = "Error fetching rate";
    }
  }

  fromInput.addEventListener("input", convertCurrency);
  dropDowns.forEach(function (select) {
    select.addEventListener("change", convertCurrency);
  });

  rateBtn.addEventListener("click", function (e) {
    e.preventDefault();

    let tempCurrency = dropDowns[0].value;
    dropDowns[0].value = dropDowns[1].value;
    dropDowns[1].value = tempCurrency;

    let tempAmount = fromInput.value;
    fromInput.value = toInput.value;
    toInput.value = tempAmount;

    updateFlag(dropDowns[0]);
    updateFlag(dropDowns[1]);

    convertCurrency();
  });

  dropDowns.forEach(function (select) {
    updateFlag(select);
  });

  convertCurrency();
});
