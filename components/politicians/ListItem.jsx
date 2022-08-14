import React, { Component } from "react";
import VisibilitySensor from "react-visibility-sensor";
import styles from "../../styles/Politicians.module.css";
import Image from "next/image";

class ListItem extends Component {
  state = {
    visibility: false,
  };

  render() {
    return (
      <VisibilitySensor
        partialVisibility={true}
        containment={this.state.getElement ? this.state.getElement : null}
        key={`${this.props.politician.name.official_full}-${this.props.type}`}
        onChange={(isVisible) => {
          this.setState({ visibility: isVisible });
        }}
      >
        {this.state.visibility && (
          <li
            className={styles.li}
            style={{
              visibility: this.state.visibility ? "visible" : "hidden",
            }}
            key={`${this.props.politician.id.bioguide}-${this.props.type}`}
          >
            <a href={`/politicians/${this.props.politician.id.bioguide}`}>
              <Image
                src={`https://theunitedstates.io/images/congress/original/${this.props.politician.id.bioguide}.jpg`}
                alt={this.props.politician.name.official_full}
                objectFit="cover"
                height={300}
                width={300}
              />
              <div>
                <h2>{this.props.politician.name.official_full}</h2>
                <p>
                  {"Element is " +
                    (this.state.visibility ? "visible" : "invisible")}
                </p>
              </div>
            </a>
          </li>
        )}
      </VisibilitySensor>
    );
  }

  componentDidMount = () => {
    this.setState({
      getElement: document.getElementById(`list-${this.props.type}`),
    });
  };
}

export default ListItem;
