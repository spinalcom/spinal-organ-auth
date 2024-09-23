<template>
    <div>
        <div v-if="title.toLowerCase().includes(verif.toLowerCase())" class="cardmenu">
            <div @click="nextpage(link)" class="cardMenu-leftside">
                <div class="cardMenu-carre">
                    <v-icon class="mr-2" color="black">{{ icon }}</v-icon>
                </div>
            </div>
            <div @click="nextpage(link)" class="cardMenu-rightside">
                <span>{{ title }}</span>
                <span class="cardMenu-subtitle">{{ subtitle }}</span>
            </div>
            <button class="addFavoritesMenu" type="button">+</button>
        </div>
    </div>
</template>

<script>
export default {
    name: "card-menu",
    props: ['title', 'subtitle', 'link', 'verif', 'icon'],
    data() {
        return {
        }
    },
    methods: {
        nextpage(lien) {
            this.$router.push(lien);
        }
    }
};
</script>

<style>
.cardmenu {
    max-width: 410px;
    min-width: 250px;
    width: 320px;
    height: 115px;
    background: white;
    background: #FFFFFF 0% 0% no-repeat padding-box;
    box-shadow: 0px 3px 10px #2E3F4A29;
    border: 1px solid #F7F8F8;
    border-radius: 6px;
    display: flex;
    margin: 5px;
    margin-bottom: 15px;
    cursor: pointer;
    position: relative;
}

.cardMenu-leftside {
    position: relative;
    background-color: #F7F8F8;
    width: 10%;
    min-width: 40px;
    padding: 6px;
    transition: 0.2s;
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
    left: -1px;
    height: 102%;
    top: -1%;
}

.cardmenu:hover .cardMenu-leftside {
    background-color: #9bccc54b;
}

.cardMenu-rightside {
    padding-top: 12px;
    padding-left: 10px;
    display: flex;
    flex-direction: column;
    text-align: left;
    letter-spacing: 0.26px;
    font-family: Arial, Helvetica, sans-serif;
    color: #14202C;
    width: 100%;
    font-weight: 1000;
    font-size: 15px;
}

.cardMenu-subtitle {
    text-align: left;
    letter-spacing: 1px;
    color: #14202C;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 100;
    font-size: 10px;
    margin-top: 1px;
}

.cardMenu-carre {

    width: 28px;
    height: 28px;
    background: #FFFFFF 0% 0% no-repeat padding-box;
    box-shadow: 0px 3px 6px #0000000D;
    border-radius: 3px;
    opacity: 1;
    display: flex;
    padding-left: 2px;
    /* justify-content: center; */
    /* align-items: center; */
}

.addFavoritesMenu {
    border: 1px solid #DCE3E8;
    border-radius: 5px;
    color: #DCE3E8;
    width: 22px;
    height: 22px;
    margin: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.3s;
    position: absolute;
    bottom: 0px;
    right: 0px;

}

.addFavoritesMenu:hover {
    background-color: #DCE3E8;
    color: black;
    border: 1px solid black;
}
</style>