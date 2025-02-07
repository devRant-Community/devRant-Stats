<?php

// CONFIGURATION
define('DATABASE', true);
define('DB_HOST', 'host');
define('DB_USER', 'user');
define('DB_PASSWORD', 'pass');
define('DB_NAME', 'db');
define('DB_PORT', 3306);

define('TEMPLATES', false); // Enable/Disable templates. When set to false, features like View::load or layouts wont work (except error layouts)

define('LANG', false);
define('DEFAULT_LANG', 'en');

define('ROUTES_DIR', 'routes/');
define('VIEWS_DIR', 'views/');
define('LAYOUTS_DIR', 'layouts/');
define('QUERIES_DIR', 'queries/');
define('CORE_DIR', 'core/');
define('LANG_DIR', 'local/');

/* Custom global Constants and Config */
define('DEVRANT_API', 'https://devrant.com/api');
header("Access-Control-Allow-Origin: *");

// Run
require_once CORE_DIR . 'Slid.php';

$slid = new Slid();
$slid->runRouting();