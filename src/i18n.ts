import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  'pt-BR': {
    translation: {
      "dashboard": "Relatórios",
      "transactions": "Transações",
      "users": "Usuários",
      "settings": "Configurações",
      "waiting": "Aguardando Atribuição",
      "logout": "Sair",
      "income": "Entradas",
      "expense": "Saídas",
      "balance": "Saldo Líquido",
      "total_balance": "Saldo Total",
      "new_transaction": "Nova Transação",
      "search": "Pesquisar...",
      "filters": "Filtros",
      "appearance": "Aparência",
      "dark_mode": "Modo Escuro",
      "color_palette": "Paleta de Cores",
      "regional": "Regional",
      "currency": "Moeda Principal",
      "language": "Idioma do Sistema",
      "palette_default": "Padrão",
      "palette_lavender": "Lavanda",
      "palette_green": "Verde"
    }
  },
  'en-US': {
    translation: {
      "dashboard": "Reports",
      "transactions": "Transactions",
      "users": "Users",
      "settings": "Settings",
      "waiting": "Waiting for Assignment",
      "logout": "Logout",
      "income": "Incomes",
      "expense": "Expenses",
      "balance": "Net Balance",
      "total_balance": "Total Balance",
      "new_transaction": "New Transaction",
      "search": "Search...",
      "filters": "Filters",
      "appearance": "Appearance",
      "dark_mode": "Dark Mode",
      "color_palette": "Color Palette",
      "regional": "Regional",
      "currency": "Main Currency",
      "language": "System Language",
      "palette_default": "Default",
      "palette_lavender": "Lavender",
      "palette_green": "Green"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pt-BR',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
