# Vérifiez si Vercel CLI est installé
if ! command -v vercel &> /dev/null
then
    echo "Vercel CLI could not be found, installing..."
    npm install -g vercel

    # Ajoutez le chemin de npm global à PATH pour PowerShell
    NPM_GLOBAL_PATH=$(npm config get prefix)
    export PATH=$NPM_GLOBAL_PATH/bin:$PATH
    powershell -Command "[System.Environment]::SetEnvironmentVariable('Path', \$env:Path + ';$NPM_GLOBAL_PATH\bin', [System.EnvironmentVariableTarget]::User)"
fi

# Connectez-vous à Vercel
vercel login

# Déployez le projet
vercel
