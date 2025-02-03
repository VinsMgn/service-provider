# Fournisseur de système pour se connecter à France Connect

**Pour démarrer le projet :**
`yarn install`

Puis `yarn start` ou `yarn start:dev` pour bénéficier du hot reload

Il est nécessaire d'ajouter les variables d'environnement dans un fichier .env
Voila la structure du fichier .env

```
CLIENT_ID=7f16ffb1099c05049bb41b6a6453f3b2cb981358765a055328b339b3b0e053d8
CLIENT_SECRET=client-secret
FC_URL=https://fcp-low.integ01.dev-franceconnect.fr
FS_URL=https://fs.vmarigner.docker.dev-franceconnect.fr
AUTHORIZE_URL=/api/v2/authorize
TOKEN_URL=/api/v2/token
USER_INFO_URL=/api/v2/userinfo
LOGOUT_URL=/api/v2/session/end
LOGIN_CALLBACK=/api/login-callback
LOGOUT_CALLBACK=/api/logout-callback
```

Pour précision, il y a un souci de redirection après le login et après le logout. En effet travaillant avec le port 3000 et après configuration du fichier host je n'ai pas réussi à faire la redirection automatique vers le port 3000, et si je place le port 3000 dans les éléments de configuration ou dans les URL, je suis confronté à une erreur FranceConnect car l'URL n'est surement pas la bonne.

## Méthode d'authentification :

- Se connecter à : https://fs.vmarigner.docker.dev-franceconnect.fr:3000
- Sélectionner le FI : FIP1-LOW
- Crédentials à utiliser : test / 123
- Confirmer l'identité d'Angela Claire Louise DUBOIS
- Une fois la confirmation, rajouter "3000" dans l'URL comme suit https://fs.vmarigner.docker.dev-franceconnect.fr:3000/api/login-callback?code=lR2ACZt-jKB9MnTd12LkMCtcihiznRzHro3lhjfIYwy&state=1928b0e3-ea20-4e25-ad4b-65e4ad823fcb&iss=https%3A%2F%2Ffcp-low.integ01.dev-franceconnect.fr%2Fapi%2Fv2
- Arrivée sur la page /user affichant de façon brut les données de l'utilisateur

## Méthode de déconnexion

- Cliquer sur se déconnecter tout en bas de la liste sur la page user
- Ici aussi, il est nécessaire de rajouter, après la déconnexion, le port 3000 dans l'URL comme suit :
  https://fs.vmarigner.docker.dev-franceconnect.fr:3000/api/logout-callback?state=state3bf02328-e1c4-4f80-94e7-bef5007037f5

### Pour lancer les tests unitaires

Il faut lancer la commande `yarn test`
Dans l'état actuel, il y a un test qui ressort en erreur. Cela est causé par le mock de la méthode POST d'axios. Je n'arrive pas à affecter la valeur mockée au retour du post.

### Lien du découpage des user stories

[Document User stories](https://docs.google.com/document/d/1iIdbUNyQS2iTMPY6bld9FlrG5N44JRmz5gKsX0aItLs/edit?usp=sharing)

### Reste à faire

- Reconnaître l'utilisateur lors des prochaines connexions
- Sauvegarder les données d'identité reçues après une connexion réussie (l'affichage est fait uniquement, je ne stock pas les informations encore. Je comptais créer un service identity, pour stocker avec l'algorithme de signature ES256 le token reçu dans la session)
