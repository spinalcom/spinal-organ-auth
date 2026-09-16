<template>
  <v-app>
    <v-main>
      <!-- <BachupInformation title="MODIFIER UNE PLATEFORME"> -->
      <form class="formulaire" novalidate @submit.prevent="submitForm">
        <div class="title">MODIFIER UNE PLATEFORME</div>
        <InputUser title="NOM DE LA PLATEFORME" id="name" v-model="formPlatform.name" />
        <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formPlatform.name.required">Un nom de plateforme
          est requis</span>
        <span class="errors" :class="{ showspan: iserrors }" v-else-if="!$v.formPlatform.name.minLength">Le nom doit
          contenir au moins 3 caractères.</span>

        <InputUser title="L'URL DE MIS A JOUR DE LA PLATEFORME" id="url" v-model="formPlatform.url" />
        <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formPlatform.url.required">L'URL de la plateforme
          est requise.</span>
        <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formPlatform.url.format">L'URL de la plateforme
          est invalide.</span>

        <InputUser title="L'URL DE REDIRECTION DE LA PLATEFORME" id="redirectUrl" v-model="formPlatform.redirectUrl" />
        <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formPlatform.redirectUrl.required">
          L'URL de redirection est requise.
        </span>

        <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formPlatform.redirectUrl.format">
          L'URL de redirection est invalide.
        </span>

        <SelectGrant title="GRANT TYPES" id="grant_types" v-model="formPlatform.grant_types"
          :value="formPlatform.grant_types" />
        <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formPlatform.grant_types.isValid">Au moins un
          type d'autorisation est requis.
        </span>

        <div class="loginServerContainer">
          <h5 class="title">Ajouter le(s) serveur(s) d'authentification</h5>

          <div v-for="item in servers" :key="item.id" class="serverItem">
            <div class="selector">
              <div class="icon">
                <v-icon>mdi-server-security</v-icon>
              </div>
              <div class="name">{{ item.name }}</div>
              <!-- <SelectUser :id=index class="platform" @select="getAppProfileList()" :tab="platformList"
                      v-model="formPlatformObjectapp.platform" title="PLATFORM"
                      :disabled="disableobjet[index] ? disableobjet[index].plat == true ? true : false : false" /> -->
            </div>

            <button type="button" class="serverBtn delete" v-if="isLinked(item)" @click="unlinkItem(item)">
              <v-icon>mdi-trash-can-outline</v-icon>
            </button>

            <button type="button" class="serverBtn add" v-else @click="linkItem(item)">
              <v-icon>mdi-plus</v-icon>
            </button>
          </div>
        </div>

        <div class="d-flex justify-end">
          <button type="button" class="btn-retour" @click="goBack()">
            ANNULER
          </button>
          <button type="submit" class="btn-creer">
            MODIFIER LA PLATEFORME
          </button>
        </div>
      </form>
      <!-- </BachupInformation> -->
    </v-main>
  </v-app>
</template>

<script>
import InputUser from "../Components/InputUser";
import { required, minLength } from "vuelidate/lib/validators";
import { mapActions, mapGetters } from "vuex";
import SelectGrant from "../Components/SelectGrants.vue";
import { URL_REGEX } from "../services/formUtils";

export default {
  name: "App",
  components: {
    InputUser,
    SelectGrant,
  },
  data() {
    return {
      formPlatform: {
        grant_types: [],
        name: null,
        url: null,
        redirectUrl: null,
        loginServerIds: [],
      },
      iserrors: true,
    };
  },
  validations: {
    formPlatform: {
      name: {
        required,
        minLength: minLength(3),
      },
      redirectUrl: {
        required,
        format: (value) => {
          return URL_REGEX.test(value);
        },
      },
      url: {
        required,
        format: (value) => {
          return URL_REGEX.test(value);
        },
      },
      grant_types: {
        required,
        format: (value) => {
          return value.length > 0;
        },
      },
    },
  },
  methods: {
    goBack() {
      // this.$router.push("/PlatformsList");
      this.$router.go(-1);
    },

    async loadFormData() {
      const id = this.$route.query.id;
      const platformData = await this.$store.dispatch(
        "platforms/getPlatformInfo",
        id
      );

      this.formPlatform.name = platformData.name;
      this.formPlatform.url = platformData.url;
      this.formPlatform.redirectUrl = platformData.redirectUrl;
      this.formPlatform.grant_types = platformData.grant_types;
      this.formPlatform.loginServerIds = await this.getServersIds(id);
    },

    ...mapActions({
      editPlatformItem: "platforms/editPlatformItem",
      getAllServers: "serverLogin/getAllServers",
    }),
    async getServersIds(id) {
      const serverList = await this.$store.dispatch(
        "platforms/getServerList",
        id
      );
      return serverList.map((el) => el.id);
    },
    async submitForm() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.editPlatformItem({
          platform: this.formPlatform,
          platformId: this.$route.query.id,
        }).then(() => {
          // this.$router.push("/PlatformsList");
          this.$router.go(-1);
        });
      } else {
        this.iserrors = false;
      }
    },

    isLinked(item) {
      return this.formPlatform.loginServerIds.indexOf(item.id) !== -1;
    },

    linkItem(item) {
      this.formPlatform.loginServerIds = [
        ...this.formPlatform.loginServerIds,
        item.id,
      ];
    },

    unlinkItem(item) {
      this.formPlatform.loginServerIds =
        this.formPlatform.loginServerIds.filter((el) => el !== item.id);
    },
  },
  computed: {
    ...mapGetters({ servers: "serverLogin/servers" }),
  },
  async created() {
    await this.loadFormData();
    await this.getAllServers();
  },
};
</script>

<style scoped>
@import "../assets/form-common.css";

.v-application {
  background-color: #d6e2e600;
}

.formulaire {
  padding-left: 25%;
  padding-right: 25%;
  padding-bottom: 20px;
  padding-top: 20px;
}

.btn-retour {
  margin-right: 5px;
}

.btn-creer {
  margin-left: 5px;
}

.loginServerContainer {
  width: 100%;
  height: 350px;
  margin-top: 20px;
  padding: 5px;
  overflow: auto;
}

.serverItem {
  display: flex;
  border: 1px solid grey;
  align-items: center;
  padding: 5px;
  margin-top: 5px;
  border-radius: 10px;
}

.selector {
  display: flex;
  align-items: center;
}

.selector .icon {
  margin-right: 10px;
}

.selector .name {
  font-size: 1em;
}

.serverBtn {
  border-radius: 10px;
  height: 42px;
  width: 45px;
}

.serverBtn.delete {
  color: #ff4500 !important;
  border: 1px solid #ff4500;
}

.serverBtn.delete i {
  color: #ff4500 !important;
}

.serverBtn.add {
  color: #14202c !important;
  border: 1px solid #14202c;
}
</style>
