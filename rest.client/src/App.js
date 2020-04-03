import React, { Component }  from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
      super(props);
      this.state = { places : []} ;
  }
  componentDidMount() {
    const _self = this;
   fetch('http://localhost:8081/api/places', {
      method: 'GET',
      headers: {
        'my-header-custom': 'i love places'
      }
    }).then(function(response){
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          var error = new Error(response.statusText)
          error.response = response;
          throw error;
        }
    }).then(function(data){
      _self.setState({ places: data.places });
     }).catch(function(error){
        console.log(error);
    });
  }
  render() {
    const listItems = this.state.places.map((place) =>
        <tr key={place.id.toString()}>
          <td>{place.id}</td>
          <td>{place.name}</td>
          <td>{place.author}</td>
          <td>{place.review}</td>
          <td>{place.image? (<img src={place.image.url}/>): 'No image' }</td>
        </tr>
      );

    const tableHead = (<tr>
      <td>id</td>
      <th>Name</th>
      <th>Author</th>
      <th>Review</th>
      <th>Image</th>
      </tr>);
    const placeItems = this.state.places.length <= 0 ? (<p>Chargement en cours</p>) :  (<table><tbody>{tableHead}{listItems}</tbody></table>);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>Welcome to React</h2>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <h2>GET Places</h2>
        {placeItems}
      </header>
    </div>
  );
  }
}

export default App;
