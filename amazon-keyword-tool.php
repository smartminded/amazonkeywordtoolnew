<?php
/**
 * Plugin Name: Amazon Keyword Tool
 * Plugin URI: https://www.smart-minded.com
 * Description: Free Amazon keyword research tool — keyword ideas via DataForSEO + Rainforest autosuggest, plus reverse-ASIN keyword lookup.
 * Version: 1.0.0
 * Author: SMARTMINDED
 * Author URI: https://www.smart-minded.com
 * License: GPL v2 or later
 * Text Domain: amazon-keyword-tool
 */

if (!defined('ABSPATH')) {
    exit;
}

class AmazonKeywordTool {

    private $version = '1.0.0';

    public function __construct() {
        add_action('init', array($this, 'add_endpoint'));
        add_action('template_redirect', array($this, 'handle_endpoint'));
        add_filter('plugin_action_links_' . plugin_basename(__FILE__), array($this, 'add_settings_link'));
    }

    public function add_settings_link($links) {
        $settings_link = '<a href="/en/amazon-keyword-tool" target="_blank">View Tool</a>';
        array_unshift($links, $settings_link);
        return $links;
    }

    public function add_endpoint() {
        add_rewrite_rule(
            '^([a-z]{2})/amazon-keyword-tool/?$',
            'index.php?amazon_keyword_tool=1&lang=$matches[1]',
            'top'
        );

        add_rewrite_rule(
            '^amazon-keyword-tool/?$',
            'index.php?amazon_keyword_tool=1',
            'top'
        );

        add_rewrite_tag('%amazon_keyword_tool%', '1');
        add_rewrite_tag('%lang%', '([a-z]{2})');

        if (get_option('akt_flush_rewrite_rules') !== 'done_v' . $this->version) {
            flush_rewrite_rules();
            update_option('akt_flush_rewrite_rules', 'done_v' . $this->version);
        }
    }

    public function handle_endpoint() {
        $is_tool = get_query_var('amazon_keyword_tool');

        if ($is_tool) {
            $lang = get_query_var('lang');
            $this->load_template($lang);
            exit;
        }
    }

    private function load_template($lang = '') {
        remove_all_actions('wp_enqueue_scripts');
        remove_all_actions('wp_print_styles');
        remove_all_actions('wp_print_head_scripts');
        remove_all_actions('wp_footer');

        if (!$lang) {
            $request_path = isset($_SERVER['REQUEST_URI']) ? wp_parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) : '';
            if (is_string($request_path) && preg_match('#^/([a-z]{2})/#', $request_path, $matches)) {
                $lang = $matches[1];
            }
        }

        $lang = $lang ? $lang : 'de';

        if (function_exists('icl_object_id') && $lang) {
            do_action('wpml_switch_language', $lang);
        }

        if ($lang === 'de') {
            $canonical = home_url('/amazon-keyword-tool/');
        } else {
            $canonical = home_url('/' . $lang . '/amazon-keyword-tool/');
        }

        $translations = array(
            'en' => array(
                'title'       => 'Amazon Keyword Tool | Free Search Volume & Trends [2026]',
                'description' => 'Find high-volume search terms with our free Amazon Keyword Tool. Get search volume, trends and other data for hundreds of keywords.',
            ),
            'de' => array(
                'title'       => 'Amazon Keyword Tool: Suchvolumen & Trends Gratis [2026]',
                'description' => 'Finde Amazon Keywords mit hohem Suchvolumen mit unserem kostenlosen Tool. Suchvolumen, Trends 2026 und Daten für hunderte Keywords.',
            ),
            'fr' => array(
                'title'       => 'Outil Mots-Clés Amazon : Volume & Tendances [2026]',
                'description' => "Trouvez des mots-clés Amazon à fort volume avec notre outil gratuit. Accédez au volume, aux tendances 2026 et boostez votre SEO en un clic.",
            ),
            'it' => array(
                'title'       => 'Amazon Keyword Tool: Volume e Trend Gratis [2026]',
                'description' => 'Trova parole chiave ad alto volume con il nostro Amazon Keyword Tool gratis. Ottieni volumi, trend 2026 e dati strategici per centinaia di keyword.',
            ),
            'es' => array(
                'title'       => 'Amazon Keyword Tool: Volumen y Tendencias Gratis [2026]',
                'description' => 'Encuentra palabras clave Amazon de alto volumen con nuestro Amazon Keyword Tool gratis. Volumen, tendencias 2026 y datos para cientos de keywords.',
            ),
            'pt' => array(
                'title'       => 'Amazon Keyword Tool: Volume e Tendências Grátis [2026]',
                'description' => 'Encontre palavras-chave Amazon de alto volume com nossa ferramenta gratuita. Volume, tendências 2026 e dados estratégicos para centenas de keywords.',
            ),
        );

