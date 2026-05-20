let fromCurrency = "INR";
let toCurrency = "USD";
let selectType = "from";

const popup = document.getElementById("popup");
const countryList = document.getElementById("countryList");
const searchInput = document.getElementById("search");
const amountInput = document.getElementById("amount");
const convertBtn = document.getElementById("convertBtn");
const result = document.getElementById("result");

let countriesData = [];

/* ---------- Flag Generator ---------- */
function getFlagEmoji(code) {
  if (!code) return "🏳️";

  return code
    .toUpperCase()
    .replace(/./g, char =>
      String.fromCodePoint(127397 + char.charCodeAt())
    );
}

/* ---------- Result Helper ---------- */
function showResult(message) {
  result.innerHTML = message;
}

/* ---------- Spinner ---------- */
function showLoading() {
  result.innerHTML = `<span class="spinner"></span> Converting...`;
}

/* ---------- Load Countries ---------- */
async function loadCountries() {
  try {
    const res = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,cca2,currencies",
      {
        method: "GET",
        mode: "cors",
        cache: "no-cache"
      }
    );

    if (!res.ok) throw new Error("Failed to load countries");

    const json = await res.json();
    countriesData = [];

    json.forEach(c => {
      if (!c?.name?.common) return;
      if (!c?.currencies) return;
      if (!c?.cca2) return;

      const currencyKey = Object.keys(c.currencies)[0];
      if (!currencyKey) return;

      const currencyObj = c.currencies[currencyKey];

      countriesData.push({
        name: c.name.common,
        code: currencyKey,
        currency: currencyObj?.name || currencyKey,
        flag: getFlagEmoji(c.cca2)
      });
    });

    countriesData.sort((a, b) => a.name.localeCompare(b.name));

  } catch (err) {
    console.log("Country Load Error:", err);
    showResult("Country list load problem ❌");
  }
}

loadCountries();

/* ---------- Popup ---------- */
function openPopup(type) {
  selectType = type;
  popup.classList.add("active");
  searchInput.value = "";
  renderList(countriesData);
  searchInput.focus();
}

function closePopup() {
  popup.classList.remove("active");
}

popup.addEventListener("click", e => {
  if (e.target === popup) {
    closePopup();
  }
});

/* ---------- Render List ---------- */
function renderList(list) {
  countryList.innerHTML = "";

  if (list.length === 0) {
    countryList.innerHTML = `<li style="text-align:center;">No currency found ❌</li>`;
    return;
  }

  list.forEach(c => {
    const li = document.createElement("li");
    li.textContent = `${c.flag} ${c.name} – ${c.currency} (${c.code})`;
    li.onclick = () => selectCurrency(c);
    countryList.appendChild(li);
  });
}

/* ---------- Select Currency ---------- */
function selectCurrency(c) {
  if (selectType === "from") {
    fromCurrency = c.code;
    document.getElementById("fromText").textContent =
      `${c.flag} ${c.name} – ${c.currency} (${c.code})`;
  } else {
    toCurrency = c.code;
    document.getElementById("toText").textContent =
      `${c.flag} ${c.name} – ${c.currency} (${c.code})`;
  }

  closePopup();

  if (amountInput.value.trim() !== "" && parseFloat(amountInput.value) >= 0) {
    convert();
  }
}

/* ---------- Search ---------- */
searchInput.addEventListener("input", () => {
  const val = searchInput.value.toLowerCase().trim();

  const filtered = countriesData.filter(c =>
    c.name.toLowerCase().includes(val) ||
    c.code.toLowerCase().includes(val) ||
    c.currency.toLowerCase().includes(val)
  );

  renderList(filtered);
});

/* ---------- Prevent Negative Value ---------- */
amountInput.addEventListener("input", () => {
  if (amountInput.value.includes("-")) {
    amountInput.value = amountInput.value.replace("-", "");
  }
});

/* ---------- Enter Press Convert ---------- */
amountInput.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    convert();
  }
});

/* ---------- Convert ---------- */
convertBtn.addEventListener("click", convert);

async function convert() {
  const amount = parseFloat(amountInput.value);

  if (amountInput.value.trim() === "") {
    showResult("Enter amount");
    return;
  }

  if (isNaN(amount) || amount < 0) {
    showResult("Negative value not allowed ❌");
    amountInput.value = "";
    return;
  }

  if (fromCurrency === toCurrency) {
    showResult(`${amount} ${fromCurrency} = ${amount.toFixed(2)} ${toCurrency}`);
    return;
  }

  showLoading();

  try {
    const response = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`, {
      method: "GET",
      mode: "cors",
      cache: "no-cache"
    });

    if (!response.ok) {
      throw new Error("Exchange API failed");
    }

    const data = await response.json();

    if (!data || !data.rates) {
      throw new Error("Rates not found");
    }

    const rate = data.rates[toCurrency];

    if (!rate) {
      showResult("Currency not supported ❌");
      return;
    }

    const total = (amount * rate).toFixed(2);

    showResult(`${amount} ${fromCurrency} = ${total} ${toCurrency}`);

  } catch (err) {
    console.log("Convert Error:", err);
    showResult("Internet / API Problem ❌");
  }
}

/* ---------- Reverse ---------- */
function reverseCurrency() {
  [fromCurrency, toCurrency] = [toCurrency, fromCurrency];

  const fromText = document.getElementById("fromText");
  const toText = document.getElementById("toText");

  const temp = fromText.textContent;
  fromText.textContent = toText.textContent;
  toText.textContent = temp;

  if (amountInput.value.trim() !== "" && parseFloat(amountInput.value) >= 0) {
    convert();
  }
}

/* ---------- Global Bind ---------- */
window.openPopup = openPopup;
window.closePopup = closePopup;
window.reverseCurrency = reverseCurrency;