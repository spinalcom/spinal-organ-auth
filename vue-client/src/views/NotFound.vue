<template>
    <div class="notFoundPage">
        <v-card class="notFoundCard" outlined elevation="4">
            <div class="code">404</div>
            <h1>Page introuvable</h1>
            <p>La page demandee n'existe pas ou a ete deplacee.</p>
        </v-card>
    </div>
</template>

<script>
export default {
    name: "NotFound",
    methods: {
        goHome() {
            this.$router.push("/");
        },
    },
};
</script>

<style scoped>
.notFoundPage {
    min-height: calc(100vh - 90px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.notFoundCard {
    width: 100%;
    max-width: 540px;
    text-align: center;
    padding: 36px 24px;
}

.code {
    font-size: 72px;
    font-weight: 700;
    line-height: 1;
    margin-bottom: 8px;
}

.actions {
    margin-top: 20px;
}
</style>
