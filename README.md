# WineScanner App - Guide de Déploiement

Bienvenue dans l'application Urbanisation, une plateforme de gestion de vins! Ce guide vous aidera à déployer les parties front et back de l'application sur votre environnement local.

## Développer par :

- **Ismail Fakir**
- **Ibrahim Jallouli**

## Structure du Projet

Le projet est organisé en deux parties distinctes :
- **Frontend**: Développé avec React Native Expo.
- **Backend**: Développé avec Node.js.

## Prérequis

Assurez-vous d'avoir les éléments suivants installés sur votre machine :

- [Node.js](https://nodejs.org/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Git](https://git-scm.com/)

## Installation

1. Clonez le dépôt Git :

    ```bash
    git clone https://github.com/ISMAIL-FAKIR/Urbanisation.git
    ```

2. Accédez au répertoire du projet :

    ```bash
    cd Urbanisation
    ```

### Frontend

3. Accédez au dossier `front` :

    ```bash
    cd front
    ```

4. Installez les dépendances :

    ```bash
    npm install
    ```

### Backend

5. Revenez au dossier principal :

    ```bash
    cd ..
    ```

6. Accédez au dossier `back` :

    ```bash
    cd back
    ```

7. Installez les dépendances :

    ```bash
    npm install
    ```

## Configuration

1. Dans le dossier `front`, vous trouvez un répértoire `screens` comme `HomeScreen.js, HomeUserScreen.js ...`. Mettez à jour la variable `backendURL` avec l'URL de votre backend :

    ```javascript
    const backendURL = 'http://votre-ip:port/';
    ```

## Exécution

### Frontend

1. Dans le dossier `front`, lancez l'application Expo :

    ```bash
    expo start
    ```

2. Scannez le code QR généré avec l'application Expo Go sur votre téléphone.

### Backend

3. Revenez au dossier `back` :

    ```bash
    cd ..
    ```

4. Dans le dossier `back`, lancez le serveur Node.js :

    ```bash
    node index.js
    ```

## Utilisation

L'application WineScanner vous permet de :
- Scanner une étiquette de vin pour accéder à sa fiche technique.
- Afficher les notes et les commentaires des utilisateurs.
- Laisser une note et un commentaire une fois enregistré sur l'application.

Chaque utilisateur peut supprimer que son commentaire 

La partie d'administration vous permet d'ajouter, supprimer des vins

## Contributions

Les contributions sont les bienvenues! N'hésitez pas à soumettre des problèmes ou à créer des pull requests.

## Licence

Ce projet est sous licence [MIT](LICENSE).
