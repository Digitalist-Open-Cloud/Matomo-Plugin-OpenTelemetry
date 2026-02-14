# FAQ

_Why am I getting: `Content-Security-Policy: The page’s settings blocked the loading of a resource (connect-src) at http://mytracer.com:4318/v1/traces because it violates the following directive: “connect-src 'self'”` in the browser console?_

Make sure that you have set Content Security Policy (CSP) in the plugin settings, you need to allow the Matomo instance to connect to it.
