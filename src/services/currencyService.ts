import axios from 'axios';

export interface ExchangeRates {
  USD: number;
  EUR: number;
  date: string;
}

export const currencyService = {
  // Usando a API do Banco Central (PT-AX) ou AwesomeAPI (mais simples para JSON direto)
  getLatestRates: async (): Promise<ExchangeRates> => {
    try {
      // AwesomeAPI é excelente para conversões rápidas de BRL
      const { data } = await axios.get('https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL');
      
      return {
        USD: parseFloat(data.USDBRL.bid),
        EUR: parseFloat(data.EURBRL.bid),
        date: new Date().toLocaleDateString('pt-BR')
      };
    } catch (error) {
      console.error('Erro ao buscar cotações:', error);
      // Fallback estático em caso de falha na API
      return {
        USD: 5.0,
        EUR: 5.4,
        date: 'Indisponível'
      };
    }
  }
};
