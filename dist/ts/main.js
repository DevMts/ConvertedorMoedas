"use strict";
class CurrencyConverter {
    sourceCurrency;
    sourceAmount;
    targetCurrency;
    exchangeRate;
    constructor() {
        this.sourceCurrency = '';
        this.sourceAmount = 0;
        this.targetCurrency = '';
        this.exchangeRate = 0;
    }
    init() {
        const form = document.getElementById('form');
        form?.addEventListener('submit', (ev) => {
            ev.preventDefault();
            const formData = new FormData(form);
            if (formData.get('sourceCurrency') === formData.get('targetCurrency')) {
                alert('Source and target currencies cannot be the same!');
                return;
            }
            else {
                this.sourceCurrency = formData.get('sourceCurrency') || '';
                this.sourceAmount = Number(formData.get('sourceAmount'));
                this.targetCurrency = formData.get('targetCurrency') || '';
                console.log(this.sourceCurrency, this.sourceAmount, this.targetCurrency);
                this.fetchExchangeRate();
            }
        });
    }
    prepareUrl() {
        return `${this.sourceCurrency}-${this.targetCurrency}`;
    }
    async fetchExchangeRate() {
        const apiUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://economia.awesomeapi.com.br/last/${this.prepareUrl()}`)}`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok)
                throw new Error(`Request failed: ${response.statusText}`);
            const data = await response.json();
            console.log("API Response:", data);
            if (!data.contents)
                throw new Error("Empty or undefined content");
            const parsedData = JSON.parse(data.contents);
            console.log("Parsed JSON:", parsedData);
            const currencyKey = Object.keys(parsedData)[0];
            const bidValue = parsedData[currencyKey]?.bid || "Error retrieving bid";
            const currencyCode = parsedData[currencyKey]?.codein || "Error retrieving code";
            console.log(currencyCode);
            console.log(`Exchange rate (${currencyKey}):`, bidValue);
            this.exchangeRate = parseFloat(bidValue);
            this.calculateConversion(currencyCode);
        }
        catch (error) {
            console.error("Error fetching API values:", error);
        }
        return undefined;
    }
    calculateConversion(currencyCode) {
        console.log(this.exchangeRate);
        console.log(this.sourceAmount);
        const result = this.sourceAmount * this.exchangeRate;
        console.log(`Converted amount: ${result}`);
        this.displayResult(result, currencyCode);
    }
    displayResult(result, currencyCode) {
        document.getElementById('result').innerHTML = currencyCode + ' ' + result.toFixed(2).toString();
    }
}
const currencyConverter = new CurrencyConverter();
document.querySelector('#submit')?.addEventListener('click', () => {
    currencyConverter.init();
});
