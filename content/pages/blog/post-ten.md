---
type: PostLayout
title: 'What Happens When You Open a Website: From DNS to Rendering'
date: '2025-06-15'
excerpt: >-
  A deep technical walkthrough of the end-to-end process when you open a
  website—from DNS lookup and TCP/TLS handshakes to HTML parsing, rendering, and
  CDN delivery.
featuredImage:
  type: ImageBlock
  url: /images/dns-to-rendering-feature.jpg
  altText: >-
    What Happens When You Open a Website: From DNS to Rendering | Aniket Raj's
    Tech Blog
  caption: >-
    What Happens When You Open a Website: From DNS to Rendering | Aniket Raj's
    Tech Blog
  elementId: ''
media:
  type: ImageBlock
  url: /images/dns-to-rendering-feature.jpg
  altText: >-
    What Happens When You Open a Website: From DNS to Rendering | Aniket Raj's
    Tech Blog
  caption: >-
    What Happens When You Open a Website: From DNS to Rendering | Aniket Raj's
    Tech Blog
  elementId: ''
addTitleSuffix: true
colors: colors-b
backgroundImage:
  type: BackgroundImage
  url: /images/dns-to-rendering-bg.jpg
  backgroundSize: cover
  backgroundPosition: center
  backgroundRepeat: no-repeat
  opacity: 80
author: content/data/team/aniket-raj.json
metaTitle: >-
  What Happens When You Open a Website: From DNS to Rendering | Aniket Raj's
  Tech Blog
metaDescription: >-
  A deep technical walkthrough of the end-to-end process when you open a
  website—from DNS lookup and TCP/TLS handshakes to HTML parsing, rendering, and
  CDN delivery. Learn how browsers and networks collaborate to paint pixels on
  your screen.
metaTags:
  - type: MetaTag
    property: 'og:title'
    content: >-
      What Happens When You Open a Website: From DNS to Rendering | Aniket Raj's
      Tech Blog
  - type: MetaTag
    property: 'og:description'
    content: >-
      A deep technical walkthrough of the end-to-end process when you open a
      website—from DNS lookup and TCP/TLS handshakes to HTML parsing, rendering,
      and CDN delivery. Learn how browsers and networks collaborate to paint
      pixels on your screen.
  - type: MetaTag
    property: 'og:type'
    content: Blog
  - type: MetaTag
    property: 'twitter:card'
    content: summary_large_image
  - type: MetaTag
    property: 'twitter:title'
    content: >-
      What Happens When You Open a Website: From DNS to Rendering | Aniket Raj's
      Tech Blog
  - type: MetaTag
    property: 'twitter:creator'
    content: devxaniket
  - type: MetaTag
    property: 'og:url'
    content: 'https://github.com/theaniketraj'
  - type: MetaTag
    property: 'og:url'
    content: 'https://linkedin.com/in/theaniketraj'
socialImage: /images/dns-to-rendering-feature.jpg
---
**What Happens When You Open a Website: From DNS to Rendering**

When you type a URL into your browser’s address bar and press Enter, you trigger a sophisticated sequence of network requests, protocol handshakes, and rendering steps. Understanding this end-to-end process is essential for web developers who want to optimize performance, enhance reliability, and debug issues effectively. In this article, we’ll walk through each stage in detail—from DNS lookup to painting pixels on the screen.

## 1. URL Parsing and Origin Determination

1.  **URL Breakdown**

    *   **Scheme**: `https`

    *   **Host**: `example.com`

    *   **Port**: (default 443 for HTTPS)

    *   **Path**: `/page`

    *   **Query**: `?id=123`

    *   **Fragment**: `#section` (handled client-side)

2.  **Origin**

    The browser determines the “origin” (scheme + host + port) to apply same-origin policies and choose appropriate security context.

## 2. DNS Resolution

1.  **Cache Check**

    The browser and operating system each maintain DNS caches. If the domain’s A/AAAA records are present, this step completes almost instantly.

2.  **Recursive Lookup**

    If not cached, the resolver contacts a root server, TLD server, and finally the authoritative name server for `example.com`. Each step returns either the next server’s address or the final IP address.

3.  **Result**

    You obtain one or more IPv4/IPv6 addresses for the host.

## 3. TCP Connection Establishment

1.  **Three-Way Handshake**

    *   Client sends `SYN` packet to server.

    *   Server responds with `SYN-ACK`.

    *   Client replies with `ACK`.

2.  **Connection Parameters**

    *   Initial sequence numbers (ISNs) are exchanged.

    *   TCP congestion control (e.g., slow start) begins to probe network capacity.

3.  **Port Binding**

    The client OS allocates an ephemeral port for the connection, completing the socket.

## 4. TLS Handshake (for HTTPS)

1.  **ClientHello**

    *   Lists supported TLS versions, cipher suites, and compression methods.

    *   Includes a random nonce.

