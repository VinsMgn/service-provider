# Description du besoin

**En tant que** candidat postulant pour un poste de développeur confirmé FranceConnect H/F

**Je veux** réaliser un test technique en créant un service provider OpenIdConnect avec NestJS, tout en respectant les exigences définies

**Afin de** démontrer mes compétences techniques dans le cadre de la sélection pour le poste de développeur.

Le candidat doit développer cette solution en respectant les spécifications et règles fournies, et soumettre un dépôt Git avec le code source, des tests unitaires, ainsi qu'un fichier README expliquant comment exécuter l'application.
Le candidat intégrera FranceConnect comme s'il était un partenaire, avec les identifiants d'API fournis et la documentation partenaire (version 2).

Le client demande à ce que le code soit lisible, résilient et évolutif.

# Situation Actuelle

Actuellement, aucun service provider OpenIdConnect n'est disponible pour ce test technique.

# Actions

- [ ] Créer un service provider OpenIdConnect avec NestJS.
- [ ] Implémenter deux endpoints : un pour l'authentification et un pour la déconnexion.
- [ ] Afficher et sauvegarder les données d'identité reçues après une connexion réussie.
- [ ] Reconnaître l'utilisateur lors des prochaines connexions, conformément au standard OpenIdConnect.
- [ ] Développer les tests unitaires couvrant chaque fonctionnalité, en insistant sur les cas limites et les erreurs.
- [ ] Ajouter les tests de qualité supplémentaire estimés nécessaires (au bon maintien du code par exemple).
- [ ] Fournir un lien vers un dépôt Git contenant le code source, un fichier README pour l'exécution locale et les scripts pour exécuter les tests.

# Recette

## TA01 - Authentification OpenIdConnect réussie

_pré-requis :_ avoir le service provider OpenIdConnect en cours d'exécution et les données d'un utilisateur valide pour le test.

1. Lancer l'application NestJS.
2. Accéder à l'endpoint d'authentification.
3. Se connecter avec un utilisateur valide.
4. **Vérifier** que les données d'identité sont bien affichées et sauvegardées.

## TA02 - Déconnexion OpenIdConnect réussie

_pré-requis :_ l'utilisateur doit être connecté.

1. Accéder à l'endpoint de déconnexion.
2. Effectuer la déconnexion.
3. **Vérifier** que l'utilisateur est bien déconnecté et que la session est terminée.

## TA03 - Reconnaissance de l'utilisateur à la reconnexion

_pré-requis :_ l'utilisateur doit s'être déjà authentifié une première fois.

1. Se reconnecter en utilisant l'endpoint d'authentification.
2. **Vérifier** que l'utilisateur est reconnu et que ses informations sont déjà disponibles.

## TA04 - Exécution des tests unitaires

_pré-requis :_ avoir les tests unitaires implémentés et prêts à être exécutés.

1. Exécuter les tests unitaires avec le framework choisi.
2. **Vérifier** que tous les tests passent, en particulier ceux couvrant les cas limites et les erreurs possibles.