        $current_trans = isset($translations[$lang]) ? $translations[$lang] : $translations['en'];
        $page_title = $current_trans['title'];
        $page_description = $current_trans['description'];

        // Hosted production OG image (uploaded outside the plugin so it survives plugin updates).
        $og_image = 'https://www.smart-minded.com/wp-content/uploads/2025/09/Amazon-Keyword-Tool.jpg';

        ?>
        <!DOCTYPE html>
        <html <?php language_attributes(); ?> lang="<?php echo esc_attr($lang); ?>">
        <head>
            <meta charset="<?php bloginfo('charset'); ?>">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="robots" content="index, follow">

            <title><?php echo esc_html($page_title); ?></title>
            <meta name="description" content="<?php echo esc_attr($page_description); ?>">
            <link rel="canonical" href="<?php echo esc_url($canonical); ?>">

            <link rel="icon" href="https://www.smart-minded.com/wp-content/uploads/2025/05/cropped-favicon_smartminded-512-x-512-px.jpg" sizes="32x32">
            <link rel="icon" href="https://www.smart-minded.com/wp-content/uploads/2025/05/cropped-favicon_smartminded-512-x-512-px.jpg" sizes="192x192">
            <link rel="apple-touch-icon" href="https://www.smart-minded.com/wp-content/uploads/2025/05/cropped-favicon_smartminded-512-x-512-px.jpg">

            <meta property="og:locale" content="<?php echo esc_attr($lang . '_' . strtoupper($lang === 'en' ? 'US' : $lang)); ?>">
            <meta property="og:type" content="website">
            <meta property="og:title" content="<?php echo esc_attr($page_title); ?>">
            <meta property="og:description" content="<?php echo esc_attr($page_description); ?>">
            <meta property="og:url" content="<?php echo esc_url($canonical); ?>">
            <meta property="og:site_name" content="SMARTMINDED">
            <meta property="og:image" content="<?php echo esc_url($og_image); ?>">

            <meta name="twitter:card" content="summary_large_image">
            <meta name="twitter:title" content="<?php echo esc_attr($page_title); ?>">
            <meta name="twitter:description" content="<?php echo esc_attr($page_description); ?>">
            <meta name="twitter:image" content="<?php echo esc_url($og_image); ?>">

            <link rel="alternate" hreflang="en" href="<?php echo esc_url(home_url('/en/amazon-keyword-tool/')); ?>">
            <link rel="alternate" hreflang="de" href="<?php echo esc_url(home_url('/amazon-keyword-tool/')); ?>">
            <link rel="alternate" hreflang="fr" href="<?php echo esc_url(home_url('/fr/amazon-keyword-tool/')); ?>">
            <link rel="alternate" hreflang="it" href="<?php echo esc_url(home_url('/it/amazon-keyword-tool/')); ?>">
            <link rel="alternate" hreflang="es" href="<?php echo esc_url(home_url('/es/amazon-keyword-tool/')); ?>">
            <link rel="alternate" hreflang="pt" href="<?php echo esc_url(home_url('/pt/amazon-keyword-tool/')); ?>">
            <link rel="alternate" hreflang="x-default" href="<?php echo esc_url(home_url('/en/amazon-keyword-tool/')); ?>">

