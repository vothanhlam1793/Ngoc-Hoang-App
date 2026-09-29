function baseURL() {
  return baseProxy();
}

function baseProxy() {
  if (!process.env.API_BASE_URL) {
    return "http://127.0.0.1:3011";
  }

  return process.env.API_BASE_URL.replace(/\/admin\/api\/?$/, "").replace(/\/+$/, "");
}
export default {
  ssr: false,
  render: {
    resourceHints: false,
    etag: true,
    static: {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 ngày
    },
    dist: {
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 năm
    },
  },
  serverMiddleware: [
    (req, res, next) => {
      // Chỉ gắn chống cache cho các request HTML và tài liệu chính
      if (!req.url.startsWith("/_nuxt/") && !req.url.startsWith("/__webpack_hmr")) {
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");
      }
      next();
    },
  ],
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "MN Ngọc Hoàng",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/student.ico" },
      { rel: "apple-touch-icon", size: "180x180", href: "/student.png" },
      {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css",
      },
      {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/npm/bootstrap-select@1.13.14/dist/css/bootstrap-select.min.css",
      },
    ],
    script: [
      {
        src: "https://cdn.jsdelivr.net/npm/jquery@3.6.3/dist/jquery.slim.min.js",
      },
      {
        src: "https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js",
      },
      {
        src: "https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js",
      },
      {
        src: "https://cdn.jsdelivr.net/npm/bootstrap-select@1.13.14/dist/js/bootstrap-select.min.js",
      },
      {
        src: "https://cdn.jsdelivr.net/npm/bootstrap-select@1.13.14/dist/js/i18n/defaults-vi_VN.min.js",
      },
      // { src: "/i18n.js"},
      // { src: "/extend.js"},
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["@fortawesome/fontawesome-free/css/all.css"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    // { src: '~/plugins/bootstrap.js', ssr: false }
    "~/plugins/moment",
    "~/plugins/format",
  ],

  router: {
    middleware: [],
  },

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    "@nuxt/content",
    "@nuxtjs/axios",
    "@nuxtjs/apollo",
    "@nuxtjs/auth-next",
    "@nuxtjs/proxy",
    "bootstrap-vue/nuxt",
  ],

  bootstrapVue: {
    // Install the `IconsPlugin` plugin (in addition to `BootstrapVue` plugin)
    icons: true,
  },

  axios: {
    baseURL: baseURL(),
    debug: process.env.DEBUG || false,
    proxyHeaders: false,
    credentials: false,
    proxy: true,
  },
  proxy: {
    "/api/camera-integration": baseURL(),
    "/admin/api": baseURL(),
    "/api/payment-hub": baseURL(),
    "/api/portal": baseURL(),
  },
  auth: {
    strategies: {
      graphql: {
        cookie: {
          // (optional) If set, we check this cookie existence for loggedIn check
          name: "XSRF-TOKEN",
        },
        token: {
          property: "access_token",
          maxAge: 60 * 60 * 24 * 60,
          global: true,
          // type: 'Bearer'
        },
        refreshToken: {
          property: "refresh_token",
          data: "refresh_token",
          maxAge: 60 * 60 * 24 * 30,
        },
        scheme: "~/schemes/graphqlScheme.js",
      },
    },
    redirect: {
      login: "/login",
      logout: "/login?logout=true",
      callback: false,
      home: "/",
    },
  },

  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: process.env.APOLLO_HTTP_ENDPOINT || '/admin/api',
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ["defu"],
    // babel: {
    //   compact: true,
    // },
  },

  server: {
    host: process.env.HOST || "0.0.0.0", // default: localhost
    port: parseInt(process.env.PORT, 10) || 3012, // default: 3012
  },
};
