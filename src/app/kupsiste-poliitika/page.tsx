
import React from 'react';

export default function KupsistePoliitika() {
  return (
    <div className="bg-black min-h-screen pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Küpsiste poliitika</h1>
        
        <div className="prose prose-invert max-w-none text-gray-300">
          <p className="mb-4">
            Viimati uuendatud: {new Date().toLocaleDateString('et-EE')}
          </p>
          <p className="mb-4">
            Küpsiste töötleja on <strong>Kozip Productions OÜ</strong> (registrikood 16496138). Täpsem info isikuandmete käsitlemise kohta on meie <a href="/privaatsuspoliitika" className="text-white underline hover:text-gray-300">privaatsuspoliitikas</a>.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Mis on küpsised?</h2>
            <p className="mb-4">
              Küpsised (cookies) on väikesed tekstifailid, mis salvestatakse teie seadmesse, kui külastate veebilehte. Need aitavad veebilehel meelde jätta teie eelistusi ja parandada kasutajakogemust.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">2. Kuidas me küpsiseid kasutame?</h2>
            <p className="mb-4">
              Kozip (Kozip Productions OÜ) kasutab küpsiseid järgmistel eesmärkidel:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Hädavajalikud küpsised:</strong> Need on vajalikud veebilehe toimimiseks ja ei saa meie süsteemides välja lülitada.</li>
              <li><strong>Analüütilised küpsised:</strong> Aitavad meil mõista, kuidas külastajad veebilehte kasutavad, et saaksime seda parendada (nt Google Analytics).</li>
              <li><strong>Funktsionaalsed küpsised:</strong> Võimaldavad veebilehel pakkuda paremat funktsionaalsust ja isikupärastamist.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">3. Kolmandate osapoolte küpsised</h2>
            <p className="mb-4">
              Meie veebilehel võivad olla ka kolmandate osapoolte teenusepakkujate (nt YouTube, Facebook, TikTok) küpsised, mis on seotud sisu jagamise või statistika kogumisega. Me ei kontrolli neid küpsiseid.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">4. Küpsiste haldamine</h2>
            <p className="mb-4">
              Teil on võimalik oma veebilehitseja seadetes küpsiseid keelata või kustutada. Pange tähele, et mõned veebilehe funktsioonid ei pruugi ilma küpsisteta korralikult töötada.
            </p>
            <p className="mb-4">
              Täpsemat infot küpsiste haldamise kohta leiate oma veebilehitseja "Abi" (Help) sektsioonist.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">5. Kontakt</h2>
            <p className="mb-4">
              Kui teil on küsimusi meie küpsiste poliitika kohta, võtke meiega ühendust aadressil <a href="mailto:info@kozip.ee" className="text-white underline hover:text-gray-300">info@kozip.ee</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