            <link rel="preload" href="<?php echo plugins_url('assets/css/app.css', __FILE__); ?>" as="style">
            <link rel="preload" href="<?php echo plugins_url('assets/js/app.js', __FILE__); ?>" as="script">

            <link rel="stylesheet" href="<?php echo plugins_url('assets/css/app.css', __FILE__); ?>?v=<?php echo $this->version; ?>">

            <script type="application/ld+json">
            <?php
                $schema = array(
                    '@context' => 'https://schema.org',
                    '@type' => 'WebApplication',
                    'name' => 'Amazon Keyword Tool',
                    'url' => $canonical,
                    'applicationCategory' => 'BusinessApplication',
                    'operatingSystem' => 'All',
                    'description' => $page_description,
                    'datePublished' => '2026-05-04',
                    'dateModified' => '2026-05-11',
                    'inLanguage' => $lang,
                    'offers' => array(
                        '@type' => 'Offer',
                        'price' => '0',
                        'priceCurrency' => 'USD'
                    ),
                    'publisher' => array(
                        '@type' => 'Organization',
                        'name' => 'SMARTMINDED',
                        'url' => home_url('/')
                    )
                );
                echo wp_json_encode($schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
            ?>
            </script>

            <style>
                #wpadminbar { display: none !important; }
                html { margin-top: 0 !important; }
                body {
                    margin: 0;
                    padding: 0;
                    background: #ffffff;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                }
                #akt-root:empty::before {
                    content: 'Loading Amazon Keyword Tool...';
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    font-size: 24px;
                    color: #666;
                }
            </style>
            <script src="https://analytics.ahrefs.com/analytics.js" data-key="kWBXdCw/ORWPgdPZFXCULg" async></script>

            <?php if ($lang === 'en') : ?>
            <!-- Google tag (gtag.js) — English version only -->
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-VG7P0DDS0J"></script>
            <script>
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-VG7P0DDS0J');
                gtag('config', 'AW-16806730151');
            </script>

            <!-- Google Ads conversion: Amazon Keyword Tool Sign Up -->
            <script>
                function gtag_report_conversion(url) {
                    var callback = function () {
                        if (typeof(url) != 'undefined') {
                            window.location = url;
                        }
                    };
                    gtag('event', 'conversion', {
                        'send_to': 'AW-16806730151/SXkwCMrUrfIZEKezic4-',
                        'event_callback': callback
                    });
                    return false;
                }
            </script>
            <?php endif; ?>
        </head>
        <body class="amazon-keyword-tool">
            <!-- React mount: navbar + hero + tool widget -->
            <div id="akt-root"></div>

            <?php
            /*
             * Server-render the 7 marketing content articles so Google can
             * crawl them without executing JavaScript. The translations come
             * from the same locale JSONs the React app uses (deploy script
             * copies them to assets/locales/ on the server).
             */
            $locale_path = plugin_dir_path(__FILE__) . 'assets/locales/' . $lang . '.json';
            if (!file_exists($locale_path)) {
                $locale_path = plugin_dir_path(__FILE__) . 'assets/locales/en.json';
            }
            $locale_data = file_exists($locale_path) ? json_decode(file_get_contents($locale_path), true) : array();
            $content = isset($locale_data['content']) ? $locale_data['content'] : array();

            $render_p = function ($raw) {
                // Allow only <b> tags; everything else is escaped.
                $escaped = esc_html($raw);
                return str_replace(array('&lt;b&gt;', '&lt;/b&gt;'), array('<b>', '</b>'), $escaped);
            };

            // Image manifest mirrors what KeywordToolContent.jsx used to render.
            $sections = array(
                's1' => array('img' => 'https://www.smart-minded.com/wp-content/uploads/2025/10/smartminded_Amazon_Keyword_Tool-2.png',                              'pre' => array('p1','p2'), 'post' => array('p3')),
                's2' => array('img' => 'https://www.smart-minded.com/wp-content/uploads/2025/10/smartminded_Amazon_Keyword_Tool_Competition_Levels-1.png',            'pre' => array('p1','p2','p3')),
                's3' => array('img' => 'https://www.smart-minded.com/wp-content/uploads/2025/10/smartminded_Amazon_keyword_tools_search_volume_market_size-1.png',   'pre' => array('p1','p2')),
                's4' => array('img' => 'https://www.smart-minded.com/wp-content/uploads/2025/10/smartminded_Amazon_Keyword_Tool_Get_Product_Keywords-1.png',          'pre' => array('p1')),
                's5' => array('img' => 'https://www.smart-minded.com/wp-content/uploads/2025/10/smartminded_Amazon_Keyword_Tool_marketplaces-1.png',                  'pre' => array('p1','p2')),
                's6' => array('img' => 'https://www.smart-minded.com/wp-content/uploads/2026/01/Amazon_Keyword_Tool_Export_Results_max.png',                          'pre' => array('p1','p2')),
                's7' => array('img' => 'https://www.smart-minded.com/wp-content/uploads/2025/10/smartminded_Amazon_Keyword_Tool_Create_a_Listing-2.png',              'pre' => array('p1'), 'post' => array('p2')),
            );
            ?>

            <section class="bg-white px-6 py-16 sm:px-10 md:px-12 md:py-24 lg:px-8">
                <div class="mx-auto max-w-3xl space-y-20 md:space-y-28">
                    <?php foreach ($sections as $sid => $sdef): if (!isset($content[$sid])) continue; ?>
                    <article>
                        <h2 class="mb-6 text-2xl tracking-tight text-gray-900 sm:text-3xl md:text-4xl">
                            <?php echo esc_html($content[$sid]['h']); ?>
                        </h2>
                        <div class="space-y-4 text-base leading-relaxed text-gray-700 sm:text-lg">
                            <?php foreach ($sdef['pre'] as $pkey): ?>
                                <p><?php echo $render_p($content[$sid][$pkey]); ?></p>
                            <?php endforeach; ?>
                        </div>
                        <div class="my-10 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 shadow-sm">
                            <img src="<?php echo esc_url($sdef['img']); ?>" alt="<?php echo esc_attr($content[$sid]['imgAlt']); ?>" loading="lazy" class="block w-full">
                        </div>
                        <?php if (!empty($sdef['post'])): ?>
                        <div class="space-y-4 text-base leading-relaxed text-gray-700 sm:text-lg">
                            <?php foreach ($sdef['post'] as $pkey): ?>
                                <p><?php echo $render_p($content[$sid][$pkey]); ?></p>
                            <?php endforeach; ?>
                        </div>
                        <?php endif; ?>
                    </article>
                    <?php endforeach; ?>
                </div>
            </section>

            <!-- React mount: LearnMoreCta + Footer -->
            <div id="akt-bottom"></div>

            <script>
                window.AKT_LANG = '<?php echo esc_js($lang); ?>';
                window.AKT_VERSION = '<?php echo esc_js($this->version); ?>';
                window.AKT_REST_BASE = '<?php echo esc_js(rest_url('akt/v1')); ?>';
                window.AKT_NONCE = '<?php echo esc_js(wp_create_nonce('wp_rest')); ?>';
            </script>

            <script type="module" src="<?php echo plugins_url('assets/js/app.js', __FILE__); ?>?v=<?php echo $this->version; ?>"></script>

            <?php do_action('akt_after_app'); ?>
        </body>
        </html>
        <?php
    }
}

