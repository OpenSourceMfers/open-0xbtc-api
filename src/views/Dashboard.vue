<template>
  <div>
    <div class="section bg-gray-200 border-b-2 border-black px-0 lg:px-1">
      <Navbar v-bind:web3Plug="web3Plug" v-bind:accessPlug="accessPlug" />
    </div>
    <div class="container mx-auto flex flex-col">
      <div class="relative w-full mx-auto bg-transparent my-24">
        <p class="text-white text-xl inline-block leading-loose mb-0">
          Personal Apps
        </p>
        <NewAppModal class="absolute top-0 right-0" />
        <!-- <a
          class="absolute top-0 right-0 border-2 border-blue-800 rounded py-1 px-3 cursor-pointer no-underline text-white"
          href="/apps/createapp"
        >
          Create App
        </a> -->
        <table
          class="table-fixed text-center border-collapse border border-blue-800 text-white mt-4"
        >
          <thead>
            <tr class="border border-blue-800 bg-black bg-opacity-50">
              <th class="w-1/4">App</th>
              <th class="w-1/6">Environment</th>
              <th class="w-1/6">Network</th>
              <th>Median Response (5min)</th>
              <th>Request (24h)</th>
              <th>Rate Limited (24h)</th>
              <th>Days on Starflask</th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="border border-blue-800 bg-black bg-opacity-25"
              v-for="row in dashConfig.apps"
              :key="row.Title"
            >
              <td>
                <a
                  class="no-underline hover:underline text-white"
                  :href="row.URL"
                  >{{ row.Title }}</a
                >
              </td>
              <td>{{ row.Environment }}</td>
              <td>{{ row.Network }}</td>
              <td>{{ row.MedianResponse }}</td>
              <td>{{ row.Request }}</td>
              <td>{{ row.RateLimited }}</td>
              <td>{{ row.DaysonStarflask }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="w-full bg-white py-12">
      <div
        class="container w-3/4 mx-auto mt-8"
        v-for="row in dashConfig.apps"
        :key="row.Title"
      >
        <div class="border border-gray-400 rounded w-full">
          <div
            class="flex bg-black bg-opacity-75 text-white px-3 py-2 leading-8"
          >
            <p class="inline-block text-2xl">{{ row.Title }}</p>
            <p class="inline-block ml-auto">
              {{ row.Environment }}
            </p>
            <p class="inline-block ml-6">{{ row.Network }}</p>
          </div>
          <div class="grid grid-cols-4 gap-6 p-6">
            <div class="flex flex-col border border-gray-400 rounded py-2 px-4">
              <p class="mb-auto">Median Response (5min)</p>
              <p class="text-4xl mb-0">{{ row.MedianResponse }}ms</p>
            </div>
            <div class="flex flex-col border border-gray-400 rounded py-2 px-4">
              <p class="mb-auto">Total Requests (24h)</p>
              <p class="text-4xl mb-0">{{ row.Request }}</p>
            </div>
            <div class="flex flex-col border border-gray-400 rounded py-2 px-4">
              <p class="mb-auto">Rate Limited % (24h)</p>
              <p class="text-4xl mb-0">{{ row.RateLimited }}%</p>
            </div>
            <div class="flex flex-col border border-gray-400 rounded py-2 px-4">
              <p class="mb-auto">Invalid Requests (24h)</p>
              <p class="text-4xl mb-0">{{ row.InvalidRequests }}</p>
            </div>
            <div
              class="flex flex-col col-span-4 border border-gray-400 rounded py-2 px-4"
            >
              <ChartComponent
                v-bind:title="row.Title"
                v-bind:dailyRequests="row.DailyRequests"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="section border-b-2 border-black text-white"
      style="background: #222"
    >
      <div class="py-16 w-container">
        <div class="w-column">
          <div class="text-lg font-bold">Applications</div>

          <div class=" " v-if="!connectedToWeb3">
            <NotConnectedToWeb3 />
          </div>

          <div class=" " v-if="connectedToWeb3">
            <div v-if="selectedTab == 'bids'" class="mb-4"></div>
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>


<script>
import NotConnectedToWeb3 from "./components/NotConnectedToWeb3.vue";
import Web3Plug from "../js/web3-plug.js";
import AccessPlug from "../js/access-plug.js";
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
import TabsBar from "./components/TabsBar.vue";
import GenericTable from "./components/GenericTable.vue";
import FrontendHelper from "../js/frontend-helper";
import Config from "./config/DashboardAPIMock";
import ChartComponent from "./components/ChartComponent.vue";
import NewAppModal from "./components/NewAppModal.vue";

export default {
  name: "Dashboard",
  props: [],
  components: {
    Navbar,
    Footer,
    TabsBar,
    GenericTable,
    NotConnectedToWeb3,
    ChartComponent,
    NewAppModal,
  },
  data() {
    return {
      web3Plug: new Web3Plug(),
      dashcessPlug: new AccessPlug(),
      existingApplicationsList: [],
      connectedToWeb3: false,
      dashConfig: null,
    };
  },

  created() {
    this.dashConfig = Config;
    this.web3Plug.getPlugEventEmitter().on(
      "stateChanged",
      async function (connectionState) {
        console.log("stateChanged", connectionState);

        this.activeAccountAddress = connectionState.activeAccountAddress;
        this.activeNetworkId = connectionState.activeNetworkId;
        this.connectedToWeb3 = this.web3Plug.connectedToWeb3();
        this.currentBlockNumber = await this.web3Plug.getBlockNumber();
      }.bind(this)
    );
    this.web3Plug.getPlugEventEmitter().on(
      "error",
      function (errormessage) {
        console.error("error", errormessage);

        this.web3error = errormessage;
      }.bind(this)
    );

    this.accessPlug.getPlugEventEmitter().on(
      "stateChanged",
      async function (connectionState) {
        console.log("access Changed", connectionState);

        this.fetchMyApplications();
      }.bind(this)
    );

    this.web3Plug.reconnectWeb();
  },
  mounted: function () {
    this.accessPlug.reconnect();
    //  this.fetchMyApplications()
  },
  methods: {
    async fetchMyApplications() {
      let accessToken = this.accessPlug.getAccessToken();

      let response = await FrontendHelper.handleAPIRequest(
        "/list_my_applications",
        { accessToken: accessToken }
      );

      this.existingApplicationsList = response.list;
    },
  },
};
</script>
