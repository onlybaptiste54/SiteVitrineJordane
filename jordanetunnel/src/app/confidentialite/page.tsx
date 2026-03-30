import Link from "next/link";

export default function Confidentialite() {
  return (
    <main className="min-h-screen bg-merino-ecru py-20 px-4">
      <div className="container mx-auto max-w-3xl">
        <Link href="/" className="text-merino-orange font-bold hover:underline mb-8 inline-block">&larr; Retour</Link>

        <h1 className="text-3xl md:text-4xl font-extrabold text-merino-blue mb-10">Politique de confidentialite</h1>

        <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-merino-blue mb-3">Responsable du traitement</h2>
            <p>
              Le responsable du traitement des donnees est la societe MERINO, representee par Jordane MOREL.<br />
              Siege social : 171 Rue de Newcastle, 54000 Nancy, France.<br />
              Contact : <a href="mailto:jordane@agencemerino.com" className="text-merino-orange hover:underline">jordane@agencemerino.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-merino-blue mb-3">Donnees collectees</h2>
            <p>
              Lorsque vous utilisez le formulaire d&apos;estimation, les informations suivantes sont collectees :
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Prenom et nom</li>
              <li>Adresse email</li>
              <li>Numero de telephone</li>
              <li>Informations sur le bien (type, adresse, surface, nombre de chambres, etc.)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-merino-blue mb-3">Utilisation des donnees</h2>
            <p>
              Vos donnees sont utilisees <strong>exclusivement</strong> pour :
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Vous envoyer par email le resultat de votre estimation immobiliere</li>
              <li>Permettre a un agent MERINO de vous recontacter pour affiner l&apos;estimation</li>
            </ul>
            <p className="mt-3 font-medium">
              Vos donnees ne sont pas enregistrees dans une base de donnees. Elles sont uniquement transmises
              par email a l&apos;agent MERINO concerne et a vous-meme, puis ne sont plus conservees par notre systeme.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-merino-blue mb-3">Stockage et conservation</h2>
            <p>
              <strong>Aucune base de donnees</strong> n&apos;est utilisee pour stocker vos informations personnelles.
              Les donnees transitent uniquement le temps de generer l&apos;estimation et d&apos;envoyer les emails.
              Aucune donnee n&apos;est conservee sur nos serveurs apres l&apos;envoi.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-merino-blue mb-3">Partage avec des tiers</h2>
            <p>
              Vos donnees ne sont <strong>jamais vendues, louees ou transmises</strong> a des tiers a des fins commerciales
              ou publicitaires. Les seuls services tiers impliques sont :
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Le service d&apos;envoi d&apos;emails (pour la transmission de l&apos;estimation)</li>
              <li>Un modele d&apos;intelligence artificielle (Anthropic Claude) pour le calcul de l&apos;estimation — les donnees
                du bien sont transmises de maniere anonyme, sans vos coordonnees personnelles</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-merino-blue mb-3">Vos droits</h2>
            <p>
              Conformement au RGPD, vous disposez des droits suivants :
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Droit d&apos;acces a vos donnees</li>
              <li>Droit de rectification</li>
              <li>Droit a l&apos;effacement</li>
              <li>Droit d&apos;opposition au traitement</li>
              <li>Droit a la portabilite</li>
            </ul>
            <p className="mt-3">
              Etant donne qu&apos;aucune donnee n&apos;est conservee dans une base de donnees, ces droits s&apos;exercent
              principalement sur les emails recus. Pour toute demande, contactez-nous a :&nbsp;
              <a href="mailto:jordane@agencemerino.com" className="text-merino-orange hover:underline">jordane@agencemerino.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-merino-blue mb-3">Cookies</h2>
            <p>
              Ce site utilise un cookie technique temporaire (<code className="bg-gray-100 px-1 rounded text-sm">merino_estimation</code>)
              pour transmettre le resultat de votre estimation entre les pages. Ce cookie expire automatiquement
              apres 15 minutes et ne contient aucune donnee de suivi publicitaire.
            </p>
            <p className="mt-2">
              Aucun cookie de tracking, d&apos;analyse ou publicitaire n&apos;est utilise sur ce site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-merino-blue mb-3">Mise a jour</h2>
            <p>
              Cette politique de confidentialite peut etre mise a jour a tout moment.
              Derniere mise a jour : mars 2026.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
