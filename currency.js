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

/* ---------- Load Countries ---------- */

async function loadCountries() {
  try {

    const res = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,cca2,currencies"
    );

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

    countriesData.sort((a,b)=>a.name.localeCompare(b.name));

  } catch (err) {
    console.log("Country Load Error:", err);
  }
}

loadCountries();

/* ---------- Popup ---------- */

function openPopup(type) {
  selectType = type;
  popup.style.display = "flex";
  searchInput.value = "";
  renderList(countriesData);
}

popup.addEventListener("click", e=>{
  if(e.target === popup){
    popup.style.display = "none";
  }
});

/* ---------- Render List ---------- */

function renderList(list) {

  countryList.innerHTML = "";

  list.forEach(c=>{
    const li = document.createElement("li");

    li.textContent =
      `${c.flag} ${c.name} – ${c.currency} (${c.code})`;

    li.onclick = ()=> selectCurrency(c);

    countryList.appendChild(li);
  });
}

/* ---------- Select Currency ---------- */

function selectCurrency(c){

  if(selectType === "from"){
    fromCurrency = c.code;

    document.getElementById("fromText").textContent =
      `${c.flag} ${c.name} – ${c.currency} (${c.code})`;

  } else {

    toCurrency = c.code;

    document.getElementById("toText").textContent =
      `${c.flag} ${c.name} – ${c.currency} (${c.code})`;
  }

  popup.style.display = "none";
}

/* ---------- Search ---------- */

searchInput.addEventListener("input", ()=>{

  const val = searchInput.value.toLowerCase();

  const filtered = countriesData.filter(c =>
    c.name.toLowerCase().includes(val) ||
    c.code.toLowerCase().includes(val) ||
    c.currency.toLowerCase().includes(val)
  );

  renderList(filtered);
});

/* ---------- Convert ---------- */

convertBtn.addEventListener("click", convert);

async function convert(){

  const amount = parseFloat(amountInput.value);

  if(!amount){
    result.innerText = "Enter amount";
    return;
  }

  result.innerText = "Converting...";

  try{

    const response = await fetch(
      `https://open.er-api.com/v6/latest/${fromCurrency}`
    );

    const data = await response.json();

    if(!data?.rates){
      result.innerText = "API Error ❌";
      return;
    }

    const rate = data.rates[toCurrency];

    if(!rate){
      result.innerText = "Currency not supported ❌";
      return;
    }

    const total = (amount * rate).toFixed(2);

    result.innerText =
      `${amount} ${fromCurrency} = ${total} ${toCurrency}`;

  } catch(err){
    console.log(err);
    result.innerText = "Internet / API Problem ❌";
  }
}

/* ---------- Reverse ---------- */

function reverseCurrency(){

  [fromCurrency, toCurrency] = [toCurrency, fromCurrency];

  const fromText = document.getElementById("fromText");
  const toText = document.getElementById("toText");

  const temp = fromText.textContent;
  fromText.textContent = toText.textContent;
  toText.textContent = temp;
}

/* ---------- Global Bind ---------- */

window.openPopup = openPopup;
window.reverseCurrency = reverseCurrency;

/* ---------- End ---------- */