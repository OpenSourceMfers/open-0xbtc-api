<template>
  <div>
    <button
      class="bg-blue-500 text-white active:bg-blue-600 px-3 py-1 rounded outline-none focus:outline-none ease-linear transition-all duration-150"
      type="button"
      v-on:click="toggleModal()"
    >
      Create App
    </button>
    <div
      v-if="showModal"
      class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex"
    >
      <div class="relative w-3/4 my-6 mx-auto max-w-3xl">
        <!--content-->
        <div
          class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none"
        >
          <!--header-->
          <div
            class="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t"
          >
            <h3 class="text-3xl">Create App</h3>
            <button
              class="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
              v-on:click="toggleModal()"
            >
              <span
                class="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none"
              >
                ×
              </span>
            </button>
          </div>
          <!--body-->
          <form id="app" @submit.prevent="submit">
            <div class="p-10 bg-white">
              <div
                class="form-group"
                :class="{ 'form-group--error': $v.app.name.$error }"
              >
                <label
                  class="block mb-3 text-gray-600 form__label"
                  for="appName"
                  >App Name</label
                >
                <input
                  id="appName"
                  v-model="$v.app.name.$model"
                  type="text"
                  class="border border-gray-500 rounded-md inline-block py-2 px-3 w-full text-gray-600 tracking-wider form__input"
                  placeholder="E.g., Frontend Production"
                />
              </div>
              <div class="error" v-if="!$v.app.name.required">
                Field is required
              </div>
              <div class="error" v-if="!$v.app.name.minLength">
                Name must have at least
                {{ $v.app.name.$params.minLength.min }} letters.
              </div>
              <tree-view
                :data="$v.app.name"
                :options="{ rootObjectKey: '$v.app.name', maxDepth: 2 }"
              ></tree-view>
              <div
                class="form-group mt-6"
                :class="{ 'form-group--error': $v.app.description.$error }"
              >
                <label
                  class="block mb-3 text-gray-600 form__label"
                  for="description"
                  >Description</label
                >
                <input
                  id="description"
                  v-model="$v.app.description.$model"
                  type="text"
                  class="border border-gray-500 rounded-md inline-block py-2 px-3 w-full text-gray-600 tracking-wider form__input"
                  placeholder="E.g., Our user facing website"
                ></input>
              </div>
              <div class="error" v-if="!$v.app.description.required">
                Field is required
              </div>
              <tree-view
                :data="$v.app.description"
                :options="{ rootObjectKey: '$v.app.description', maxDepth: 2 }"
              ></tree-view>
              <div class="mt-6">
                <div class="flex flex-row space-x-10">
                  <div class="flex-col flex-1">
                    <label class="block mb-3 text-gray-600" for="environment"
                      >Environment</label
                    >
                    <select
                      id="environment"
                      v-model="app.environment"
                      class="border border-gray-500 bg-white rounded-md inline-block py-2 px-3 w-full text-gray-600 tracking-widest"
                    >
                      <option>Development</option>
                      <option>Staging</option>
                      <option>Production</option>
                    </select>
                  </div>
                  <div class="flex-col flex-1">
                    <label class="block mb-3 text-gray-600" for="network"
                      >Network</label
                    >
                    <select
                      id="network"
                      v-model="app.network"
                      class="border border-gray-500 bg-white rounded-md inline-block py-2 px-3 w-full text-gray-600 tracking-widest"
                    >
                      <option>Mainnet</option>
                      <option>Kovan</option>
                      <option>Rinkeby</option>
                      <option>Ropsten</option>
                      <option>Goerli</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <!--footer-->
            <div
              class="flex items-center justify-start p-6 border-t border-solid border-blueGray-200 rounded-b"
            >
              <div class="mr-auto">
                <p class="typo__p" v-if="submitStatus === 'OK'">
                  Thanks for your submission!
                </p>
                <p class="typo__p" v-if="submitStatus === 'ERROR'">
                  Please fill the form correctly.
                </p>
                <p class="typo__p" v-if="submitStatus === 'PENDING'">
                  Sending...
                </p>
              </div>
              <button
                class="text-red-500 bg-transparent border border-solid border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                v-on:click="toggleModal()"
              >
                Close
              </button>
              <button
                class="text-green-500 bg-transparent border border-solid border-green-500 hover:bg-green-500 hover:text-white font-bold uppercase px-6 py-3 text-sm rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="submit"
                :disabled="submitStatus === 'PENDING'"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div v-if="showModal" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
  </div>
</template>

<script>
import { required, minLength } from "vuelidate/lib/validators";
// import axios from "axios";

export default {
  name: "NewAppModal",
  data() {
    return {
      showModal: false,
      submitStatus: null,
      app: {
        name: "",
        description: "",
        environment: "Development",
        network: "Mainnet",
      },
    };
  },
  validations: {
    app: {
      name: {
        required,
        minLength: minLength(4),
      },
      description: {
        required,
      },
    },
  },
  methods: {
    toggleModal: function () {
      this.showModal = !this.showModal;
    },
    async submit() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.submitStatus = "ERROR";
      } else {
        this.submitStatus = "PENDING";
        // await axios.post()
        setTimeout(() => {
          this.app = {
            name: "",
            description: "",
            environment: "Development",
            network: "Mainnet",
          };
          this.submitStatus = "OK";
        }, 500);
        // this.toggleModal();
      }
    },
  },
};
</script>