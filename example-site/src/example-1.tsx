import React from "react";
import { Font, CanvasTerminal } from "cacti-term";

export default class Example1 extends React.Component {
  componentDidMount() {
    CanvasTerminal.CanvasTerminal(10, 10, new Font("Courier", 13, 10, 15, 1, 11));
  }
  render() {
    return <div></div>;
  }
}
