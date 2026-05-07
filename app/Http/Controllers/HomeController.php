<?php

namespace App\Http\Controllers;

use App\Support\HomepageContent;
use Illuminate\View\View;

class HomeController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(HomepageContent $content): View
    {
        return view('pages.home', [
            'credential' => $content->credential(),
            'contactLinks' => $content->contactLinks(),
            'currentFocus' => $content->currentFocus(),
            'projects' => $content->featuredProjects(),
        ]);
    }
}
