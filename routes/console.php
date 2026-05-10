<?php

use App\Support\HomepageContent;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('app:export-static {--output=dist}', function (HomepageContent $content) {
    $outputDirectory = base_path($this->option('output'));

    File::deleteDirectory($outputDirectory);
    File::ensureDirectoryExists($outputDirectory);

    foreach (File::files(public_path()) as $file) {
        if (in_array($file->getFilename(), ['.htaccess', 'hot', 'index.php'], true)) {
            continue;
        }

        File::copy($file->getPathname(), $outputDirectory.DIRECTORY_SEPARATOR.$file->getFilename());
    }

    if (File::isDirectory(public_path('build'))) {
        File::copyDirectory(public_path('build'), $outputDirectory.DIRECTORY_SEPARATOR.'build');
    }

    $html = view('pages.home', [
        'credential' => $content->credential(),
        'contactLinks' => $content->contactLinks(),
        'currentFocus' => $content->currentFocus(),
        'projects' => $content->featuredProjects(),
    ])->render();
    $html = preg_replace('#https?://[^"\']+/build/#', '/build/', $html) ?? $html;

    File::put($outputDirectory.DIRECTORY_SEPARATOR.'index.html', $html);

    $this->components->info('Static site exported to '.$outputDirectory);
})->purpose('Export the portfolio homepage as a static Cloudflare Pages build');
