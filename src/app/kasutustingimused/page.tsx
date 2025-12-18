
import React from 'react';

export default function Kasutustingimused() {
  return (
    <div className="bg-black min-h-screen pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Kasutustingimused</h1>
        
        <div className="prose prose-invert max-w-none text-gray-300">
          <p className="mb-4">
            Viimati uuendatud: {new Date().toLocaleDateString('et-EE')}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Üldtingimused</h2>
            <p className="mb-4">
              Tere tulemast Sisumaja veebilehele (edaspidi "Veebileht"). Veebilehte külastades ja kasutades nõustute järgima käesolevaid kasutustingimusi. Kui te ei nõustu nende tingimustega, palume teil Veebilehte mitte kasutada.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">2. Teenuste kirjeldus</h2>
            <p className="mb-4">
              Sisumaja pakub meelelahutuslikku sisu ja turundusteenuseid. Me jätame endale õiguse muuta, peatada või lõpetada Veebilehe või selle osade teenuse pakkumine igal ajal ilma etteteatamata.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">3. Intellektuaalomand</h2>
            <p className="mb-4">
              Kogu Veebilehel olev sisu, sealhulgas tekstid, graafika, logod, pildid, videod ja tarkvara, on Sisumaja omand või litsentsitud Sisumajale ning on kaitstud autoriõiguse ja muude intellektuaalomandi seadustega. Sisu kopeerimine, levitamine või muul viisil kasutamine ilma meie eelneva kirjaliku nõusolekuta on keelatud.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">4. Kasutaja kohustused</h2>
            <p className="mb-4">
              Veebilehe kasutamisel kohustute mitte:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Kasutama Veebilehte ebaseaduslikel eesmärkidel;</li>
              <li>Häirima Veebilehe tööd või servereid;</li>
              <li>Edastama viiruseid või muud kahjulikku tarkvara;</li>
              <li>Koguma teiste kasutajate andmeid ilma nende nõusolekuta.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">5. Vastutuse piiramine</h2>
            <p className="mb-4">
              Sisumaja ei vastuta otseste ega kaudsete kahjude eest, mis võivad tekkida Veebilehe kasutamisest või selle kasutamise võimatusest. Me ei garanteeri, et Veebileht on alati kättesaadav või veavaba.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">6. Muudatused tingimustes</h2>
            <p className="mb-4">
              Me võime käesolevaid kasutustingimusi igal ajal muuta. Muudatused jõustuvad kohe pärast nende avaldamist Veebilehel. Veebilehe edasine kasutamine pärast muudatuste avaldamist tähendab teie nõusolekut uute tingimustega.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">7. Kontakt</h2>
            <p className="mb-4">
              Kui teil on küsimusi nende kasutustingimuste kohta, võtke meiega ühendust aadressil <a href="mailto:info@sisumaja.ee" className="text-white underline hover:text-gray-300">info@sisumaja.ee</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

