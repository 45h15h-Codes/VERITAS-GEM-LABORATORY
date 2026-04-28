<?php

return [

    'paths' => ['api/*', 'uploads/*', '*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [  'http://localhost:5173',
        'http://localhost:3000',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000',
        'https://vgllab.com',
        'https://www.vgllab.com'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => ['Content-Disposition'],

    'max_age' => 0,

    'supports_credentials' => true,
];
