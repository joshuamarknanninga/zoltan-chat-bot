#!/bin/bash

echo "Setting up Edge Devices..."

# Install Python and pip if not already installed
sudo apt update
sudo apt install -y python3 python3-pip

# Clone the repository (if not already cloned)
if [ ! -d "zoltan-chatbot" ]; then
    git clone https://github.com/yourusername/zoltan-chatbot.git
fi

cd zoltan-chatbot/edge

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Ensure model is in place
if [ ! -f "models/lightweight_model.tflite" ]; then
    cp ../models/lightweight_model.tflite models/
fi

# Run the inference service
nohup python src/inference_service.py > logs/inference_service.log 2>&1 &

echo "Edge Device setup complete and inference service running in the background."
