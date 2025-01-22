Bonjour Vincent,

Comme nous en avons parlé lors de l'entretien, tu trouveras le test technique joint à ce message (`02 - User Story.md`).

Les points clés du test sont:

- Découper la US en "tâches techniques", tu trouveras joint un template. Une tâche technique est une étape unitaire (et rédigée d'un point de vue technique) de la réalisation de la US, dont le périmètre est définit de sorte à pouvoir être estimée selon les méthodes agiles par l'équipe des développeurs. La recette de cette tâche est effectuée par le développeur chargé de la revue et le QA.
- Réaliser ces tâches techniques et répondre à la US.
- Fournir ces tâches techniques en livrables à côté du code.

Pour réaliser la US, voici des identifiants pour notre API d'intégration:

client_id: 7f16ffb1099c05049bb41b6a6453f3b2cb981358765a055328b339b3b0e053d8
client_secret: 5b46cea0c3b78e8a585d3c554e71b7096fc66d88609a0e71d90e3c78a010ab36

URL de redirection post-login: https://fs.vmarigner.docker.dev-franceconnect.fr/api/login-callback
URL de redirection post-logout: https://fs.vmarigner.docker.dev-franceconnect.fr/api/logout-callback

Algorithme de signature: ES256

Scopes autorisés:

- openid
- given_name
- family_name
- preferred_username
- birthdate
- gender
- birthplace
- birthcountry
- email
- address
- phone
- profile
- birth
- identite_pivot
- idp_birthdate

Documentation:

- https://github.com/france-connect/sources
- https://docs.partenaires.franceconnect.gouv.fr/

Date attendu pour le rendu de l'exercice: **03/02/2025 au soir**.

Bon courage et n'hésite pas à revenir vers nous si tu as des questions.
