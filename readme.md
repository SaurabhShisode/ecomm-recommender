# E-commerce Product Recommender

## Overview
A full-stack e-commerce product recommender system built with React for the frontend and Express.js with Node.js for the backend. The project provides a seamless interface for users to receive personalized product recommendations and supports backend APIs for data processing, model inference, and serving recommendations.

Key goals:
- Deliver personalized top-N product recommendations
- Provide a responsive and user-friendly UI
- Support scalable backend APIs for integration with other systems

## Features
- **Frontend**: 
    - Built with React for a dynamic and interactive user experience
    - Displays personalized recommendations and item-to-item suggestions
    - Deployed at [Frontend Link](https://ecomm-recommender.vercel.app/)
- **Backend**:
    - RESTful APIs built with Express.js for handling recommendation requests
    - Integration with a recommendation engine for model inference
    - Data ingestion and preprocessing endpoints
    - Deployed at [Backend Link](https://ecomm-recommender-backend.vercel.app/)
- **Database**:
    - Stores user interaction logs and product metadata
- **Deployment**:
    - Dockerized for easy deployment and scalability

## Project Layout
- `frontend/` — React application for the user interface
    - `src/` — React components, pages, and utilities
    - `public/` — Static assets
- `backend/` — Express.js application for the API
    - `routes/` — API endpoints
    - `controllers/` — Business logic for handling requests
    - `models/` — Database models and schema
    - `services/` — Recommendation engine integration
- `data/` — Raw and processed datasets
- `configs/` — Configuration files for the backend
- `Dockerfile` — Docker configuration for deployment
- `README.MD` — Project documentation

## Installation
### Prerequisites
- Node.js 14+ and npm
- (Optional) Docker

### Setup
1. Clone the repository:
     ```bash
     git clone <repository-url>
     cd E-commerce-Product-Recommender
     ```

2. Install dependencies:
     - Backend:
         ```bash
         cd backend
         npm install
         ```
     - Frontend:
         ```bash
         cd frontend
         npm install
         ```

3. Configure environment variables:
     - Create `.env` files in `backend/` and `frontend/` directories based on the provided `.env.example`.

4. Start the development servers:
     - Backend:
         ```bash
         cd backend
         npm run dev
         ```
     - Frontend:
         ```bash
         cd frontend
         npm start
         ```

## Quick Start
1. **Run the application**:
     - Access the frontend at `http://localhost:3000`
     - Backend APIs are available at `http://localhost:5000`

2. **API Endpoints**:
     - `GET /api/recommendations?userId=<USER_ID>&k=10`
         - Returns top-N recommendations for a user
     - `GET /api/recommendations/item?itemId=<ITEM_ID>&k=10`
         - Returns item-to-item recommendations

3. **Example Response**:
     ```json
     {
             "userId": 123,
             "recommendations": [
                     { "itemId": 987, "score": 0.92 },
                     { "itemId": 654, "score": 0.87 }
             ]
     }
     ```

## Development & Testing
- **Backend**:
    - Run tests:
        ```bash
        cd backend
        npm test
        ```
    - Linting:
        ```bash
        npm run lint
        ```
- **Frontend**:
    - Run tests:
        ```bash
        cd frontend
        npm test
        ```
    - Linting:
        ```bash
        npm run lint
        ```

## Deployment
- **Docker**:
    - Build and run the application:
        ```bash
        docker-compose up --build
        ```
    - Access the app at `https://ecomm-recommender.vercel.app/`

## Troubleshooting
- Ensure `.env` files are correctly configured.
- If the frontend or backend fails to start, check for missing dependencies or port conflicts.

## Contributing
- Fork the repository, create a feature branch, and submit a pull request.
- Follow the existing code style and include tests for new features.

## License
Specify your license (e.g., MIT) in the `LICENSE` file.