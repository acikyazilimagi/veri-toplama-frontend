import React, { Component } from "react";

class ReasonSelector extends Component {
  render() {
    return (
      <div className={"mt-4 mx-auto max-w-2xl text-left"}>
        {this.props.reasons.map(r => {
          return <span className={"mr-2"}>
              <input className={"reasonList"} type="checkbox" value={r} /> {r}
            </span>
        })}
      </div>
    );
  }
}

export default ReasonSelector;
