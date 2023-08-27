// /**
//  * @Author: Your name
//  * @Date:   2023-07-20 16:39:53
//  * @Last Modified by:   Your name
//  * @Last Modified time: 2023-07-20 17:02:50
//  */
// document.getElementById("login-form").addEventListener("submit", function(event) {
//     event.preventDefault();
//     const username = document.getElementById("username").value;
//     const password = document.getElementById("password").value;
  
//     // Initialize Amazon Cognito
//     const poolData = {
//       UserPoolId: 'YOUR_USER_POOL_ID',
//       ClientId: 'YOUR_APP_CLIENT_ID'
//     };
  
//     const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
//     const userData = {
//       Username: username,
//       Pool: userPool
//     };
  
//     const authenticationData = {
//       Username: username,
//       Password: password
//     };
  
//     const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
//     const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  
//     cognitoUser.authenticateUser(authenticationDetails, {
//       onSuccess: function (session) {
//         // Authentication successful
//         window.location.href = "main_page.html"; // Redirect to the main page after successful login
//       },
//       onFailure: function (err) {
//         // Authentication failed
//         document.getElementById("login-error").textContent = err.message || "Error occurred during login.";
//       }
//     });
//   });

// function redirectToCognito() {
//     // Replace with your actual Cognito domain and other configuration values
//     const cognitoDomain = 'demo-pool1.auth.ap-south-1.amazoncognito.com';
//     const clientId = '66e0ve12b031fakngvdmfcn84s';
//     const redirectUri = 'https://aws-object-finder.vercel.app'; // Replace with the local URL of your page
  
//     // Construct the Cognito hosted UI URL for local testing
//     const cognitoUrl = `https://${cognitoDomain}/oauth2/authorize?response_type=code&client_id=${clientId}&scope=email+openid+phone&redirect_uri=${encodeURIComponent(redirectUri)}`;
  
//     // Redirect the user to the Cognito login page
//     window.location.href = cognitoUrl;
//   }
  


// Remove the button click event, as we will now automatically redirect

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function() {
    redirectToCognito();
  });
  
  function redirectToCognito() {
    // Replace with your actual Cognito domain and other configuration values
    const cognitoDomain = 'demo-pool1.auth.ap-south-1.amazoncognito.com';
    const clientId = '66e0ve12b031fakngvdmfcn84s';
    const redirectUri = 'https://aws-object-finder.vercel.app'; // Replace with the live URL of your page
  
    // Construct the Cognito hosted UI URL for redirection
    const cognitoUrl = `https://${cognitoDomain}/oauth2/authorize?response_type=code&client_id=${clientId}&scope=email+openid+phone&redirect_uri=${encodeURIComponent(redirectUri)}`;
  
    // Redirect the user to the Cognito login page
    window.location.href = cognitoUrl;
  }
  
  let cognitoUser;

function redirectToCognito() {
  // Code to redirect to the Cognito login page
  // ...
}

function logout() {
  if (cognitoUser) {
    cognitoUser.signOut();
    console.log("User logged out.");
  } else {
    console.log("User not authenticated.");
  }
}
