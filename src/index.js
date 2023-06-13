import handleSearchMR from './searchMR.js';
import buildPage from './buildResponse.js';


// Export a default object containing event handlers
export default {
  // The fetch handler is invoked when this worker receives a HTTP(S) request
  // and should return a Response (optionally wrapped in a Promise)
  async fetch(request, env, ctx) {
    // You'll find it helpful to parse the request.url string into a URL object. Learn more at https://developer.mozilla.org/en-US/docs/Web/API/URL
    const url = new URL(request.url);

    // You can get pretty far with simple logic like if/switch-statements
    switch (url.pathname) {
      case '/mr':
        return handleSearchMR.fetch(request, env, ctx);
    }
		
		return Response.redirect("https://cubly.ru", 301);
  },
};
