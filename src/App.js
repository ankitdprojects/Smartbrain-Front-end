import './App.css';
import Navigation from './Components/Navigation/Navigation';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Logo from './Components/Logo/Logo'
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm'
import Rank from './Components/Rank/Rank'
import { Component } from 'react';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import SignIn from './Components/SignIn/SignIn';
import Register from './Components/Register/Register'


const USER_ID = 'aad';
const PAT = 'bd69e06e68f244ed83b9ce09ee560e7c';
const APP_ID = 'aaa';
const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '45fb9a671625463fa646c3523a3087d5';




const particlesOption = {
  fpsLimit: 120,
  particles: {
    links: {
      color: "#ffffff",
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1,
    },
    collisions: {
      enable: true,
    },
    move: {
      direction: "none",
      enable: true,
      outModes: {
        default: "bounce",
      },
      random: true,
      speed: 5,
      straight: true,
    },

  },
  detectRetina: true,
}

const particlesInit = async (main) => {
  await loadFull(main);
};


const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route:'signin',
  isSignedIn:false,
  user: {
    id: '',
    name: '',
    email: '',
    joined: '',
    entries: 0
  }

};
class App extends Component {

  constructor() {
    super();
    this.state = initialState;
  };
  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    })
  }
 
   


 


  
  apiData = () => {
    const raw = JSON.stringify({
      "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
      },
      "inputs": [
        {
          "data": {
            "image": {
              "url": this.state.input
            }
          }
        }
      ]
    });

    const requestOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
      },
      body: raw
    };

    return requestOptions;
  }

  displayFaceBox = (box) => {
    this.setState({ box: box });
  }



  onInputChange=(event) =>{
    this.setState({input: event.target.value});
  }

  
  onImageSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    const requestOptions = this.apiData();
    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
      .then(response => response.text())
      .then(result => JSON.parse(result))
      .then(obj => {
        if (obj) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({
                id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries: count}))
          }).catch(console.log)
        }
        this.displayFaceBox(this.calculateFaceLocation(obj))
      })
      .catch(error => console.log('error', error));
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return ({
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height),
    })
  }


  onRouteChange=(route)=>{
    if(route==='signout'){
      this.setState({isSignedIn:initialState})
      this.setState({isSignedIn:false})
    }else if(route==='home'){
      this.setState({isSignedIn:true})
    }
    this.setState({route:route})
  }
  render(){

    const { imageUrl,  box ,isSignedIn,route} = this.state;
  
  return (
    <div className="App">
      <Particles className='particles'
          init={particlesInit}
          options={particlesOption}
        />
    
      <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />{ route==='home'?
      <div>

       <Logo />
       <Rank name={this.state.user.name} entries={this.state.user.entries}/>  

        <ImageLinkForm onInputChange={this.onInputChange}
              onImageSubmit={this.onImageSubmit}/>
      
      <FaceRecognition box={box} imageUrl={imageUrl} />
      </div>   :(
        route==='signin'?
        <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        : <Register  loadUser={this.loadUser}onRouteChange={this.onRouteChange}/>
      )
      
     
    }
    </div>
  );
}
}
export default App;
