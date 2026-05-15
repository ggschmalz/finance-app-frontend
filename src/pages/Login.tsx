import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export function Login() {
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      if (credentialResponse.credential) {
        await authService.googleLogin(credentialResponse.credential);
        navigate('/');
      }
    } catch (error) {
      console.error('Erro na autenticação com o backend:', error);
      alert('Falha ao autenticar. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-500">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-brand-600 rounded-[2.5rem] flex items-center justify-center text-white font-black text-4xl shadow-2xl transform rotate-6 hover:rotate-0 transition-all duration-500">
            M
          </div>
        </div>
        <h2 className="mt-8 text-center text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
          MonetizAI
        </h2>
        <p className="mt-3 text-center text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          Inteligência Financeira de Elite
        </p>
      </div>

      <div className="mt-12 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-800 py-12 px-8 sm:px-12 shadow-2xl rounded-[3rem] border border-gray-100 dark:border-slate-700/50 flex flex-col items-center transition-all">
          
          <div className="w-full text-center">
            <p className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.3em] mb-10">Inicie sua jornada</p>
            <div className="flex justify-center w-full transform hover:scale-105 transition-transform duration-300" data-testid="google-login-wrapper">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => console.error('Falha no Login do Google')}
                theme="filled_blue"
                size="large"
                shape="pill"
                width="100%"
                text="continue_with"
              />
            </div>
            <div className="mt-12 space-y-4">
               <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center leading-relaxed font-bold uppercase tracking-tighter">
                Ao acessar, você concorda com nossos <br/> 
                <span className="text-brand-600 dark:text-brand-400 cursor-pointer hover:underline">Termos de Uso</span> e <span className="text-brand-600 dark:text-brand-400 cursor-pointer hover:underline">Privacidade</span>.
              </p>
            </div>
          </div>
          
        </div>
        
        <div className="mt-10 text-center">
          <p className="text-[9px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.4em]">v1.0.0 Alpha Edition</p>
        </div>
      </div>
    </div>
  );
}
