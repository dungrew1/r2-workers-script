export default {
    async fetch(request, env, context) {
        try {
            const url = new URL(request.url);
            const cacheKey = new Request(url.toString(), request);
            const cache = caches.default;
            const debug = env.debug;

            // Check whether the value is already available in the cache
            // if not, you will need to fetch it from R2, and store it in the cache
            // for future access
            let response = await cache.match(cacheKey);
            if (response) {
                maybe_console_log(`Cache hit for: ${request.url}.`, debug);
                return response;
            }
            maybe_console_log(`Response for request url: ${request.url} not present in cache. Fetching and caching request.`, debug);


            // create logical objectkeys from url for static sites
            var objectKey = url.pathname.slice(1);
            // Look for index.html if urls end with /
            if (url.pathname.slice(-1) == '/') {
                objectKey += 'index.html'
            }
           // check if urls contain extension if not look for html file 
            else if (!url.pathname.includes('.')) {
                console.log(url.pathname);
                objectKey += '.html'
            }
            maybe_console_log(`ObjectKey is ${objectKey}`,true)
           

            // If objectkey not in cache, get it from R2
            const object = await env.MY_BUCKET.get(objectKey);
            // return 404 if the object key doesnt exist in the bucket
            if (object === null) {
                return new Response('Error 404 not found', { status: 404 });
            }

            // Set the appropriate object headers
            const headers = new Headers();
            object.writeHttpMetadata(headers);
            headers.set('etag', object.httpEtag);
            headers.append('Cache-Control', 's-maxage=1000');
            response = new Response(object.body, {
                headers,
            });

            // Store the fetched response as cacheKey
            // Use waitUntil so you we return the response without blocking on
            // writing to cache
            context.waitUntil(cache.put(cacheKey, response.clone()));
            return response;
        } catch (e) {
            return new Response('Error thrown ' + e.message);
        }
    },
};

export function maybe_console_log(message, debug) {
    if (debug == true) {
        console.log(
            message
        );
    }
}