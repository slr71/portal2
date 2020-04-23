# CyVerse User Portal

Design document: 
https://docs.google.com/document/d/1ohJC5cXglnphb2eyZ9JayqzS2o7f1c_za4b85xirkwI/

## Local development

These instructions assume Node is already installed.

### Install dependencies
```
npm install
```

### Configure
Copy src/config-default.json to src/config.json and add Keycloak secret.

### Run server
```
npm run dev
```