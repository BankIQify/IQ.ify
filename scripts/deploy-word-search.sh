#!/bin/bash

# Exit on error
set -e

echo "Deploying Word Search Puzzle System..."

# 1. Apply database migrations
echo "Applying database migrations..."
supabase migration up

# 2. Deploy the Edge Function
echo "Deploying Edge Function..."
supabase functions deploy generate-puzzles

# 3. Set up the cron job
echo "Setting up cron job..."
supabase functions schedule generate-puzzles --cron "0 0 * * *"

# 4. Generate initial batch of puzzles
echo "Generating initial batch of puzzles..."
curl -i --request POST \
  "$(supabase functions url generate-puzzles)" \
  --header "Authorization: Bearer $(supabase functions secret list | grep SUPABASE_SERVICE_ROLE_KEY | cut -d' ' -f2)"

echo "Deployment complete!" 