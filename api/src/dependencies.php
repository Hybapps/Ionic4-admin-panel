<?php
// DIC configuration

$container = $app->getContainer();
/*$container[UserController::class] = function ($container) { 
    return new UserController();
};*/
$container['UserController'] = function ($container) {
    return new \App\Controllers\UserController($container->get('settings'));
};
/*$container['UserController'] = function ($container) {
    return new UserController();
    // return an instantiated UserController here.
};*/
/*$container['UserController'] = function ($container) {
    return new  \App\Controllers\UserController($container->get('settings'));
};*/

// view renderer
$container['renderer'] = function ($c) {
    $settings = $c->get('settings')['renderer'];
    return new Slim\Views\PhpRenderer($settings['template_path']);
};

// PDO database library 
$container['db'] = function ($c) {
    $settings = $c->get('settings')['db'];
    $pdo = new PDO("mysql:host=" . $settings['host'] . ";dbname=" . $settings['dbname'],
        $settings['user'], $settings['pass']);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    return $pdo;
};

// monolog
$container['logger'] = function ($c) {
    $settings = $c->get('settings')['logger'];
    $logger = new Monolog\Logger($settings['name']);
    $logger->pushProcessor(new Monolog\Processor\UidProcessor());
    $logger->pushHandler(new Monolog\Handler\StreamHandler($settings['path'], $settings['level']));
    return $logger;
};
