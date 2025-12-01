# Flux Utilisateurs – AI Coaching Website

## 1. Arrivée sur le site
- L’utilisateur ouvre la page d’accueil.
- Il voit un menu de navigation (Accueil, Coach, Programmes, Journal, Tableau de bord).
- Il est invité à créer son profil.

## 2. Création du profil
- L’utilisateur remplit un formulaire : âge, poids, taille, objectif (perte de poids, prise de muscle, maintien).
- Les données sont enregistrées dans le navigateur via LocalStorage.
- Une confirmation s’affiche et l’utilisateur accède au tableau de bord.

## 3. Section Coach Q&A
- L’utilisateur clique sur “Coach”.
- Il pose une question dans un champ texte.
- L’IA vérifie si la question est pertinente (fitness/nutrition).
- Si oui → réponse affichée directement sur la page.
- Si non → message expliquant que la question sort du cadre.

## 4. Programmes d’entraînement
- L’utilisateur clique sur “Programmes”.
- Il parcourt une bibliothèque d’exercices (avec vidéos).
- Il sélectionne des exercices pour créer une routine personnalisée.
- La routine est sauvegardée dans LocalStorage.
- Il peut nommer et retrouver son programme dans une liste.

## 5. Journal de séance
- L’utilisateur clique sur “Journal”.
- Il lance une séance à partir de son programme.
- Il saisit les détails : séries, répétitions, charges ou durée.
- Les données sont ajoutées à son historique.
- Le site met à jour les statistiques automatiquement.

## 6. Tableau de bord
- L’utilisateur clique sur “Tableau de bord”.
- Il consulte ses graphiques : évolution du poids, volume d’entraînement, assiduité.
- Il peut filtrer par période (semaine, mois, année).
- Les données sont affichées sous forme de graphiques simples et interactifs.