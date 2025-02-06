import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";

// Firebase configuration (use your own config values)


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Form element references
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const switchToSignupButton = document.getElementById('switch-to-signup');
const switchToLoginButton = document.getElementById('switch-to-login');
const loginFormElement = document.getElementById('login-form-element');
const signupFormElement = document.getElementById('signup-form-element');

// Switch between login and signup forms
switchToSignupButton.addEventListener('click', () => {
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
});

switchToLoginButton.addEventListener('click', () => {
    signupForm.style.display = 'none';
    loginForm.style.display = 'block';
});

// Handle signup form submission
signupFormElement.addEventListener('submit', async (e) => {
    e.preventDefault();

    const firstName = document.getElementById('signup-first-name').value;
    const lastName = document.getElementById('signup-last-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("User signed up:", userCredential.user);

        // Store additional user data (first name, last name) in Firestore
        const usersCollection = collection(db, 'users');
        await addDoc(usersCollection, {
            email: userCredential.user.email,
            firstName,
            lastName
        });

        alert('Sign-up successful!');
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
    } catch (error) {
        console.error("Error signing up:", error.message);
        alert('Failed to sign up: ' + error.message);
    }
});

// Handle login form submission
loginFormElement.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        // First, check if user is in the Firestore users collection
        const usersCollection = collection(db, 'users');
        const q = query(usersCollection, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            alert('User not found. Please sign up.');
            return;
        }

        // If user exists, authenticate with Firebase Auth
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("User logged in:", userCredential.user);

        // Redirect to dashboard or another page
        window.location.href = 'dashboard.html';  // Replace with your redirect page
    } catch (error) {
        console.error("Error logging in:", error.message);
        alert('Failed to log in: ' + error.message);
    }
});
