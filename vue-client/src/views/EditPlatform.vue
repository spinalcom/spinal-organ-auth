<template>
  <v-app>
    <v-main>
      <BachupInformation title="MODIFICATION PLATEFORME">
        <form class="formulaire" novalidate @submit.prevent="validateApp">
          <InputUser title="NOM DE LA PLATEFORME" id="telephone" v-model="formPlatform.name" />
          <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formPlatform.name.minLength">Nom
            invalide</span>
          <span class="errors" :class="{ showspan: iserrors }" v-else-if="!$v.formPlatform.name.required">Un nom de
            plateforme est requis</span>

          <InputUser title="L'URL DE MIS A JOUR DE LA PLATEFORME" id="appName" v-model="formPlatform.url" />

          <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formPlatform.url.required">L'url de mis à jour
            est requis</span>

          <span class="errors" :class="{ showspan: iserrors }"
            v-if="!$v.formPlatform.url.minLength && $v.formPlatform.url.format">l'url de mis à jour est invalide</span>

          <InputUser title="L'URL DE REDIRECTION DE LA PLATEFORME" id="appName" v-model="formPlatform.redirectUrl" />

          <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formPlatform.redirectUrl.required">L'url de
            redirection est requis</span>

          <span class="errors" :class="{ showspan: iserrors }" v-if="
            !$v.formPlatform.redirectUrl.minLength &&
            $v.formPlatform.redirectUrl.format
          ">l'url de redirection est invalide</span>

          <div class="loginServerContainer">
            <h5 class="title">Ajouter le(s) serveur(s) d'authentification</h5>

            <div v-for="(item, index) in servers" :key="item.id" class="serverItem">
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
            <div class="btn-retour" @click="cancelAdd()">RETOUR</div>
            <button type="submit" class="btn-creer">
              MODIFIER LA PLATEFORME
            </button>
          </div>
        </form>
      </BachupInformation>
    </v-main>
  </v-app>
</template>

<script>
import BachupInformation from "../Components/BackupInformation.vue";
import InputUser from "../Components/InputUser";
import { required, minLength } from "vuelidate/lib/validators";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "App",
  components: {
    BachupInformation,
    InputUser,
  },
  data() {
    return {
      formPlatform: {
        name: null,
        url: null,
        redirectUrl: null,
        loginServerIds: []
      },
      iserrors: true,
      error_platform: false,
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
          const regex =
            /https?:\/\/(?:w{1,3}\.)?[^\s.]+(?:\.[a-z]+)*(?::\d+)?(?![^<]*(?:<\/\w+>|\/?>))/gm;
          return regex.test(value);
        },
      },
      url: {
        required,
        format: (value) => {
          const regex =
            /https?:\/\/(?:w{1,3}\.)?[^\s.]+(?:\.[a-z]+)*(?::\d+)?(?![^<]*(?:<\/\w+>|\/?>))/gm;
          return regex.test(value);
        },
      },
    },
  },
  methods: {
    cancelAdd() {
      this.$router.push("/Platforms");
    },

    async getPlatform() {

      const id = this.$route.query.id
      const tem_plat = await this.$store.dispatch("platforms/getPlatformInfo", id);

      this.formPlatform.name = tem_plat.name;
      this.formPlatform.url = tem_plat.url;
      this.formPlatform.redirectUrl = tem_plat.redirectUrl;
      this.formPlatform.loginServerIds = await this.getServersIds(id);
    },

    ...mapActions({ editPlatformItem: "platforms/editPlatformItem", getAllServers: "serverLogin/getAllServers" }),
    async getServersIds(id) {
      const data = await this.$store.dispatch("platforms/getServerList", id);
      return data.map(el => el.id);
    },
    async validateApp() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.editPlatformItem({
          platform: this.formPlatform,
          platformId: this.$route.query.id,
        }).then((result) => {
          console.log(result);
          this.$router.push({
            name: "DetailPlatform",
            query: { id: this.$route.query.id },
          });
        });
      } else {
        this.iserrors = false;
      }
    },

    isLinked(item) {
      return this.formPlatform.loginServerIds.indexOf(item.id) !== -1;
    },

    linkItem(item) {
      this.formPlatform.loginServerIds = [...this.formPlatform.loginServerIds, item.id];
    },

    unlinkItem(item) {
      this.formPlatform.loginServerIds = this.formPlatform.loginServerIds.filter(el => el !== item.id);
    }
  },
  computed: {
    ...mapGetters({ servers: "serverLogin/servers" }),
  },
  async created() {
    await this.getPlatform();
    await this.getAllServers();
  },
};
</script>

<style scoped>
.v-application {
  background-color: #d6e2e600;
}

.formulaire {
  padding-left: 25%;
  padding-right: 25%;
  padding-bottom: 20px;
}

.btn-retour {
  border: 1px solid #14202c;
  border-radius: 6px;
  width: 120px;
  height: 40px;
  margin-right: 5px;
  margin-top: 20px;
  font: normal normal normal 11px/13px Charlevoix Pro;
  letter-spacing: 1.1px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.btn-creer {
  border: 0px;
  padding-left: 30px;
  padding-right: 30px;
  background: #14202c;
  border-radius: 6px;
  color: white;
  margin-left: 5px;
  margin-top: 20px;
  font: normal normal normal 11px/13px Charlevoix Pro;
  letter-spacing: 1.1px;
}

.errors {
  position: absolute;
  color: rgb(255, 0, 0);
  font: normal normal normal 11px/13px Charlevoix Pro;
}

.showspan {
  display: none;
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