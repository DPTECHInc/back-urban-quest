# Contexte

## IDÉES PROJETS :

-   URBEX BLOG/RÉSEAU SOCIAL (posts[localisation,photos],compte,blog)
-   ENIGMES BLOG/JEU/RÉSEAU SOCIAL (posts[localisation,photos],compte,blog)
-   NFT E-COMMERCE/RÉSEAU SOCIAL (posts,compte,achat)

## IDEE FINAL :

GEOCACHE URBEX/ÉNIGMES/NFT :

-   Page Index : Menu navigation [posts,connexion,espace profil], Posts [menu déroulant(3 choix),enigme,photos]
-   Page Connexion : Formulaire connexion, mot de passe oublié
-   Page Profil : Ses propres caches, ses thunes virtuelles, ses propres posts[enigme,photos]

# TODO :

Dans les descriptions suivantes il reste à deffinir
les `toDef`

-   les commentaires de la liste de posts
-   les infos sur le post fraichement créé
-   les token de connexion

# Routes

## Gestion de POSTS:

### GET /

retourne la liste des post afin de garnir la "home" avec tous ces posts

-   Requête: none
-   Réponse: status `200`

Exemple de retour:

```json
{
    "posts": [
        {
            "nom": "string",
            "contenu": "contenu",
            "categorie": "urbex",
            "location": {"lat": 12.3743, "lon":39.4494},
            "like_counter": "",
            "comments":[{
                todef
            }]
        }
    ]
}
```

### POST /posts

Création d’un "post"

Requête

```json
{
    "nom": "string",
    "contenu": "contenu",
    "categorie": "urbex",
    "location": { "lat": 13.234, "lon": 85.74548 }
}
```

Responses :

status `200`

````json
{
    "message":"Votre post à bien été créé"
    todef:"id du post"
}


status `422`
```json
{
    "message": "l'un des champ requis est vide"
}
````

### DELETE /posts

Suppression d’un post

Requête:

```json
{
    "id": "String" // Id du post à supprimer
}
```

Responses :

status `200`

```json
{
    "message": "Votre post à bien été supprimé"
}
```

status `403`

```json
{
    "message": "Vous ne pouvez supprimer que VOS post"
}
```

status `404`

```json
{
    "message": "Ce post n'existe pas(ou plus)"
}
```

### POST /posts/like

Ajout d’un like à un post

Requête:

```json
{
    "id": "String" // Id du post à liker
}
```

Responses:

status `200`

```json
{
    "message": "Votre like est bien pris en compte"
}
```

status `200`

```json
{
    "message": "Vous ne liké plus ce post"
}
```

status `401`

```json
{
    "message": "Vous devez etre connecté pour ajouter un like"
}
```

status `403`

```json
{
    "message": "Ce serait trop facile de liker son propre contenu ;)"
}
```

### POST /posts/comment

Ajout d'un commentaire au post

Requête:

```json
{
    "id": "String", // Id du post à commenter
    "text": "String" // le jolie commentaire
}
```

status `200`

```json
{
    "message": "Merci pour votre commentaire"
}
```

status `401`

```json
{
    "message": "Vous devez etre connecté pour ajouter un like"
}
```

status `422`

```json
{
    "message": "L'un des champs requis est vide"
}
```

## Gestion des Users:

### POST /register

Création d’un compte utilisateur
Requête:

```json
{
    "nom": "String",
    "prenom": "String",
    "pseudo": "String",
    "naissance": "String",
    "email": "String",
    "password": "String"
}
```

Responses:
status `200`

```json
{
    "message": "Votre compte a bien étét créé",
    "toDef": "authToken"
}
```

status `422`

```json
{
    "message": "L'un des champs requis est vide"
}
```

status `422`

```json
{
    "message": "Cette adresse est déja enregistrée"
}
```

### POST /login

Connection de l’utilisateur à son compte

Requête:

```json
{
    "email": "string",
    "password": "string"
}
```

Responses:

status `200`

```json
{
    "message": "Vous venez de vous connecté",
    "toDef": "authToken"
}
```

status `403`

```json
{
    "message": "email ou mot de passe invalide"
}
```

### GET /profil

Récupération des info de l’utilisateur courant

Requête:

```json
{}
```

Responses:

status `200`

```json
{
    "email": "your@mail.com",
    "nom": "dupont",
    "prenom": "Paul",
    "naissance": "1999/12/31"
}
```

status `401`

```json
{
    "message": "Please log in first"
}
```

### PUT /profil

MAJ des info de l’utilisateur courant

Requête:

```json
{
    "email": "yournew@mail.com",
    "prenom": "Pierre"
}
```

cette liste de propriétés contient :

-   au moins UN champs (et une valeur)
-   autant de champs à mettre à jour que voulu

Responses:

status : `200`

```json
{
    "message": "newValue saved"
}
```

status `401`

```json
{
    "message": "You must be logged"
}
```

status `403`

```json
{
    "message": "Cette propriété n'est pas modifiable (au moins une de ces infos)"
}
```

# Items / Schéma:

## Profil

// Le compte d’un user

-   nom
-   prenom
-   pseudo
-   naissance
-   email
-   password
-   posts

## Post

// Contenu ajouté par un user

-   nom: "string" “Titre du point d'intérêt à trouver”
-   contenu: string "Des info sur ce point ..",
-   categorie: string “urbex”, “balade”, … (à définir),
-   location: {lat: 42.15, lon: 22.2}
-   likes: "0",
-   comments: Array
