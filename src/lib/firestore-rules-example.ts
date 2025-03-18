
/**
 * Firestore Rules Examples
 * 
 * These are examples of Firestore security rules that allow users to:
 * 1. Sign up and create their profile
 * 2. Read and update their own profile
 * 3. Have limited access to other collections based on roles
 * 
 * To implement these rules:
 * 1. Go to your Firebase console: https://console.firebase.google.com
 * 2. Navigate to your project
 * 3. Select "Firestore Database" from the sidebar
 * 4. Click on the "Rules" tab
 * 5. Replace the existing rules with these examples
 * 6. Click "Publish"
 */

export const firestoreRulesExample = `
// Basic Firestore security rules for authentication app with profiles
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Default rule - deny all access
    match /{document=**} {
      allow read, write: if false;
    }

    // Allow users to read and write their own profile
    match /profiles/{userId} {
      // Allow read if the user is authenticated and it's their own profile
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // Allow create if the user is authenticated and it's their own profile
      allow create: if request.auth != null && 
                     request.auth.uid == userId && 
                     request.resource.data.email == request.auth.token.email;
      
      // Allow update if the user is authenticated and it's their own profile
      allow update: if request.auth != null && 
                     request.auth.uid == userId;
    }

    // Similar rules for the users collection (for backward compatibility)
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && 
                     request.auth.uid == userId && 
                     request.resource.data.email == request.auth.token.email;
      allow update: if request.auth != null && 
                     request.auth.uid == userId;
    }

    // Read-only access to specific collections for authenticated users
    match /letters/{letterId} {
      allow read: if request.auth != null;
      
      // Allow create for authenticated users
      allow create: if request.auth != null && 
                     request.resource.data.createdBy == request.auth.uid;
      
      // Allow update only if the user created the letter or if they have admin/staff role
      allow update: if request.auth != null && 
                     (resource.data.createdBy == request.auth.uid || 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ["admin", "staff"]);
    }

    // Admin access rules - allow full access to specific users with admin role
    match /{document=**} {
      allow read, write: if request.auth != null && 
                           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }
  }
}
`;

export const simpleSignupRules = `
// Simple rules for allowing signup and basic profile creation
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to create their own documents in users and profiles collections
    match /users/{userId} {
      allow create, update: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null;
    }
    
    match /profiles/{userId} {
      allow create, update: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null;
    }
    
    // For letters and other collections, add appropriate rules
    match /letters/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
`;

/**
 * Rule that allows all read and write operations (FOR DEVELOPMENT ONLY)
 * WARNING: NEVER use these rules in production as they give anyone full access to your database
 */
export const developmentRules = `
// Development-only rules (NEVER use in production)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
`;

/**
 * Instructions for implementing these rules
 */
export const implementationGuide = `
Instruksi Menerapkan Rules Firestore:

1. Buka Firebase Console: https://console.firebase.google.com
2. Pilih project Anda
3. Pilih "Firestore Database" dari sidebar
4. Klik tab "Rules"
5. Ganti rules yang ada dengan contoh rules di atas
6. Klik "Publish" untuk menerapkan rules baru

Untuk development, Anda dapat menggunakan rules pengembangan sementara.
Untuk produksi, gunakan rules yang lebih ketat seperti contoh pertama.
`;
