const builtIns = {
  '@jscad/core': `
  
  export const union = (a, b) => {
    return 'union'
  }
  export const cube = (params) => {
    return 'a cube'
  }
  `
}

let modules = { ...builtIns }

self.addEventListener('message', async function (event) {
  // console.log('SW Received Message: ', event.data.name, event.data.source)
  // event.ports[0].postMessage("SW Says 'Hello back!'")
  if (event.data.name && event.data.name === 'reset') {
    modules = { ...builtIns }
  } else if (event.data.name) {
    modules[event.data.name] = event.data.source
    // console.log('modules', modules)
  }
  // console.log('caches', caches, Cache, CacheStorage)
})

self.addEventListener('fetch', (event) => {
  const url = event.request.url
  let path = url.replace('http://localhost:8080/zborg/', '').replace('http://localhost:8080/', '')

  // console.log('event', url)
  if (url.includes('zborg') || url.includes('/@jscad')) {
    const module = modules[path]
    console.log('loading module', path, module)
    event.respondWith(
      new Promise((resolve, reject) => {
        const headers = new Headers({
          'Content-Type': 'application/javascript',
          'Cache-Control': 'no-store', // 'no-cache', // attempt at forced invalidation
          'Expires': 'Wed, 21 Oct 2015 07:28:00 GMT' // same
        })
        resolve(new Response(module, { headers }))
      })
    )
  }
})
// These are necessary to force the web worker initialization before
// any modules are imported
self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

/* self.addEventListener('install', event => {
  console.log('install inside', event, caches)
  event.waitUntil(
    caches.open('v1').then(cache => {
      console.log('cache', cache)
      return cache.addAll([
        './zbur.js'
      ])
    })
  )
}) */
/*
self.addEventListener('fetch', function(event) {
  console.log('intercept fetch', event)
  event.respondWith(
    // magic goes here
  );
}); */
