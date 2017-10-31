import React from "react";
import Employee from "./Employee";

import {Carousel} from "react-responsive-carousel";
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import logo from './logo.png';

import Dropbox from "dropbox";
import dropboxConfig from "./dropbox.json"
const db = new Dropbox(dropboxConfig);

const getNameFromEntry = (entry) => entry.name.slice(0, entry.name.lastIndexOf("."))

export default class Viewer extends React.Component {

  constructor () {
    super();
    this.state = { photos: {} }
  }

  componentDidMount () {
    this._updatePhotos();
    this.interval = setInterval(this._updatePhotos, 15000);
  }

  componentWillUnmount () {
    clearInterval(this.interval);
  }

  _updatePhotos = () => {
    // list all files in dropbox folder
    db.filesListFolder({path: ""})
      // make more readable
      .then(({entries}) => entries.map((entry) => ({
        name: getNameFromEntry(entry),
        path: entry.path_lower,
      })))
      // filter only entries we haven't downloaded
      .then((entries) => entries.filter((entry) => this.state.photos[entry.name] == null))
      // batch download those entries
      .then((entries) => 
        entries.length === 0 ?
        { entries: [] } :
        db.filesGetThumbnailBatch({
          entries: entries.map(({path}) => ({path, size: {".tag": "w1024h768"}}))
        })
      )
      // update state so photos are displayed
      .then(({entries}) => entries.forEach((entry) => {
        this.setState({
          photos: {
            ...this.state.photos,
            [getNameFromEntry(entry.metadata)]: entry.thumbnail
          }
        });
      }))
      .catch((err) => console.error(err));
  };

  render () {
    const {photos} = this.state;
    return (
      <div>
        <div style={containerStyle}>
          <Carousel
            showArrows={false}
            showStatus={false}
            showIndicators={false}
            showThumbs={false}
            infiniteLoop
            autoPlay
            interval={3000}
          >
            {Object.keys(photos).map((name) => (
              <Employee key={name} name={name} photo={photos[name]} />
            ))}
          </Carousel>
        </div>
        <img style={watermarkStyle} src={logo} />
      </div>
    );
  }
}



const containerStyle = {
  position: "absolute",
  width: 384,
  top: 100,
  left: "50%",
  marginLeft: "-192px",
  textAlign: "center",
  borderRadius: 15,
  padding: 15,
  boxShadow: "2px 2px 5px 5px rgba(0, 0, 0, 0.3)",
  backgroundColor: "white",
};

const watermarkStyle = {
  position: 'fixed',
  width: 100,
  height: 100,
  bottom: 50,
  right: 50,
};