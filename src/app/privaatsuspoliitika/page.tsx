
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
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Andmekontroller</h2>
            <p className="mb-4">
              Isikuandmete töötleja (andmekontroller) on <strong>Kozip Productions OÜ</strong> (registrikood: 16496138). Käesolev privaatsuspoliitika selgitab, kuidas me kogume, kasutame ja kaitseme teie isikuandmeid vastavalt EL üldisele andmekaitse määrusele (GDPR) ja Eesti isikuandmete kaitse seadusele, kui külastate meie veebilehte või kasutate meie teenuseid.
            </p>
            <p className="mb-4">
              Kontaktandmed andmekaitse küsimustes: <a href="mailto:info@kozip.ee" className="text-white underline hover:text-gray-300">info@kozip.ee</a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">2. Kogutavad andmed ja õiguslik alus</h2>
            <p className="mb-4">
              Me võime koguda järgmisi andmeid:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Kontaktandmed</strong> (nimi, e-posti aadress, telefoninumber), kui võtate meiega ühendust — õiguslik alus: teie nõusolek või enne lepingut või lepingu täitmist vajalikud sammud (GDPR art 6 lg 1 p a või b);</li>
              <li><strong>Tehnilised andmed</strong> (IP-aadress, veebilehitseja tüüp, seadme info) — õiguslik alus: meie legitiimne huvi veebilehe turvalisuse ja toimimise tagamiseks (GDPR art 6 lg 1 p f);</li>
              <li><strong>Kasutusandmed</strong> (kuidas te meie veebilehte kasutate, nt analüütilised andmed) — õiguslik alus: nõusolek või legitiimne huvi veebilehe parendamiseks (GDPR art 6 lg 1 p a või f).</li>
            </ul>
            <p className="mb-4">
              Isikuandmete esitamine on vabatahtlik; kui te ei esita teatud andmeid, võime osade teenuste osutamine olla võimatu (nt kontaktivormi puhul).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">3. Andmete kasutamine</h2>
            <p className="mb-4">
              Me kasutame teie andmeid selleks, et:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Vastata teie päringutele ja pakkuda teenuseid;</li>
              <li>Parandada meie veebilehe kasutajakogemust;</li>
              <li>Saata teile teavet meie teenuste kohta ainult teie nõusolekul;</li>
              <li>Täita seadusest tulenevaid kohustusi.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">4. Andmete säilitamine</h2>
            <p className="mb-4">
              Isikuandmeid säilitame ainult nii kaua, kui on vajalik nimetatud eesmärkide saavutamiseks või seadusest tulenevaks säilitamiseks. Kontaktpäringute andmeid säilitame tavaliselt kuni kolm aastat pärast viimast suhtlust, kui seadus ei nõua pikemat. Tehnilisi ja logiandmeid võime säilitada turvalisuse huvides kuni 12 kuud, kui seadus ei sätesta teisiti.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">5. Andmete jagamine ja edastamine</h2>
            <p className="mb-4">
              Me ei müü ega rendi teie isikuandmeid kolmandatele isikutele. Me võime jagada andmeid usaldusväärsete teenusepakkujatega (nt hosting, e-posti teenused), kes aitavad meil veebilehte hallata või teenuseid osutada, tingimusel et nad kohaldavad sobivaid andmekaitse meetmeid ja toimivad meie juhiste kohaselt. Vajadusel võib andmeid edastada EL/EEA piiridest väljapoole; sellisel juhul tagame sobivad kaitsemeetmed (nt standardlepinguclauslid või adekvaatsusotsused).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">6. Andmete turvalisus</h2>
            <p className="mb-4">
              Me rakendame asjakohaseid tehnilisi ja korralduslikke meetmeid (sh juurdepääsu piiramine, krüptimine vajadusel), et kaitsta teie isikuandmeid loata juurdepääsu, muutmise või hävitamise eest. Ükski andmeedastus internetis ei ole 100% turvaline; me püüame riskid minimeerida.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">7. Teie õigused (GDPR)</h2>
            <p className="mb-4">
              Teile kuuluvad järgmised õigused:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Juurdepääsu õigus</strong> — küsida teavet oma isikuandmete kohta ja saada koopia;</li>
              <li><strong>Parandamise õigus</strong> — nõuda ebaõigete või puudulike andmete parandamist;</li>
              <li><strong>Kustutamise õigus</strong> — nõuda andmete kustutamist ("õigus olla unustatud"), kui seadus seda lubab;</li>
              <li><strong>Töötlemise piiramise õigus</strong> — teatud tingimustel nõuda andmete töötlemise ajutist piiramist;</li>
              <li><strong>Andmete portatiivsus</strong> — teatud andmete puhul saada andmed masinloetavas vormis või lasta need teisele töötlejale edastada;</li>
              <li><strong>Vastuväitmise õigus</strong> — vastu väita isikuandmete töötlemisele, mis põhineb legitiimsel huvil;</li>
              <li><strong>Nõusoleku tagasivõtmine</strong> — võtta tagasi nõusolek, mis ei mõjuta enne tagasivõtmist tehtud töötlemise seaduspärasust.</li>
            </ul>
            <p className="mb-4">
              Õiguste kasutamiseks võtke meiega ühendust aadressil <a href="mailto:info@kozip.ee" className="text-white underline hover:text-gray-300">info@kozip.ee</a>. Teil on ka <strong>õigus esitada kaebus</strong> järelevalvavale asutusele: Eesti Andmekaitse Inspektsioon (<a href="https://www.aki.ee" className="text-white underline hover:text-gray-300" target="_blank" rel="noopener noreferrer">www.aki.ee</a>).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">8. Muudatused</h2>
            <p className="mb-4">
              Me võime käesolevat privaatsuspoliitikat aeg-ajalt uuendada. Olulistest muudatustest teavitame veebilehel või e-posti teel. Soovitame privaatsuspoliitikat perioodiliselt üle vaadata.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">9. Kontakt</h2>
            <p className="mb-4">
              Andmekaitse ja privaatsusega seotud küsimustes võtke meiega ühendust: <strong>Kozip Productions OÜ</strong>, registrikood 16496138, e-post <a href="mailto:info@kozip.ee" className="text-white underline hover:text-gray-300">info@kozip.ee</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
