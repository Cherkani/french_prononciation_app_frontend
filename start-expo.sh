# Vérifiez si Expo CLI est installé
if ! command -v expo &> /dev/null
then
    echo "Expo CLI could not be found, installing..."
    npm install -g expo-cli
fi

# Démarrez le projet avec Expo
expo start
