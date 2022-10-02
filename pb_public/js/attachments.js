const address = "http://127.0.0.1:8090";
const collection = "attachments";
const client = new PocketBase(address);

function tableData() {
  return {
    search: "",
    sortCol: "",
    sortOrder: "",
    showModal: false,
    editModal: false,
    attachments: [],
    subject_id: localStorage.getItem('subject_id'),
    id: "",
    file: "",
    description: "",
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
          'subject_id~"' + this.subject_id + '" && (file~"' + this.search + '" || description~"' + this.search + '")',
        }
      );

      this.attachments = records.items;
      this.totalItems = records.totalItems;
      this.totalPages = records.totalPages;
      this.page = records.page;
    },

    async deleteRow(id) {
      await client.records.delete(collection, id);
      this.fetchTableRows();
    },

    async loadRow(id) {
      const attachment = await client.records.getOne(collection, id);
      this.id = id;
      this.file =
        "api/files/" +
        collection +
        "/" +
        id +
        "/" +
        attachment.file +
        "?thumb=100x100";
      this.description = attachment.description;
      this.imageFile = attachment.file;
      this.$refs.inputFile.value = "";
    },

    sortTableRows() {
      this.sortOrder = this.sortOrder == "-" ? "+" : "-";
      this.fetchTableRows();
    },

    resetForm() {
      this.$refs.form.reset();
      this.file = "";
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
        this.file = reader.result;
      };
    },

    async submitData() {
      const formData = new FormData();

      formData.append("file", this.imageFile);
      formData.append("description", this.description);
      formData.append("subject_id", this.subject_id);

      if (this.editModal) {
        await client.records.update(collection, this.id, formData);
      } else {
        await client.records.create(collection, formData);
      }
      this.fetchTableRows();
    },
  };
}
