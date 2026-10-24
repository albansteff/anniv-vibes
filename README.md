# Anniv Vibes 🎂

Site d'invitation pour mes 28 ans.

- **Quand :** vendredi 20 novembre 2026, à partir de 19h
- **Où :** The Frog & Princess, 9 rue Princesse, 75006 Paris (métro Mabillon)

## Contenu

Site statique, sans build :

- `index.html` : la page
- `style.css` : les styles
- `script.js` : compte à rebours et confettis
- `invitation.ics` : l'événement à ajouter à son agenda

Pour le voir en local, ouvrir `index.html` dans un navigateur.

## Mise en ligne (GitHub Pages)

1. Pousser le dépôt sur GitHub.
2. Dans *Settings → Pages*, choisir *Deploy from a branch*, branche `main`, dossier `/ (root)`.
3. Le site sera disponible à `https://<utilisateur>.github.io/<nom-du-depot>/`.

## Réponses des invités (Google Sheets)

Les réponses sont stockées dans un Google Sheet privé. Le script `apps-script/Code.gs`
reçoit les réponses du formulaire et renvoie au site la liste des participants
(prénom + nom de ceux qui viennent, jamais les commentaires).

### Mise en place

1. Créer un Google Sheet vide (par exemple « Anniv Albanito – Réponses »).
2. Dans le Sheet : *Extensions → Apps Script*, remplacer le contenu de `Code.gs` par celui de
   `apps-script/Code.gs`, puis enregistrer.
3. *Déployer → Nouveau déploiement* → type *Application Web* :
   - Exécuter en tant que : **Moi**
   - Qui a accès : **Tout le monde**
4. Autoriser l'accès quand Google le demande (écran « Application non validée » →
   *Paramètres avancés* → *Accéder au projet*).
5. Copier l'URL de l'application Web (`https://script.google.com/macros/s/…/exec`) et la
   coller dans `RSVP_URL` en haut de `script.js`.

Si quelqu'un répond plusieurs fois, seule sa dernière réponse compte. Pour retirer
quelqu'un de la liste affichée, supprimer ses lignes dans le Sheet.

Après une modification de `Code.gs`, il faut redéployer : *Déployer → Gérer les déploiements →
modifier → Nouvelle version* (l'URL reste la même).
