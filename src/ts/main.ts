class CurrencyConverter {
    sourceCurrency: string;
    sourceAmount: number;
    targetCurrency: string;
    exchangeRate: number;

    constructor() {
        this.sourceCurrency = '';
        this.sourceAmount = 0;
        this.targetCurrency = '';
        this.exchangeRate = 0;
    }

    init() {
        const form = document.getElementById('form') as HTMLFormElement;
        form?.addEventListener('submit', (ev) => {
            ev.preventDefault();
            const formData = new FormData(form);

            if (formData.get('sourceCurrency') === formData.get('targetCurrency')) {
                alert('Source and target currencies cannot be the same!');
                return;
            } else {
                this.sourceCurrency = (formData.get('sourceCurrency') as string) || '';
                this.sourceAmount = Number(formData.get('sourceAmount'));
                this.targetCurrency = (formData.get('targetCurrency') as string) || '';

                console.log(this.sourceCurrency, this.sourceAmount, this.targetCurrency);
                this.fetchExchangeRate();
            }
        });
    }

    prepareUrl(): string {
        return `${this.sourceCurrency}-${this.targetCurrency}`;
    }

    async fetchExchangeRate(): Promise<number | undefined> {
        const apiUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://economia.awesomeapi.com.br/last/${this.prepareUrl()}`)}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`Request failed: ${response.statusText}`);

            const data = await response.json();
            console.log("API Response:", data);

            if (!data.contents) throw new Error("Empty or undefined content");

            const parsedData = JSON.parse(data.contents);
            console.log("Parsed JSON:", parsedData);

            const currencyKey = Object.keys(parsedData)[0];
            const bidValue = parsedData[currencyKey]?.bid || "Error retrieving bid";
            const currencyCode = parsedData[currencyKey]?.codein || "Error retrieving code";
            console.log(currencyCode);

            console.log(`Exchange rate (${currencyKey}):`, bidValue);

            this.exchangeRate = parseFloat(bidValue);
            this.calculateConversion(currencyCode);

        } catch (error) {
            console.error("Error fetching API values:", error);
        }
        return undefined;
    }

    calculateConversion(currencyCode: string) {
        console.log(this.exchangeRate);
        console.log(this.sourceAmount);

        const result: number = this.sourceAmount * this.exchangeRate;
        console.log(`Converted amount: ${result}`);
        this.displayResult(result, currencyCode);
    }

    displayResult(result: number, currencyCode: string) {
        (document.getElementById('result') as HTMLElement).innerHTML = currencyCode + ' ' + result.toFixed(2).toString();
    }
}

const currencyConverter = new CurrencyConverter();
document.querySelector('#submit')?.addEventListener('click', () => {
    currencyConverter.init();
});
