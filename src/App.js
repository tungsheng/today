import React, { Component } from "react";
import sum from "./sum.js";
import "./App.css";

class App extends Component {
  state = {
    time: 0,
    sortAscend: true,
    sortKey: "SiteName",
    table: "",
    apiData: []
  };

  timer = null;

  componentDidMount() {
    this.fetchData();
    this.startApi();
  }

  componentWillUnmount() {
    this.stopApi();
  }

  startApi = () => {
    this.apiTimer = setInterval(this.fetchData, 10000);
  };

  stopApi = () => {
    clearInterval(this.apiTimer);
  };

  updateSorting = () => {
    this.setState({ sortAscend: !this.state.sortAscend }, () => {
      this.sortData(this.state.apiData).then(this.displayData);
    });
  };

  startTimer = () => {
    if (this.timer === null) {
      this.timer = setInterval(this.updateTime, 1000);
    }
  };

  stopTimer = () => {
    clearInterval(this.timer);
    this.timer = null;
  };

  resetTimer = () => {
    this.stopTimer();
    this.setState({ time: 0 });
  };

  updateTime = () => {
    this.setState({ time: this.state.time + 1 });
  };

  displayTime = time => {
    const s = time % 60;
    const spre = s < 10 ? "0" : "";
    const m = Math.floor(time / 60);
    const mpre = m < 10 ? "0" : "";
    const h = Math.floor(time / 3600);
    const hpre = h < 10 ? "0" : "";

    return `${hpre}${h}:${mpre}${m}:${spre}${s}`;
  };

  fetchData = () =>
    fetch("http://opendata2.epa.gov.tw/AQI.json")
      .then(data => data.json())
      .then(this.sortData)
      .then(this.displayData)
      .catch(err => {
        console.log("Error: ", err);
      });

  sortData = data => {
    this.setState({ apiData: data });
    return new Promise((resolve, reject) => {
      let sorted = data.sort((a, b) => {
        if (a[this.state.sortKey] < b[this.state.sortKey]) {
          return this.state.sortAscend ? -1 : 1;
        }
        if (a[this.state.sortKey] > b[this.state.sortKey]) {
          return this.state.sortAscend ? 1 : -1;
        }
        return 0;
      });
      resolve(sorted);
    });
  };

  displayData = data => {
    this.setState({
      table: (
        <table>
          <tbody>
            <tr>
              <td>SiteName</td>
              <td>Pollutant</td>
              <td>Status</td>
              <td>PM2.5_AVG</td>
            </tr>
            {data.map((rec, ind) => (
              <tr key={ind}>
                <td>{rec["SiteName"]}</td>
                <td>{rec["Pollutant"]}</td>
                <td>{rec["Status"]}</td>
                <td>{rec["PM2.5_AVG"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    });
  };

  render() {
    return (
      <div className="App">
        <h3>Timer</h3>
        <div>{this.displayTime(this.state.time)}</div>
        <div>
          <button type="button" onClick={this.startTimer}>
            Start
          </button>
          <button type="button" onClick={this.stopTimer}>
            Stop
          </button>
          <button type="button" onClick={this.resetTimer}>
            Reset
          </button>
        </div>

        <hr />

        <h3>sum</h3>
        <div>sum = {sum(100)}</div>

        <hr />

        <h3>AJAX</h3>
        <div>
          <button type="button" onClick={this.startApi}>
            Start
          </button>
          <button type="button" onClick={this.stopApi}>
            Stop
          </button>
          <button type="button" onClick={this.updateSorting}>
            Sort
          </button>
        </div>
        <div>{this.state.table}</div>
      </div>
    );
  }
}

export default App;
