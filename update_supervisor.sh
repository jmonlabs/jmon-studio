#!/bin/bash

# Update supervisor config for FeathersJS backend
sudo sed -i 's|command=/root/.venv/bin/uvicorn server:app --host 0.0.0.0 --port 8001 --workers 1 --reload|command=node src/app.js|g' /etc/supervisor/conf.d/supervisord.conf

echo "Updated supervisor config for FeathersJS backend"