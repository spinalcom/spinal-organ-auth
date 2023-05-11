<template>
    <v-app class="app">
        <v-card class="pops" elevation="2">
            <div class="popup-closebtn">
                <span>X</span>
            </div>
            <p class="mb-12">CONNEXION</p>
            <InputUser v-model="formUser.userName" class="mb-12 mt-6" title="NOM D'UTILISATEUR" :value="''"></InputUser>
            <!-- <InputUser v-model="formUser.password" class="mb-12 mt-6" title="MOT DE PASSE" :value="''"></InputUser> -->
            <InputPass title="MOT DE PASSE" id="clientSecret" v-model="formUser.password" />
            <div @click="login()" class="mt-4 ml-1 popup-btn-fermer">
                <span>VALIDER</span>
            </div>
        </v-card>
    </v-app>
</template>

<script>
import InputUser from "../Components/InputUser.vue";
import InputPass from "../Components/InputPassword";
import { mapActions } from 'vuex';
export default {
    name: "App",
    components: {
        InputUser,
        InputPass
    },
    data() {
        return {
            formUser: {
                userName: "authAdmin",
                password: "123456789",
            },
        };
    },

    methods: {

        login(){
            this.$store.dispatch('login/login', this.formUser);
        },

        ...mapActions({
            getUsers: 'login/getUsers'
        })
    },
   
}

</script>
  
<style scoped>
.app {
    font: normal normal normal 10px/12px Charlevoix Pro;
    letter-spacing: 1px;
    background: #881e1e00;

}

.popup-closebtn {
    top: 7px;
    right: 7px;
    width: 40px;
    height: 40px;
    border: 2px solid #E9ECEE;
    opacity: 1;
    position: absolute;
    border-radius: 6px !important;
    justify-content: center;
    display: flex;
    align-items: center;
    font-size: 15px;
    font-family: Arial, Helvetica, sans-serif;
    cursor: pointer;
}

.popup-btn-fermer {

    position: absolute;
    right: 20px;
    bottom: 20px;
    width: 145px;
    height: 40px;


    background-color: #14202C;
    border-radius: 6px !important;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}

.pops {
    min-width: 400px;
    width: 30%;
    left: 50%;
    position: relative;
    transform: translate(-50%,-80%);
    height: 40vh;
    top: 50%;
    padding: 30px;
    border-radius: 6px;
}

.popup {
    position: relative;
    width: 415px;
    height: 269px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    transform: translate(-50%, -100%);
    left: 50%;
    top: 50%;
    border-radius: 10px;
    font-family: Arial, Helvetica, sans-serif;
}

</style>
  