

export const menuList = [
    // {
    //     name: 'TOUTE LES APPS',
    //     icon: "mdi-chart-tree",
    //     route: "",
    //     title: "",
    //     subtitle: ""
    // },
    {
        name: 'GESTION DE PLATFORME',
        icon: "mdi-shield-crown",
        route: "platformsList",
        title: "PLATEFORMES",
        subtitle: "Configuration des Plateformes",
        subRoutes: ['PlatformsList', 'DetailPlatform']
    },
    {
        name: 'GESTION DE LOGS',
        icon: "mdi-chart-timeline-variant-shimmer",
        route: "LogsList",
        title: "LOGS",
        subtitle: "logs de la plateforme",
        subRoutes: ['LogsList']
    },
    {
        name: 'GESTION D\'UTILISATEUR',
        icon: "mdi-account",
        route: "usersList",
        title: "",
        subtitle: "Gestion des utilisateurs",
        subRoutes: ['DetailUser', 'UsersList', 'AddUser', 'EditUser']
    },
    {
        name: 'GESTION D\'APPLICATION',
        icon: "mdi-apps",
        route: "Application",
        title: "",
        subtitle: "Gestion des applications",
        subRoutes: ["Application", "DetailApp", "AddApp", "EditApp"]
    },
    {
        name: 'GESTION DE SERVEUR',
        icon: "mdi-server-security",
        route: "Servers",
        title: "",
        subtitle: "Gestion de serveur d\'authentification",
        subRoutes: ['Servers', 'EditServer', 'AddServer', 'ServerDetail']
    },
    {
        name: 'GESTION DE CLÉ UNIQUE',
        icon: "mdi-key",
        route: "CodeUnique",
        title: "",
        subtitle: "Gestion de clés uniques",
        subRoutes: ['CodeUnique']
    },
]