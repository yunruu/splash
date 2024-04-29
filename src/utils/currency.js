export const currencies = [
    {
        value: 'EUR',
        label: '€'
    },
    {
        value: 'SGD',
        label: '$'
    }
];

export const getCurrencySymbol = (currency) => {
    const currencyObj = currencies.find((c) => c.value === currency);
    return currencyObj ? currencyObj.label : '';
};
