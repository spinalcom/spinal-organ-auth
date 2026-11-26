
new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    async mounted() {
        this.platformId = location.pathname.split("/").filter(el => el)[1];
        let serversJson = JSON.parse(servers);
        const { local, external } = serversJson.reduce((data, ser) => {
            if (ser.type === "EXTERNAL_SERVER") data.external.push(ser);
            else data.local.push(ser);

            return data;
        }, { local: [], external: [] })

        this.localServers = local;
        this.externalServers = external;

        this.queries = this.getQueries();
        this.credential.userName = this.queries.userName || "";
        this.credential.password = "";

        // Wait for the credential watcher triggered by the restored username.
        // Otherwise it hides the authentication error immediately afterwards.
        await this.$nextTick();

        if (this.queries.error) {
            this.hide = false;
            this.showError = true;
        }

        // this.hidenData = this.$route.query;
        // this.hiddenKeys = Object.keys(this.hidenData);
        // if (this.$route.query.error) {
        //     this.showError = true;
        //     this.hide = false;
        // }
    },
    computed: {
        errorMessage() {
            if (this.queries.account_locked === "true") {
                return "Ce compte est temporairement verrouillé. Réessayez plus tard."
            }
            return this.queries.error_description || "incorrect login and/or password !"
        }
    },
    data() {
        return {
            showPassword: false,
            showError: false,
            hide: true,
            hidenData: undefined,
            hiddenKeys: [],
            platformId: "",
            credential: {
                userName: "",
                password: "",
                // client_id: this.$route.query.client_id,
                // redirect_uri: this.$route.query.redirect_uri,
                // state: this.$route.query.state,
                // response_type: this.$route.query.response_type,
                // code_challenge: this.$route.query.code_challenge,
                // code_challenge_method: this.$route.query.code_challenge_method,
            },
            queries: [],
            localServers: [],
            externalServers: []
        }
    },
    methods: {
        getQueries() {
            if (!location.search) return {};
            return location.search.substr(1).split("&").reduce((obj, queryPart) => {
                const separatorIndex = queryPart.indexOf("=");
                const rawKey = separatorIndex === -1 ? queryPart : queryPart.slice(0, separatorIndex);
                const rawValue = separatorIndex === -1 ? "" : queryPart.slice(separatorIndex + 1);
                const key = decodeURIComponent(rawKey.replace(/\+/g, " "));
                const value = decodeURIComponent(rawValue.replace(/\+/g, " "));
                obj[key] = value;
                return obj;
            }, {})
        },
        decodeCert(cert) {
            var enc = new TextDecoder("utf-8");
            var arr = new Uint8Array(cert);
            return enc.decode(arr);
        },

        connectWithExternalServer(item) {
            this.sendRequest(item.id, false);
        },

        connectWithLocalServer() {
            const local = this.localServers[0];
            this.sendRequest(local.id, true);
        },

        sendRequest(serverId, isLocalServer) {
            var data = new FormData();
            if (isLocalServer) {
                data.append('userName', this.credential.userName);
                data.append('password', this.credential.password);
            }

            var xhr = new XMLHttpRequest();
            xhr.open('POST', `${location.href}/${serverId}`, true);

            xhr.

                xhr.send(data);
        }
    },
    watch: {
        credential: {
            handler() {
                this.hide = true;
            },
            deep: true,
        },
    },
})
