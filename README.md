# User Reviews Functionality

This project is a full-stack user review system that allows authenticated users to submit reviews (ratings and comments) for various products. The system also provides editing and deletion capabilities for users and includes an admin interface for review management.

## Features
- **User Authentication**: Only authenticated users can submit, edit, or delete reviews.
- **Review Submission**: Users can submit reviews with a rating (1-5 stars) and a comment for each product.
- **Edit/Delete Reviews**: Users can update or delete their own reviews. Admins have permission to manage all reviews.
- **Admin Management**: Admins can delete inappropriate reviews from the system.
- **Form Validation**: Frontend validation ensures ratings are within the 1-5 range and that comments meet length requirements.
- **Display Reviews**: Reviews are displayed with username, timestamp, rating, and comment.

## Technologies Used

- **Frontend**: React, React Router, Axios, React Icons, CSS
- **Backend**: Node.js, Express.js (for API)
- **Database**: MySQL (for storing items, bookmarks and user data)
- **Styling**: Custom CSS, react-toastify for notifications

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14+)
- npm or yarn
- MySQL or any other dbms software (if running the backend locally)

## Setup and Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/User-Review-Functionality.git
   cd User-Review-Functionality

   ```
2. **Install dependencies on the frontend and backend**
   ```bash
   npm install
   ```
   
4. **Configure Environment Variables**
   Create a .env file in the root directory and add your environment variables:
5. **Create a database and run the queries in the sql file provided :**  [https://github.com/Farhaan114/Bookmark-functionality/blob/main/bookmarks.sql](https://github.com/Farhaan114/User-Review-Functionality/blob/master/reviews.sql)
   
6. **Run the Application on the front and back end**
   -- frontend : 
   ```bash
   npm run dev 
   ```
7. **Start the Backend Server**
   ```bash
   npm start
   ```
   --or
   ```bash
   nodemon index.js
   ```

## Screenshots 
- User Login ![image](https://github.com/user-attachments/assets/9d74db40-c4db-4591-a5e5-4b57006a757e)
- Products Listing ![image](https://github.com/user-attachments/assets/08230053-6051-4c38-a8ad-3e7c1edeacd4)

- Search filter ![image](https://github.com/user-attachments/assets/787a36df-be38-4601-a707-6460f18a2021)

- View Product Reviews ![image](https://github.com/user-attachments/assets/92b4f832-1ae1-4f79-918a-4111ec4fbca3)

- Submit a review ![image](https://github.com/user-attachments/assets/eba4b35b-9111-4a6f-b5c4-4164c53278a2)
- User can view their reviews ![image](https://github.com/user-attachments/assets/4259fc26-80b1-4842-9379-8d76a170e74e)

- Edit a review ![image](https://github.com/user-attachments/assets/6500d930-c930-4368-9b98-61e44139efc9)

  ![image](https://github.com/user-attachments/assets/72363f6d-503f-434b-b512-e0ea347c83b9)

- Delete a review ![image](https://github.com/user-attachments/assets/414f4986-cc11-4e44-a4cb-fc6acb4e4549)

- Admin login and review viewing ![image](https://github.com/user-attachments/assets/db9ac454-8cc3-4285-9286-7d88cde43450)

- Admin deleting an inapprpriate review ![image](https://github.com/user-attachments/assets/87170deb-d8ee-4cdd-9d38-a841ad651b0a)

    
## API Endpoints
The application interacts with a backend API. Below are the endpoints used:
![image](https://github.com/user-attachments/assets/e5bdfa1f-ee97-4c40-a22f-04d7f9093426)

- **view the api documentation here :** https://submissions-8057.postman.co/workspace/Intern-Submissions~ab6a99ee-0493-4a99-9c60-7c90fd89409b/collection/36006187-8b74d0a1-e326-4775-895c-777e4ad7ecc8  


## License
This project is licensed under the MIT License.

Contact
For questions, please contact Farhaan114 (FraanKey).

Enjoy using this User Review Functionality! 😊
