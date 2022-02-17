<template>
  <div>
    <canvas :id="this.title"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js/auto";

export default {
  name: "ChartComponent",
  props: ["title", "dailyRequests"],
  // data() {
  //   return {
  //   };
  // },
  mounted() {
    const ctx = document.getElementById(this.title);
    new Chart(ctx, {
      type: "line",
      data: {
        labels: [
          this.dailyRequests[0].date,
          this.dailyRequests[1].date,
          this.dailyRequests[2].date,
          this.dailyRequests[3].date,
          this.dailyRequests[4].date,
          this.dailyRequests[5].date,
          this.dailyRequests[6].date,
        ],
        datasets: [
          {
            label: "Daily Requests",
            data: [
              this.dailyRequests[0].Requests,
              this.dailyRequests[1].Requests,
              this.dailyRequests[2].Requests,
              this.dailyRequests[3].Requests,
              this.dailyRequests[4].Requests,
              this.dailyRequests[5].Requests,
              this.dailyRequests[6].Requests,
            ],
            // backgroundColor: "rgba(0,0,0,.25)",
            // fill: true,
            // borderColor: "#36495d",
            // borderWidth: 3,
          },
        ],
      },
      options: {
        datasets: {
          line: {
            backgroundColor: "rgba(0,0,0,.25)",
            fill: true,
            borderColor: "#36495d",
            borderWidth: 3,
          },
        },
        responsive: true,
        lineTension: 0.15,
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            ticks: {
              padding: 5,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: "Daily Requests",
            align: "start",
            font: {
              size: 18,
              weight: "normal",
            },
            padding: {
              top: 10,
              bottom: 20,
            },
          },
        },
      },
    });
  },
};
</script>

