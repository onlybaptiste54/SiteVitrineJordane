import Link from "next/link";

export default function MentionsLegales() {
  return (
    <main className="min-h-screen bg-merino-ecru py-20 px-4">
      <div className="container mx-auto max-w-3xl">
        <Link href="/" className="text-merino-orange font-bold hover:underline mb-8 inline-block">&larr; Retour</Link>

        <h1 className="text-3xl md:text-4xl font-extrabold text-merino-blue mb-10">Mentions legales</h1>

        <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-merino-blue mb-3">Editeur du site</h2>
            <p>
              SAS MERINO au capital de 200 &euro;<br />
              Siege social : 171 Rue de Newcastle, 54000 Nancy, France<br />
              SIRET : 932 380 116 00016<br />
              TVA : FR54932380116<br />
              Carte professionnelle : CPI 5401 2024 000 000 013 delivree par Grand Nancy Metropole
              Meurthe-et-Moselle, 53 Rue Stanislas, 54000 Nancy<br />
              Dirigeants : Jordane MOREL, Louis PETITCOLIN<br />
              Responsable de la publication : Jordane MOREL
            </p>
            <p className="mt-3 text-sm text-gray-500 italic">
              La societe ne doit recevoir ni detenir d&apos;autres fonds, effets ou valeurs que ceux
              representatifs de sa remuneration ou de sa commission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-merino-blue mb-3">Hebergement</h2>
            <p>
              L&apos;hebergement du site est assure par la societe OVH, 140 Quai du Sartel, 59100 Roubaix.<br />
              Telephone : 08 203 203 63
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-merino-blue mb-3">Propriete intellectuelle</h2>
            <p>
              L&apos;ensemble de ce site releve de la legislation francaise et internationale sur le droit d&apos;auteur
              et la propriete intellectuelle.
            </p>
            <p className="mt-2">
              Les contenus editoriaux (textes, documents, photographies) sont, sauf dispositions contraires,
              la propriete intellectuelle exclusive de MERINO.
            </p>
            <p className="mt-2">
              Tous les droits de reproduction sont reserves. La reproduction ou representation, integrale ou partielle,
              de ce site sur un support electronique ou tout autre support quel qu&apos;il soit est formellement interdite
              sauf autorisation expresse.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-merino-blue mb-3">Liens externes</h2>
            <p>
              Le site peut contenir des liens hypertextes externes, pointant vers d&apos;autres sites internet independants.
              Ces liens ne constituent, en aucun cas, une approbation ou un partenariat entre MERINO et les societes
              editrices des sites externes. L&apos;editeur du present site ne saurait etre tenu responsable de leurs contenus,
              leurs produits, leurs publicites ou tous elements ou services presentes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-merino-blue mb-3">Estimation en ligne</h2>
            <p>
              L&apos;estimation proposee sur ce site est purement indicative et algorithmique. Elle ne constitue en aucun cas
              une evaluation officielle ni un engagement de la part de MERINO. Seule une visite sur place par un agent
              immobilier permet d&apos;etablir une estimation fiable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-merino-blue mb-3">Force majeure</h2>
            <p>
              La responsabilite de l&apos;editeur du site ne pourra etre engagee en cas de force majeure
              ou de faits independants de sa volonte.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-merino-blue mb-3">Modifications des mentions legales</h2>
            <p>
              L&apos;editeur se reserve le droit de modifier, librement et a tout moment, les mentions legales du site.
              L&apos;utilisation du site constitue l&apos;acceptation des mentions legales en vigueur.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-merino-blue mb-3">Loi applicable</h2>
            <p>
              Le site agencemerino.com est regi par la loi francaise.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-merino-blue mb-3">Conception et developpement</h2>
            <p>
              Site concu et developpe par <strong>AetherIA</strong>.<br />
              Contact : <a href="mailto:contact@agenceaetheria.com" className="text-merino-orange hover:underline">contact@agenceaetheria.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-merino-blue mb-3">Contact</h2>
            <p>
              Pour toute question relative au site :<br />
              Email : <a href="mailto:jordane@agencemerino.com" className="text-merino-orange hover:underline">jordane@agencemerino.com</a><br />
              Telephone : <a href="tel:0695067320" className="text-merino-orange hover:underline">06 95 06 73 20</a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
