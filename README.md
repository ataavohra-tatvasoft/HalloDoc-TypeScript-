## Project: HalloDoc

## Note:

**This repository is of backend code only.**
</br>

**For Front-End Integration, integrate below repository and configure accordingly.**
</br>

**Front-End repository link: (https://github.com/Abhay-tatva/Hallo-Doc-App.git)**
</br>

## Description:

**This project aims to develop a web-based platform that facilitates online doctor consultations and diagnostic services. Inspired by the Halodoc platform, it strives to create a user-friendly experience for both doctors and patients.**
</br>

## Features:

**Online Doctor Consultation:** Patients can connect with doctors virtually for consultations, reducing the need for physical visits.
</br>

**Diagnostics Services:** The platform may integrate with third-party services to enable patients to access diagnostic tests and receive results securely. (Implementation details depend on integration feasibility).
</br>

## User Roles:

**Admin:** Manages the platform, including user accounts, patient records, and appointment requests. Can review patient history, manage cases, and control requests (cancel, block).
</br>

**Physician:** Offers consultations online, manages patient appointments, accesses patient medical records securely, and communicates with patients through the platform.
</br>

**Patient:** Seeks online consultations, requests diagnostic services (if available), manages appointments, and securely communicates with doctors.
</br>

## Technology Stack:

**Frontend:** (Reactjs)
</br>

**Backend:** (Node.js, Typescript)
</br>

**Database:** (MySQL, WAMPP)
</br>

**API Test:** (Postman)
</br>

## Getting Started:

-> **Clone the repository.**
</br>

-> **Install dependencies using npm install or yarn install.**
</br>

-> **Make config.env, src/connections/database.ts && src/db/config/config.json file according to your credentials if they are not available in repository.**
</br>

-> **Configure the database connection details from:**
</br>
"config.env",
"src/db/config/config.json
&&
src/connections/database.ts".
</br>

-> **Run migrations and seeders as:**
</br>
"npx sequelize-cli db:migrate
&&
npx sequelize db:seed:all" in src/db directory.
</br>

-> **To undo migrations and seeders, run:**
</br>
"npx sequelize-cli db:migrate:undo:all"
&&
"npx sequelize db:seed:undo:all" in src/db directory.
</br>

-> **Run the development server using "npm run dev" in root directory.**
</br>

-> **Default users and password for getting started:**
</br>
-> Admin: "admin27@yopmail.com",
Password: "Password@6789"
</br>
-> Provider: "provider27@yopmail.com",
Password: "Password@6789"
</br>
->Patient: "patient27@yopmail.com",
Password: "Password@6789"
</br>

## Contributing:

**Pull requests are welcome.**
</br>

**Please follow the code style guide.**
</br>

## License:

**#Currently no licence required.**
</br>

## Disclaimer:

**This project is for educational purposes only. Always consult with a licensed physician for any medical concerns.**
