
# E-commerce Product Recommender

## Overview
**E-commerce Product Recommender** is a full-stack web application that delivers personalized product recommendations using user interaction data and AI-generated explanations.

The system includes:
- A **React** frontend for an interactive user experience  
- A **Node.js + Express** backend with **PostgreSQL** database  
- Integration with **Groq SDK** for generating natural-language explanations for recommendations  

The project demonstrates how data-driven personalization and LLM-based contextual reasoning can enhance product discovery and user engagement.


## Watch Demo
<a href="https://drive.google.com/file/d/1ZAQi_ydMAeYZ0ywycn6wD49XATqGfugQ/view?usp=sharing" target="_blank">
  <img src="https://raw.githubusercontent.com/SaurabhShisode/ecomm-recommender/main/thumbnail.png" alt="Watch the video">
</a>


## Key Features

### Smart Recommendations
- Fetches recent user interactions from the database  
- Determines the user’s top interest categories  
- Recommends products from similar categories while avoiding duplicates  

### AI-Generated Explanations
- Uses **Groq LLaMA-3.1-8B** model to generate factual, category-based explanations  
- Each recommendation includes a concise, impersonal reasoning statement  

### Frontend
- Built with **React.js** and **Tailwind CSS**  
- Displays personalized recommendations in an elegant UI  
- Hosted at: [Frontend Live Link](https://ecomm-recommender.vercel.app/)

### Backend
- RESTful APIs using **Express.js**  
- PostgreSQL connection via `pg` and `pool`  
- Integration with **Groq SDK** for LLM-based explanations  
- Hosted at: [Backend Live Link](https://ecomm-recommender-backend.vercel.app/)

### Database
- Stores product details, metadata, and user interaction logs  
- Designed to efficiently query recent activity and product categories  

---

## Tech Stack

| Layer         | Technology                  |
|---------------|-----------------------------|
| **Frontend**  | React.js, Tailwind CSS, Axios |
| **Backend**   | Node.js, Express.js         |
| **Database**  | PostgreSQL                 |
| **AI Integration** | Groq SDK (LLaMA 3.1)  |
| **Deployment**| Vercel (Frontend), Render/Other (Backend) |

---


## Installation and Setup

### Prerequisites
- Node.js (v14+)
- npm or yarn
- (Optional) Docker

---

### 1. Clone the Repository
```bash
git clone <repository-url>
cd E-commerce-Product-Recommender
```

---

### 2. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

---

### 3. Environment Variables

Create a `.env` file inside the `backend/` directory:
```plaintext
DATABASE_URL=postgresql://<username>:<password>@localhost:5432/<database_name>
GROQ_API_KEY=your_groq_api_key
PORT=5000
```

Create a `.env` file inside the `frontend/` directory:
```plaintext
REACT_APP_API_URL=http://localhost:5000/api
```

---

### 4. Start Development Servers

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm start
```

Access:
- Frontend → [http://localhost:3000](http://localhost:3000)
- Backend → [http://localhost:5000](http://localhost:5000)

---

## API Reference

### **POST /api/recommendations**

Generates top-N product recommendations for a given user.

**Request Body:**
```json
{
    "user_id": 123,
    "k": 5
}
```

**Response:**
```json
{
    "recommendations": [
        {
            "product_id": 45,
            "title": "Wireless Headphones",
            "price": 1999,
            "category": "Electronics",
            "explanation": "Recommended because it aligns with your interest in high-quality audio devices."
        }
    ]
}
```

**Possible Messages:**
- `"No interactions found for this user."`
- `"Could not determine user preferences."`
- `"No new recommendations found in preferred categories."`

---

## Development & Testing

### Backend
Run tests:
```bash
npm test
```

Linting:
```bash
npm run lint
```

### Frontend
Run tests:
```bash
npm test
```

---

## Troubleshooting

| Issue                     | Solution                                                          |
|---------------------------|-------------------------------------------------------------------|
| `Server error`            | Ensure database is running and `.env` variables are set correctly |
| `Groq API Error`          | Verify `GROQ_API_KEY` and usage limits                            |
| `Frontend not connecting` | Check `REACT_APP_API_URL` in `.env`                               |

---

## Contributing

1. Fork the repository
2. Create a new branch (`feature/your-feature`)
3. Commit changes and open a pull request
4. Follow the existing code style and structure

---

## 🪪 License

This project is licensed under the **MIT License**.  
See the [LICENSE](./LICENSE) file for details.
