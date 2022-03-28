<template>
  <div>
    <div class="section bg-gray-200 border-b-4 border-black px-0 lg:px-1">
      <div class=" ">
        <Navbar v-bind:web3Plug="web3Plug" v-bind:accessPlug="accessPlug" />
      </div>
    </div>

    <div class="section border-b-2 border-black" style="background: #222">
      <div class=" ">
        <div class=" "></div>
        <div class="flex md:flex-row flex-col">
          <div class="md:w-1/2 w-full mt-8 py-8 px-8 text-center">
            
          

            <a :href="getRouteTo('docs')" class="text-white text-lg">
              Read the docs
            </a>
          </div>
          <div class="md:w-1/2 w-full text-center overflow-hidden">
            <svg
              version="0.1"
              xmlns="http://www.w3.org/2000/svg"
              id="loader"
              width="400"
              height="400"
              class="inline-block relative"
            >
              <defs>
                <filter id="goo">
                  <feGaussianBlur
                    in="SourceGraphic"
                    result="blur"
                    stdDeviation="10"
                  />
                  <feColorMatrix
                    in="blur"
                    mode="matrix"
                    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                    result="goo"
                  />
                  <feBlend in2="goo" in="SourceGraphic" result="mix" />
                </filter>
                <linearGradient id="MyGradient">
                  <stop offset="0%" stop-color="#f00" />
                  <stop offset="33%" stop-color="#ff0" />
                  <stop offset="67%" stop-color="#0f0" />
                  <stop offset="100%" stop-color="#00f" />
                </linearGradient>
              </defs>
              <mask id="maska">
                <g class="blobs">
                  <circle
                    class="blob"
                    cx="110"
                    cy="125"
                    r="30"
                    transform="rotate(0) translate(0, 0) rotate(0)"
                  />
                  <circle
                    class="blob"
                    cx="250"
                    cy="160"
                    r="70"
                    transform="rotate(0) translate(0, 0) rotate(0)"
                  />
                  <circle
                    class="blob"
                    cx="250"
                    cy="275"
                    r="40"
                    transform="rotate(0) translate(0, 0) rotate(0)"
                  />
                  <circle
                    class="blob"
                    cx="150"
                    cy="250"
                    r="80"
                    transform="rotate(0) translate(0, 0) rotate(0)"
                  />
                  <circle
                    class="blob"
                    cx="300"
                    cy="100"
                    r="20"
                    transform="rotate(0) translate(0, 0) rotate(0)"
                  />
                  <!-- <circle
                    class="blob"
                    cx="200"
                    cy="200"
                    r="30"
                    transform="rotate(0) translate(0, 0) rotate(0)"
                  />
                  <circle
                    class="blob"
                    cx="200"
                    cy="200"
                    r="70"
                    transform="rotate(0) translate(0, 0) rotate(0)"
                  />
                  <circle
                    class="blob"
                    cx="200"
                    cy="200"
                    r="40"
                    transform="rotate(0) translate(0, 0) rotate(0)"
                  />
                  <circle
                    class="blob"
                    cx="200"
                    cy="200"
                    r="80"
                    transform="rotate(0) translate(0, 0) rotate(0)"
                  />
                  <circle
                    class="blob"
                    cx="200"
                    cy="200"
                    r="20"
                    transform="rotate(0) translate(0, 0) rotate(0)"
                  /> -->
                </g>
              </mask>
              <rect
                x="0"
                y="0"
                mask="url(#maska)"
                fill="url(#MyGradient)"
                width="400"
                height="400"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div class="section bg-white border-b-2 border-black">
      <div class="w-container"></div>
    </div>

    <Footer />
  </div>
</template>


<script>
import Web3Plug from "../js/web3-plug.js";
import AccessPlug from "../js/access-plug.js";
import { gsap } from "gsap";

// import FrontPageMedia from "./components/FrontPageMedia.vue";
import AnimatedTextArea from "./components/AnimatedTextArea.vue";

import Navbar from "./components/Navbar.vue";

import Footer from "./components/Footer.vue";
import TabsBar from "./components/TabsBar.vue";

import StarflaskAPIHelper from "../js/starflask-api-helper.js";
import FrontendHelper from "../js/frontend-helper.js";

export default {
  name: "Home",
  props: [],
  components: { Navbar, Footer, TabsBar, AnimatedTextArea },
  data() {
    return {
      web3Plug: new Web3Plug(),
      accessPlug: new AccessPlug(),
      activePanelId: null,
      frontpageSampleCode: `Your source for curated NFT and DeFi chaindata
      `,
    };
  },

  created() {
    this.web3Plug.getPlugEventEmitter().on(
      "stateChanged",
      function (connectionState) {
        console.log("stateChanged", connectionState);

        this.activeAccountAddress = connectionState.activeAccountAddress;
        this.activeNetworkId = connectionState.activeNetworkId;
      }.bind(this)
    );
    this.web3Plug.getPlugEventEmitter().on(
      "error",
      function (errormessage) {
        console.error("error", errormessage);

        this.web3error = errormessage;
      }.bind(this)
    );

    this.web3Plug.reconnectWeb();
  },
  mounted: function () {
    this.accessPlug.reconnect();
    this.initBlobs();
  },
  methods: {
    setActivePanel(panelId) {
      if (panelId == this.activePanelId) {
        this.activePanelId = null;
        return;
      }
      this.activePanelId = panelId;
    },
    onTabSelect(tabname) {
      console.log(tabname);

      this.selectedTab = tabname.toLowerCase();
    },

    getRouteTo(dest) {
      return FrontendHelper.getRouteTo(dest);
    },

    initBlobs() {
      // function randomBetween(min, max) {
      //   return Math.floor(Math.random() * (max - min + 1) + min);
      // }
      var tl = gsap.timeline();
      var blobs = document.querySelectorAll(".blob");
      for (var i = 0; i < blobs.length; i++) {
        var t = gsap.to(blobs[i], {
          duration: 8,
          transformOrigin: "40% 30%",
          rotation: 360,
          repeat: -1,
          ease: "none",
          // duration: randomBetween(14, 50),
          // delay: randomBetween(1, 3),
          // x: randomBetween(-100, 100),
          // y: randomBetween(-100, 100),
          // repeatDelay: randomBetween(1, 3),
          // yoyo: true,
          // ease: "power2.inOut",
        });
        tl.add(t, (i + 1) / 0.6);
      }
      tl.seek(100);
      // tl.timeScale(4);
    },
  },
};
</script>
