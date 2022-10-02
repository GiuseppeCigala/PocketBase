const address = "http://127.0.0.1:8090";
const collection = "soggetti";
const client = new PocketBase(address);

function tableData() {
  return {
    search: "",
    showModal: false,
    editModal: false,
    soggetti: [],
    id: "",
    generalita: "",
    area: "",
    note: "",
    foto: "",
    imageFile: "",
   
    async fetchTableRows() {
      this.soggetti = await client.records.getFullList(collection, 200, {
        sort: "-created",
      });
    },

    async deleteRow(id) {
      await client.records.delete(collection, id);
      this.fetchTableRows();
    },

    async loadRow(id) {
      const soggetto = await client.records.getOne(collection, id);
      this.id = id;
      this.generalita = soggetto.generalita;
      this.area = soggetto.area;
      this.note = soggetto.note;
      this.foto =
        "api/files/" +
        collection +
        "/" +
        id +
        "/" +
        soggetto.foto +
        "?thumb=100x100";
      this.imageFile = soggetto.foto;
      this.$refs.inputFile.value = "";
    },

    get filteredSoggetti() {
      if (this.search === "") {
        return this.soggetti;
      }
      return this.soggetti.filter((soggetto) => {
        return (soggetto.generalita + soggetto.area + soggetto.note)
          .toLowerCase()
          .includes(this.search.toLowerCase());
      });
    },

    resetForm() {
      this.$refs.form.reset();
      this.foto = "";
    },

    fileChosen() {
      this.imageFile = this.$refs.inputFile.files[0];

      let reader = new FileReader();

      if (this.imageFile) {
        reader.readAsDataURL(this.imageFile);
      }

      reader.onload = () => {
        this.foto = reader.result;
      };
    },

    async submitData() {
      const formData = new FormData();

      formData.append("generalita", this.generalita);
      formData.append("area", this.area);
      formData.append("note", this.note);
      formData.append("foto", this.imageFile);

      if (this.editModal) {
        await client.records.update(collection, this.id, formData);
      } else {
        await client.records.create(collection, formData);
      }
      this.fetchTableRows();
    },
  };
}
