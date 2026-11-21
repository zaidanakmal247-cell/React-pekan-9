<?php

use App\Providers\AppServiceProvider;
use Laravel\Fortify\FortifyServiceProvider;

return [
    FortifyServiceProvider::class,
    AppServiceProvider::class,
    App\Providers\FortifyServiceProvider::class,
];
