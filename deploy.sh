#!/bin/bash

# FTP Configuration
FTP_HOST="pixie-ftp.porkbun.com"
FTP_USER="iqify.club"

# Build the project
echo "Building project..."
npm run build

# Create a temporary script for ftp
echo "Creating FTP script..."
cat > ftp_commands.txt << EOL
open $FTP_HOST
user $FTP_USER
cd /
prompt
mput dist/*
bye
EOL

# Upload using ftp
echo "Uploading to FTP..."
ftp -n < ftp_commands.txt

# Clean up
rm ftp_commands.txt

echo "Deployment complete!" 