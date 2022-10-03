const address = "http://127.0.0.1:8090";
const collection = "subjects";
const client = new PocketBase(address);

function pageData() {
  return {
    search: "",
    sortCol: "",
    sortOrder: "",
    showModal: false,
    editModal: false,
    subjects: [],
    id: "",
    name: "",
    area: "",
    note: "",
    photo: "",
    imageFile: "",
    itemsPerPage: "",
    totalItems: "",
    totalPages: "",
    page: "",

    async fetchTableRows() {
      const records = await client.records.getList(
        collection,
        this.page,
        this.itemsPerPage,
        {
          sort: this.sortOrder + this.sortCol,
          filter:
            'name~"' +
            this.search +
            '" || area~"' +
            this.search +
            '" || note~"' +
            this.search +
            '"',
        }
      );

      this.subjects = records.items;
      this.totalItems = records.totalItems;
      this.totalPages = records.totalPages;
      this.page = records.page;
    },

    async deleteRow(id) {
      try {
        await client.records.delete(collection, id);
        this.fetchTableRows();
      } catch (error) {
        alert("Failed to delete record. Make sure first to delete the related attachments.");
      }
    },

    async loadRow(id) {
      const soggetto = await client.records.getOne(collection, id);
      this.id = id;
      this.name = soggetto.name;
      this.area = soggetto.area;
      this.note = soggetto.note;
      this.photo =
        "api/files/" +
        collection +
        "/" +
        id +
        "/" +
        soggetto.photo +
        "?thumb=100x100";
      this.imageFile = soggetto.photo;
      this.$refs.inputFile.value = "";
    },

    sortTableRows() {
      this.sortOrder = this.sortOrder == "-" ? "+" : "-";
      this.fetchTableRows();
    },

    resetForm() {
      this.$refs.form.reset();
      this.photo = "";
    },

    prevPage() {
      if (this.page > 1) {
        this.page--;
      } else {
        this.page;
      }
      this.fetchTableRows();
    },

    nextPage() {
      if (this.page < this.totalPages) {
        this.page++;
      } else {
        this.page;
      }
      this.fetchTableRows();
    },

    fileChosen() {
      this.imageFile = this.$refs.inputFile.files[0];

      let reader = new FileReader();

      if (this.imageFile) {
        reader.readAsDataURL(this.imageFile);
      }

      reader.onload = () => {
        this.photo = reader.result;
      };
    },

    async submitData() {
      const formData = new FormData();

      formData.append("name", this.name);
      formData.append("area", this.area);
      formData.append("note", this.note);
      formData.append("photo", this.imageFile);

      if (this.editModal) {
        await client.records.update(collection, this.id, formData);
      } else {
        await client.records.create(collection, formData);
      }
      this.fetchTableRows();
    },
  };
}
