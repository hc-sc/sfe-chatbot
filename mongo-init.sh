#!/bin/bash

mongo <<EOF
use admin
db.createUser({
  user:  '$MONGO_RASA',
  pwd: '$MONGO_RASA_PW',
  roles: [{
    role: 'readWrite',
    db: 'rasa'
  }]
})
db.createUser({
  user:  '$MONGO_STRAPI',
  pwd: '$MONGO_STRAPI_PW',
  roles: [{
    role: 'readWrite',
    db: 'strapi'
  }]
})
EOF