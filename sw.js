const CACHE_NAME = 'dimob-pro-v7';

// Arquivos que serão salvos no computador do usuário
const urlsToCache = [
    './',
    './index.html',
    './baseMunicipios.js',
    // Bibliotecas externas (para funcionar offline)
    'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// 1. Instalação: Baixa os arquivos para o cache
self.addEventListener('install', event => {
    console.log('[Service Worker] Instalando Versão:', CACHE_NAME);
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[Service Worker] Fazendo cache dos arquivos');
                return cache.addAll(urlsToCache);
            })
    );
});

// 2. Ativação: Limpa versões antigas (CRUCIAL PARA O SEU CASO)
self.addEventListener('activate', event => {
    console.log('[Service Worker] Ativando e Limpando Caches Antigos');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // Se o cache salvo for diferente da versão atual (CACHE_NAME), apaga ele.
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Removendo cache antigo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// 3. Interceptação: Serve o arquivo do cache se existir (Offline First)
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Se achou no cache, retorna ele. Se não, busca na internet.
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});