add_action('wp_enqueue_scripts', function() {
    if (get_query_var('amazon_keyword_tool')) {
        global $wp_styles, $wp_scripts;
        $wp_styles->queue = array();
        $wp_scripts->queue = array();
    }
}, 999);

function akt_init() {
    new AmazonKeywordTool();
}
add_action('plugins_loaded', 'akt_init');

register_activation_hook(__FILE__, function() {
    flush_rewrite_rules();
    error_log('Amazon Keyword Tool plugin activated');
});

register_deactivation_hook(__FILE__, function() {
    delete_option('akt_flush_rewrite_rules');
    flush_rewrite_rules();
    error_log('Amazon Keyword Tool plugin deactivated');
});

/* -------------------------------------------------------------------------
 * REST API proxy for DataForSEO + Rainforest.
 *
 * Why: the React app would otherwise need provider credentials in the browser
 * bundle, which leaks them publicly. These endpoints keep credentials server-
 * side (read from wp-config constants) and only forward allowlisted requests.
 *
 * Credentials — add to wp-config.php (NEVER commit them):
 *   define('AKT_DATAFORSEO_LOGIN',    'your-login');
 *   define('AKT_DATAFORSEO_PASSWORD', 'your-password');
 *   define('AKT_RAINFOREST_KEY',      'your-rainforest-key');
 *
 * Optional tunables:
 *   define('AKT_RATE_LIMIT_MAX',    60); // requests per window per IP
 *   define('AKT_RATE_LIMIT_WINDOW', 5);  // window in minutes
 * ------------------------------------------------------------------------- */

