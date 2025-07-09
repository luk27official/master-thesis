$aux_dir = 'tmp';
$pdf_mode = 4;

# If your TeX environment does not provide working LuaLaTeX, uncomment this:
#$pdf_mode = 1;

if ($^O eq 'MSWin32') {
    ensure_path('TEXINPUTS', 'tex//;');
} else {
    ensure_path('TEXINPUTS', 'tex//:');
}
