import graphing from "vue-chartkick";
import charts from "chart.js";

export default function () {
    return graphing.use(charts);
}
