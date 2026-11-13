import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  'pt-BR': {
    translation: {
      "nav_home": "Página Inicial",
      "nav_dashboard": "Relatório",
      "nav_transactions": "Transações",
      "nav_credit_cards": "Cartões de crédito",
      "nav_users": "Usuários",
      "nav_settings": "Configurações",
      "dashboard": "Relatórios",
      "transactions": "Transações",
      "credit_cards": "Cartões de Crédito",
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
      "nav_home": "Home",
      "nav_dashboard": "Report",
      "nav_transactions": "Transactions",
      "nav_credit_cards": "Credit cards",
      "nav_users": "Users",
      "nav_settings": "Settings",
      "dashboard": "Reports",
      "transactions": "Transactions",
      "credit_cards": "Credit Cards",
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
