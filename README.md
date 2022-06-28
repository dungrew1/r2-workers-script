# r2-workers-script
## Description
Quick and dirty little script that lets you host static sites / assets on Cloudflare R2 using Cloudflare Workers. 
To take advantage of those no egress charges 🤤

What it does
- Parses URLs to logical filenames to look up in your R2 bucket. For example:
        1) Example.com will become index.html
        2) Example.com/example1 will become example1.html
        3) Example.com/example2/example2 will become /example2/index.html
        4) Example.com/image.png will become /image.png
        
- Caches found URLs in Cloudflare cache.
- Handles 404 responses for files that don't exist.

## Todo
Proper deployment using wrangler.

## Installation:
- Create R2 Bucket.
- Create worker.
- Link Bucket to Worker under Workers > Settings  > R2 Bucket bindings. Name it MY_BUCKET 
- Assign the Worker to a route or a domain.
- Add index.js code to Worker using the Quick edit button on the Workers Resources page.
- Done! You can now test the Worker route / domain.