2.  **ServerHello**

    *   Chooses TLS version and cipher suite.

    *   Sends its certificate chain (leaf + intermediate + root).

    *   Optionally performs ECDH key exchange parameters.

3.  **Certificate Verification**

    The browser verifies the certificate’s chain of trust, validity dates, and hostname match.

4.  **Key Exchange & Finished Messages**

    *   Client and server derive symmetric encryption keys.

    *   Exchange `Finished` messages authenticated via HMAC to confirm handshake integrity.

5.  **Encrypted Channel Established**

    All subsequent HTTP traffic is encrypted with the negotiated cipher suite.

## 5. HTTP Request and Response

1.  **Request Construction**

    The browser sends an HTTP/1.1 or HTTP/2/3 request, including headers:

```
GET /page?id=123 HTTP/2
Host: example.com
User-Agent: Chrome/…
Accept: text/html
```

2\. **Server Processing**

The server routes the request - possibly through a web framework or CDN edge function -      generates HTML (statically or dynamically), and returns a response:

```
HTTP/2 200 OK
Content-Type: text/html; charset=utf-8
Cache-Control: public, max-age=3600
```

3\. **Response Delivery**

1.  Chunked transfer or full payload, depending on server configuration.

2.  HTTP/2 multiplexing can interleave multiple streams on one TCP/TLS connection.

3.  HTTP/3 over QUIC runs over UDP, avoiding head-of-line blocking.

## 6. Browser Processing: The Critical Rendering Path

### 6.1 HTML Parsing → DOM Construction

*   The HTML tokenizer and tree builder parse markup into nodes.

*   Synchronous `<script>` tags without `async` or `defer` block parsing.

### 6.2 CSS Parsing → CSSOM Construction

*   Stylesheets (external and inline) are parsed into the CSS Object Model.

*   External CSS files trigger additional HTTP requests and block rendering until loaded.

### 6.3 Creating the Render Tree

*   The browser merges DOM and CSSOM to build a render tree of visual elements.

*   Non-rendered nodes (e.g., `<head>`, `display: none`) are excluded.

### 6.4 Layout (Reflow)

*   Computes geometry (width, height, position) for each render-tree node.

*   Recursively calculates child layouts—costly when triggered repeatedly.

### 6.5 Paint

*   Fills pixels: colors, text, images, shadows.

*   Each layer is painted into bitmap buffers.

### 6.6 Composite

*   Layers are composited (z-ordering, transforms) into the final frame.

*   Sent to the GPU for display.

## 7. Resource Loading and Optimization

1.  **Parallelism**

    Modern browsers limit concurrent connections per origin (e.g., 6). HTTP/2 mitigates this.

2.  Preconnect & DNS Prefetch

Developers can hint the browsers to establish DNS/TCP/TLS early:

```
<link rel="preconnect" href="https://api.example.com">
<link rel="dns-prefetch" href="//cdn.example.com">
```

1.  **Caching**

    *   **Browser cache** honors `Cache-Control` and `ETag` headers.

    *   **Service Workers** enable fine-grained caching strategies (offline support).

2.  **Minification & Bundling**

    *   Minify HTML, CSS, and JS to reduce payload size.

    *   Bundle modules or use HTTP/2 push to reduce round trips.

3.  **Compression**

    Gzip, Brotli, or Zstd reduce transfer size. Negotiated via the `Accept-Encoding` header.

## 8. Advanced Delivery: CDNs and Edge Computing

1.  **Global Edge Caches**

    CDNs cache static assets (HTML, CSS, JS, images) at edge nodes close to users.

2.  **Cache Invalidation**

    *   Time-based TTL.

    *   Purge API or cache-control directives (`stale-while-revalidate`).

3.  **Edge Functions**

    Lightweight compute at the edge (e.g., Cloudflare Workers, Netlify Edge) can handle SSR, A/B testing, or personalization without round-trips to origin.

## 9. Rendering Lifecycle Events & Performance Metrics

1.  **DOMContentLoaded** fires when the DOM is fully parsed (before stylesheets, images).

2.  **load** event fires when all resources (images, scripts) finish loading.

3.  **First Contentful Paint (FCP)** and **Largest Contentful Paint (LCP)** measure perceived load speed.

4.  **Time to Interactive (TTI)** gauges when the page becomes fully interactive.

Tools such as Lighthouse or WebPageTest provide audit reports and actionable insights.

## 10. Summary

Opening a website involves a coordinated choreography of:

1.  **Network Layer:** DNS → TCP → TLS

2.  **Application Layer:** HTTP/2 or HTTP/3 requests

3.  **Browser Engine:** HTML/CSS parsing → DOM/CSSOM → render tree → layout → paint → composite

4.  **Optimization Layers:** caching, prefetching, CDNs, edge compute

By mastering each stage—leveraging protocol features, optimizing render paths, and harnessing edge infrastructure—you can deliver web experiences that are both fast and resilient. Understanding these under-the-hood mechanics empowers you to diagnose performance bottlenecks, architect scalable solutions, and create delightfully responsive websites.
