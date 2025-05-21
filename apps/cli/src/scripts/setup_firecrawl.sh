#!/bin/bash

# Script to set up the Firecrawl API key and check dependencies

echo "UAP Database Scraper Setup"
echo "=========================="
echo

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed. Please install Python 3.7 or newer."
    exit 1
fi

# Check for pip
if ! command -v pip3 &> /dev/null; then
    echo "Error: pip3 is not installed. Please install pip for Python 3."
    exit 1
fi

# Install required packages
echo "Installing required packages..."
pip3 install firecrawl-py requests

# Ask for API key
echo
echo "You need a Firecrawl API key to use this script."
echo "If you don't have one, sign up at https://firecrawl.dev"
echo
read -p "Enter your Firecrawl API key: " API_KEY

if [ -z "$API_KEY" ]; then
    echo "Error: No API key provided."
    exit 1
fi

# Export the API key for the current session
export FIRECRAWL_API_KEY="$API_KEY"
echo "API key set for current session."

# Add to shell profile for persistence
SHELL_PROFILE=""
if [[ "$SHELL" == *"zsh"* ]]; then
    SHELL_PROFILE="$HOME/.zshrc"
elif [[ "$SHELL" == *"bash"* ]]; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
        SHELL_PROFILE="$HOME/.bash_profile"
    else
        SHELL_PROFILE="$HOME/.bashrc"
    fi
fi

if [ -n "$SHELL_PROFILE" ]; then
    echo
    read -p "Do you want to add this API key to $SHELL_PROFILE for persistence? (y/n): " ADD_TO_PROFILE
    
    if [[ "$ADD_TO_PROFILE" == "y" || "$ADD_TO_PROFILE" == "Y" ]]; then
        # Check if the key is already in the profile
        if grep -q "FIRECRAWL_API_KEY" "$SHELL_PROFILE"; then
            # Replace existing key
            sed -i.bak "s/export FIRECRAWL_API_KEY=.*/export FIRECRAWL_API_KEY=\"$API_KEY\"/" "$SHELL_PROFILE"
        else
            # Add new key
            echo "" >> "$SHELL_PROFILE"
            echo "# Firecrawl API Key" >> "$SHELL_PROFILE"
            echo "export FIRECRAWL_API_KEY=\"$API_KEY\"" >> "$SHELL_PROFILE"
        fi
        echo "API key added to $SHELL_PROFILE"
        echo "Please run 'source $SHELL_PROFILE' or restart your terminal to apply changes."
    fi
fi

echo
echo "Setup complete. You can now run the scraper with:"
echo "python3 scrape_uapdb.py"
echo