/**
 * The site has a global filter that blocks REST API requests from logged-out
 * visitors (e.g. Wordfence / "Disable REST API"). That filter returns its 401
 * before our per-route permission_callback can run, so anonymous visitors can
 * never reach our proxy. Opt our namespace out of the lockdown — our routes
 * still have their own same-origin + nonce + rate-limit checks downstream.
 */
add_filter('rest_authentication_errors', function ($errors) {
    if (empty($_SERVER['REQUEST_URI'])) {
        return $errors;
    }
    $uri = $_SERVER['REQUEST_URI'];
    if (strpos($uri, '/wp-json/akt/v1/') !== false || strpos($uri, 'rest_route=/akt/v1/') !== false) {
        return null; // allow our routes through; their own checks run next
    }
    return $errors;
}, PHP_INT_MAX);

add_action('rest_api_init', function () {
    register_rest_route('akt/v1', '/dataforseo', array(
        'methods'             => 'POST',
        'callback'            => 'akt_proxy_dataforseo',
        'permission_callback' => 'akt_proxy_permission_check',
        'args'                => array(
            'path' => array('type' => 'string', 'required' => true),
            'body' => array('type' => 'array',  'required' => true),
        ),
    ));

    register_rest_route('akt/v1', '/rainforest', array(
        'methods'             => 'GET',
        'callback'            => 'akt_proxy_rainforest',
        'permission_callback' => 'akt_proxy_permission_check',
        'args'                => array(
            'type'          => array('type' => 'string', 'required' => true),
            'amazon_domain' => array('type' => 'string', 'required' => true),
            'search_term'   => array('type' => 'string', 'required' => true),
        ),
    ));
});

/**
 * Permission check: same-origin + valid REST nonce + per-IP rate limit.
 *
 * The nonce protects against CSRF and ties calls to a session that loaded the
 * tool page. The origin check rejects cross-site abuse. The rate limit caps
 * how much quota any single IP can burn in a given window.
 */
function akt_proxy_permission_check(WP_REST_Request $request) {
    // Origin check — reject if a remote origin is set and doesn't match home.
    $origin = $request->get_header('Origin');
    if ($origin) {
        $origin_host = parse_url($origin, PHP_URL_HOST);
        $home_host   = parse_url(home_url(), PHP_URL_HOST);
        if ($origin_host && $origin_host !== $home_host) {
            return new WP_Error('akt_bad_origin', 'Origin not allowed', array('status' => 403));
        }
    }

    // Nonce check — REST nonces are sent as X-WP-Nonce.
    $nonce = $request->get_header('X-WP-Nonce');
    if (!$nonce || !wp_verify_nonce($nonce, 'wp_rest')) {
        return new WP_Error('akt_bad_nonce', 'Invalid or missing nonce', array('status' => 403));
    }

    // Per-IP rate limit using transients.
    // The default cap accommodates Tab 1's natural fan-out: one "Get Keyword
    // Ideas" search makes ~22 upstream calls (Stage 1 + Stage 2 autocomplete +
    // enrichment). Cap = 300 lets a single IP do ~13 searches per 5 minutes,
    // which is far above any realistic user load. The localStorage gate (5
    // searches/week per browser) is the primary throttle; this server-side
    // limit only exists for abuse protection.
    $max    = defined('AKT_RATE_LIMIT_MAX')    ? (int) AKT_RATE_LIMIT_MAX    : 300;
    $window = defined('AKT_RATE_LIMIT_WINDOW') ? (int) AKT_RATE_LIMIT_WINDOW : 5;
    $ip     = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : 'unknown';
    $key    = 'akt_rl_' . md5($ip);
    $count  = (int) get_transient($key);
    if ($count >= $max) {
        return new WP_Error('akt_rate_limited', 'Rate limit exceeded', array('status' => 429));
    }
    set_transient($key, $count + 1, $window * MINUTE_IN_SECONDS);

    return true;
}

