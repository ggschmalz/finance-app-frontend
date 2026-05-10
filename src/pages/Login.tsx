import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export function Login() {
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      if (credentialResponse.credential) {
        // Envia o token do Google para o nosso backend Django
        await authService.googleLogin(credentialResponse.credential);
        // Se der sucesso, redireciona para o dashboard
        navigate('/');
      }
    } catch (error) {
      console.error('Erro na autenticação com o backend:', error);
      alert('Falha ao autenticar. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-2xl shadow-lg">
            M
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          MonetizAI
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Acesse a sua gestão financeira inteligente
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 flex flex-col items-center">
          
          <div className="mb-6 w-full text-center">
            <p className="text-sm text-gray-500 mb-4">Escolha a sua forma de acesso:</p>
            <div className="flex justify-center" data-testid="google-login-wrapper">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => console.error('Falha no Login do Google')}
                theme="outline"
                size="large"
                shape="rectangular"
                width="300"
              />
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}