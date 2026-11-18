Inscription d'un client avec des données valides (Attendu : 201)

curl -i -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Client Test","email":"client@test.com","password":"Password123!","firstName":"Client","lastName":"Test","phone":"0600000000","driverLicense":"PERMIS01"}'


Inscription avec role: "ADMIN" dans le body (Attendu : Le rôle reste CLIENT)
  
curl -i -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Hacker","email":"hacker@test.com","password":"Password123!","firstName":"Hacker","lastName":"Test","phone":"0600000000","driverLicense":"PERMIS02","role":"ADMIN"}'


Connexion avec des identifiants valides (Attendu : 200 + cookie + Access Token)

curl -i -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"client@test.com","password":"Password123!"}' \
  -c cookies.txt


Connexion répétée avec un mauvais mot de passe (Attendu : La 6e tentative retourne 429)

curl -i -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"client@test.com","password":"WrongPassword"}'


Consultation des véhicules sans token (Attendu : 401)

curl -i -X GET http://localhost:3000/api/vehicles

Consultation des véhicules avec un token CLIENT (Attendu : 200)

curl -i -X GET http://localhost:3000/api/vehicles \
  -H "Authorization: Bearer VOTRE_TOKEN_CLIENT"


Création d'un véhicule avec un compte CLIENT (Attendu : 403)

curl -i -X POST http://localhost:3000/api/vehicles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN_CLIENT" \
  -d '{"brand":"Toyota","model":"Yaris","registration":"123-TUN-1111","category":"ECONOMY","dailyPrice":40,"year":2022,"agencyId":1}'


Création d'un véhicule par ADMIN avec un prix invalide (Attendu : 400)

curl -i -X POST http://localhost:3000/api/vehicles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN_ADMIN" \
  -d '{"brand":"Toyota","model":"Yaris","registration":"123-TUN-2222","category":"ECONOMY","dailyPrice":-50,"year":2022,"agencyId":1}'


Création de deux véhicules avec la même immatriculation (Attendu : Refusé / 400)

curl -i -X POST http://localhost:3000/api/vehicles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN_ADMIN" \
  -d '{"brand":"Renault","model":"Clio","registration":"MOCK-REG-999","category":"ECONOMY","dailyPrice":50,"year":2023,"agencyId":1}'

curl -i -X POST http://localhost:3000/api/vehicles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN_ADMIN" \
  -d '{"brand":"Peugeot","model":"208","registration":"MOCK-REG-999","category":"ECONOMY","dailyPrice":60,"year":2023,"agencyId":1}'



Création d'une réservation pour un véhicule inexistant (Attendu : 404)

curl -i -X POST http://localhost:3000/api/reservations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN_CLIENT" \
  -d '{"vehicleId":99999,"startDate":"2026-12-01T10:00:00.000Z","endDate":"2026-12-05T10:00:00.000Z"}'


Création d'une réservation avec une date de fin antérieure à la date de début (Attendu : 400)

curl -i -X POST http://localhost:3000/api/reservations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN_CLIENT" \
  -d '{"vehicleId":1,"startDate":"2026-12-05T10:00:00.000Z","endDate":"2026-12-01T10:00:00.000Z"}'



Création d'une réservation avec une période déjà réservée (Attendu : 409)

curl -i -X POST http://localhost:3000/api/reservations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN_CLIENT" \
  -d '{"vehicleId":1,"startDate":"2026-12-02T10:00:00.000Z","endDate":"2026-12-04T10:00:00.000Z"}'



Création d'une réservation valide (Attendu : 201)

curl -i -X POST http://localhost:3000/api/reservations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN_CLIENT" \
  -d '{"vehicleId":1,"startDate":"2026-12-10T10:00:00.000Z","endDate":"2026-12-15T10:00:00.000Z"}'


Annulation d'une réservation autorisée (Attendu : 200)

curl -i -X PATCH http://localhost:3000/api/reservations/1/cancel \
  -H "Authorization: Bearer VOTRE_TOKEN_CLIENT"



Réservation d'un véhicule sur une période libérée après annulation (Attendu : Autorisée / 201)

curl -i -X POST http://localhost:3000/api/reservations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN_CLIENT" \
  -d '{"vehicleId":1,"startDate":"2026-12-01T10:00:00.000Z","endDate":"2026-12-05T10:00:00.000Z"}'



Consultation du profil d'un autre client par un CLIENT (Attendu : 403)

curl -i -X GET http://localhost:3000/api/customers/999 \
  -H "Authorization: Bearer VOTRE_TOKEN_CLIENT"


Déconnexion de la session courante (Attendu : 204 + cookie supprimé)

curl -i -X POST http://localhost:3000/api/auth/logout \
  -b cookies.txt


Consultation des réservations récentes avec limit=5 (Attendu : Max 5 résultats triés par date décroissante)

curl -i -X GET "http://localhost:3000/api/reservations/recent?limit=5" \
  -H "Authorization: Bearer VOTRE_TOKEN_ADMIN"


  