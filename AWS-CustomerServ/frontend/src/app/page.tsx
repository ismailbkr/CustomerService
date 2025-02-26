'use client';

import { useState } from 'react';
import Modal from '@/components/Modal';
import { LoginForm, RegisterForm } from '@/components/AuthForms';
import { ChatBubbleLeftRightIcon, LightBulbIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);

  const handleAuthSuccess = (email: string) => {
    setUser({ email });
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
  };

  const features = [
    {
      name: 'Akıllı Chatbot',
      description: 'Yapay zeka destekli chatbot ile ürünleriniz hakkında anında bilgi alın.',
      icon: ChatBubbleLeftRightIcon,
    },
    {
      name: 'Kişiselleştirilmiş Deneyim',
      description: 'Size özel öneriler ve çözümler sunan akıllı asistan.',
      icon: LightBulbIcon,
    },
    {
      name: 'Güvenli İletişim',
      description: 'AWS altyapısı ile güvenli ve hızlı iletişim.',
      icon: ShieldCheckIcon,
    },
  ];

  return (
    <div className="bg-gray-900 min-h-screen">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex items-center gap-x-2">
            <ChatBubbleLeftRightIcon className="h-8 w-8 text-indigo-500" />
            <span className="text-xl font-bold text-white">AI Assistant</span>
          </div>
          <div className="flex gap-x-4">
            {user ? (
              <div className="text-sm font-semibold text-gray-300">
                Hoş geldin, {user.email}
              </div>
            ) : (
              <>
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="text-sm font-semibold leading-6 text-gray-300 hover:text-indigo-400 transition-colors"
                >
                  Giriş Yap
                </button>
                <button
                  onClick={() => setIsRegisterOpen(true)}
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-200 ease-in-out transform hover:scale-105"
                >
                  Kayıt Ol
                </button>
              </>
            )}
          </div>
        </nav>
      </header>

      <main>
        {/* Hero section */}
        <div className="relative isolate pt-14">
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-800 to-purple-800 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
            />
          </div>

          <div className="py-24 sm:py-32 lg:pb-40">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center">
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                  Müşteri Hizmetlerinde Yapay Zeka Devrimi
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-300">
                  AWS destekli yapay zeka asistanımız ile müşterilerinize 7/24 kesintisiz hizmet sunun.
                  Akıllı chatbot teknolojimiz sayesinde müşteri memnuniyetini artırın.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                  {!user && (
                    <>
                      <button
                        onClick={() => setIsRegisterOpen(true)}
                        className="rounded-md bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-200 ease-in-out transform hover:scale-105"
                      >
                        Hemen Başla
                      </button>
                      <button
                        onClick={() => setIsLoginOpen(true)}
                        className="text-base font-semibold leading-6 text-gray-300 hover:text-indigo-400 transition-colors"
                      >
                        Giriş Yap <span aria-hidden="true">→</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature section */}
        <div className="mx-auto max-w-7xl px-6 sm:mt-16 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-400">Daha Hızlı Çözümler</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Neden Bizi Tercih Etmelisiniz?
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Modern teknolojiler ve güçlü altyapımız ile işletmenize değer katıyoruz.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none mb-20">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col bg-gray-800/50 p-6 rounded-2xl backdrop-blur-lg transition-transform duration-300 hover:transform hover:scale-105">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                    <feature.icon className="h-6 w-6 flex-none text-indigo-400" aria-hidden="true" />
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-300">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </main>

      {/* Login Modal */}
      <Modal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        title="Giriş Yap"
      >
        <LoginForm onSuccess={handleAuthSuccess} />
      </Modal>

      {/* Register Modal */}
      <Modal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        title="Kayıt Ol"
      >
        <RegisterForm onSuccess={handleAuthSuccess} />
      </Modal>
    </div>
  );
}
