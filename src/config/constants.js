// src/config/constants.js

// Currency options
const currency = [
    {
      title: 'Сом',
      value: 'SOM',
      id: 1,
      icon: '⃀',
    },
    {
      title: 'USD',
      value: 'USD',
      id: 2,
      icon: '$',
    },
  ];
  
  // Payment period options
  const paymentPeriod = [
    { title: 'Посуточно', value: 'daily', id: 1 },
    { title: 'Еженедельно', value: 'weekly', id: 2 },
    { title: 'Ежемесячно', value: 'monthly', id: 3 },
    { title: 'Ежегодно', value: 'yearly', id: 4 },
  ];
  
  // Extract just the values for schema validation
  const currencyValues = currency.map(c => c.value);
  const paymentPeriodValues = paymentPeriod.map(p => p.value);
  
  module.exports = {
    currency,
    paymentPeriod,
    currencyValues,
    paymentPeriodValues
  };