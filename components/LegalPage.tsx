
import React from 'react';

interface LegalPageProps {
  type: 'privacy' | 'terms';
}

const LegalPage: React.FC<LegalPageProps> = ({ type }) => {
  const isPrivacy = type === 'privacy';

  return (
    <div className="py-24 px-6 sm:px-12 lg:px-24 max-w-4xl mx-auto animate-fadeIn">
      <div className="bg-white p-10 sm:p-16 rounded-[50px] shadow-xl border border-red-50">
        <h1 className="text-4xl font-black text-gray-900 mb-12 border-l-8 border-red-500 pl-6">
          {isPrivacy ? 'Adatkezelési Nyilatkozat' : 'Általános Szerződési Feltételek'}
        </h1>
        
        <div className="prose prose-lg text-gray-600 font-medium space-y-8 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4">1. Bevezetés</h2>
            <p>
              A Kincsek Művészeti Klub (üzemeltető: Suki Edina és Suki Zita) elkötelezett a látogatók és ügyfelek személyiségi jogainak és adatainak védelme mellett. Jelen dokumentum tájékoztatást nyújt a weboldal használatának feltételeiről és az adatkezelés módjáról.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4">{isPrivacy ? '2. Milyen adatokat kezelünk?' : '2. Szolgáltatások igénybevétele'}</h2>
            <p>
              {isPrivacy 
                ? 'Kizárólag olyan adatokat gyűjtünk (név, email, telefonszám), amelyeket Ön önkéntesen megad a jelentkezési űrlapokon keresztül. Ezeket az adatokat csak a programokkal kapcsolatos kapcsolattartásra használjuk.' 
                : 'Programjaink és foglalkozásaink előzetes regisztrációhoz kötöttek. A jelentkezés a weboldalon található űrlap kitöltésével vagy telefonos megkereséssel történik.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4">{isPrivacy ? '3. Adattárolás' : '3. Lemondási feltételek'}</h2>
            <p>
              {isPrivacy 
                ? 'Az adatokat biztonságos módon tároljuk, harmadik félnek nem adjuk ki, kivéve ha azt törvényi kötelezettség előírja. Bármikor kérheti adatai törlését vagy módosítását.' 
                : 'Kérjük, hogy akadályoztatás esetén a program kezdete előtt legalább 24 órával jelezze távolmaradását, hogy a helyet más gyermekek számára felszabadíthassuk.'}
            </p>
          </section>

          <section className="bg-red-50 p-8 rounded-3xl border border-red-100">
            <h2 className="text-xl font-bold text-red-600 mb-4">Kapcsolat</h2>
            <p className="text-sm">
              Amennyiben kérdése van a fentiekkel kapcsolatban, keressen minket bizalommal a <strong>Kincsek9@gmail.com</strong> címen vagy a weboldalon megadott telefonszámokon.
            </p>
          </section>
          
          <p className="text-xs text-gray-400 mt-12 pt-8 border-t border-gray-100">
            Utolsó frissítés: {new Date().toLocaleDateString('hu-HU')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;