/** DataForSEO proxy. Forwards the body to an allowlisted endpoint path. */
function akt_proxy_dataforseo(WP_REST_Request $request) {
    $allowed_paths = array(
        '/v3/keywords_data/google_ads/keywords_for_keywords/live',
        '/v3/keywords_data/google_ads/search_volume/live',
        '/v3/dataforseo_labs/amazon/ranked_keywords/live',
    );

    $path = $request->get_param('path');
    if (!in_array($path, $allowed_paths, true)) {
        return new WP_Error('akt_bad_path', 'Path not allowed', array('status' => 400));
    }

    $login = defined('AKT_DATAFORSEO_LOGIN')    ? AKT_DATAFORSEO_LOGIN    : '';
    $pass  = defined('AKT_DATAFORSEO_PASSWORD') ? AKT_DATAFORSEO_PASSWORD : '';
    if (!$login || !$pass) {
        return new WP_Error('akt_no_creds', 'DataForSEO credentials not configured', array('status' => 500));
    }

    $body = $request->get_param('body');
    if (!is_array($body)) {
        return new WP_Error('akt_bad_body', 'Body must be an array', array('status' => 400));
    }

    $response = wp_remote_post('https://api.dataforseo.com' . $path, array(
        'timeout' => 60,
        'headers' => array(
            'Content-Type'  => 'application/json',
            'Authorization' => 'Basic ' . base64_encode($login . ':' . $pass),
        ),
        'body'    => wp_json_encode($body),
    ));

    if (is_wp_error($response)) {
        return new WP_Error('akt_upstream', $response->get_error_message(), array('status' => 502));
    }

    $code = wp_remote_retrieve_response_code($response);
    $json = wp_remote_retrieve_body($response);
    return new WP_REST_Response(json_decode($json, true), $code ? $code : 200);
}

/** Rainforest proxy. Only accepts the autocomplete endpoint we use. */
function akt_proxy_rainforest(WP_REST_Request $request) {
    $allowed_types = array('autocomplete');
    $type = $request->get_param('type');
    if (!in_array($type, $allowed_types, true)) {
        return new WP_Error('akt_bad_type', 'Type not allowed', array('status' => 400));
    }

    $api_key = defined('AKT_RAINFOREST_KEY') ? AKT_RAINFOREST_KEY : '';
    if (!$api_key) {
        return new WP_Error('akt_no_creds', 'Rainforest credentials not configured', array('status' => 500));
    }

    $params = array(
        'api_key'       => $api_key,
        'type'          => $type,
        'amazon_domain' => $request->get_param('amazon_domain'),
        'search_term'   => $request->get_param('search_term'),
    );

    $url = 'https://api.rainforestapi.com/request?' . http_build_query($params);

    $response = wp_remote_get($url, array('timeout' => 60));
    if (is_wp_error($response)) {
        return new WP_Error('akt_upstream', $response->get_error_message(), array('status' => 502));
    }

    $code = wp_remote_retrieve_response_code($response);
    $json = wp_remote_retrieve_body($response);
    return new WP_REST_Response(json_decode($json, true), $code ? $code : 200);
}
