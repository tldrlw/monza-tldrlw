// /app/health/page.js

export default function Health() {
  return (
    <div>
      <h1>OK</h1>
    </div>
  );
}

// Default Behavior: By default, when you define a page in Next.js, it automatically responds with an HTTP status code of 200 unless there is an error during the rendering or the server throws an exception.
// Content: The content “OK” in the HTML is displayed as a response body, but what the ALB health check cares about is the HTTP status code, which will be 200 by default for a successful page load.

// How the ALB Health Check Works:
// When the ALB sends an HTTP GET request to /health, the Next.js server will serve the /health page.
// Since the page loads successfully, the Next.js server responds with:
// HTTP Status Code: 200
// Response Body: The HTML content <div><h1>OK</h1></div>
