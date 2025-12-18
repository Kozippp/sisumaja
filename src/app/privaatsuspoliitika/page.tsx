
import React from 'react';

export default function Privaatsuspoliitika() {
  return (
    <div className="bg-black min-h-screen pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Privaatsuspoliitika</h1>
        
        <div className="prose prose-invert max-w-none text-gray-300">
          <p className="mb-4">
            Viimati uuendatud: {new Date().toLocaleDateString('et-EE')}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Sissejuhatus</h2>
            <p className="mb-4">
              Sisumaja ("meie") hindab teie privaatsust. Käesolev privaatsuspoliitika selgitab, kuidas me kogume, kasutame ja kaitseme teie isikuandmeid, kui külastate meie veebilehte või kasutate meie teenuseid.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">2. Kogutavad andmed</h2>
            <p className="mb-4">
              Me võime koguda järgmisi andmeid:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Kontaktandmed (nimi, e-posti aadress, telefoninumber), kui võtate meiega ühendust;</li>
              <li>Tehnilised andmed (IP-aadress, veebilehitseja tüüp, seadme info);</li>
              <li>Kasutusandmed (kuidas te meie veebilehte kasutate).</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">3. Andmete kasutamine</h2>
            <p className="mb-4">
              Me kasutame teie andmeid selleks, et:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Vastata teie päringutele ja pakkuda teenuseid;</li>
              <li>Parandada meie veebilehe kasutajakogemust;</li>
              <li>Saata teile teavet meie teenuste kohta (ainult teie nõusolekul);</li>
              <li>Täita seadusest tulenevaid kohustusi.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">4. Andmete jagamine</h2>
            <p className="mb-4">
              Me ei müü ega rendi teie isikuandmeid kolmandatele isikutele. Me võime jagada andmeid usaldusväärsete teenusepakkujatega, kes aitavad meil veebilehte hallata või teenuseid osutada, tingimusel et nad hoiavad andmeid konfidentsiaalsena.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">5. Andmete turvalisus</h2>
            <p className="mb-4">
              Me rakendame asjakohaseid tehnilisi ja korralduslikke meetmeid, et kaitsta teie isikuandmeid loata juurdepääsu, muutmise või hävitamise eest. Siiski palume arvestada, et ükski andmeedastus internetis ei ole 100% turvaline.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">6. Teie õigused</h2>
            <p className="mb-4">
              Teil on õigus:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Küsida teavet oma isikuandmete kohta;</li>
              <li>Nõuda ebaõigete andmete parandamist;</li>
              <li>Nõuda andmete kustutamist ("õigus olla unustatud");</li>
              <li>Võtta tagasi oma nõusolek andmete töötlemiseks.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">7. Kontakt</h2>
            <p className="mb-4">
              Andmekaitsega seotud küsimustes võtke meiega ühendust aadressil <a href="mailto:info@sisumaja.ee" className="text-white underline hover:text-gray-300">info@sisumaja.ee</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

