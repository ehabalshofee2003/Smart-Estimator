<?php
return [
    // يجب أن يشمل مسار الـ CSRF
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // لا تستخدم '*' أبداً هنا عند التعامل مع Cookies
    'allowed_origins' => ['http://localhost:5173'],

    'allowed_origins_patterns' => [],

    // يجب أن تشمل X-XSRF-TOKEN لكي يقرأه الـ Axios
    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // الأهم: يجب أن يكون true
    'supports_credentials' => true,
];