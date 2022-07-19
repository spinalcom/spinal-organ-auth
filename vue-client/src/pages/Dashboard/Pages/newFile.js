import { validationMixin } from "vuelidate";

export default (await import('vue')).default.extend({
  mixins: [validationMixin],
  components: {},
  name: "Logs",
  data: () => ({
    token: "",
    value: null
  }),

  computed: {},
  methods: {},
  mounted() {
    this.token = localStorage.getItem("token");
  },
  watch: {
    /**
    * Searches through the table data by a given query.
    * NOTE: If you have a lot of data, it's recommended to do the search on the Server Side and only display the results here.
    * @param value of the query
    */
  }
});
