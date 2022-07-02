import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ({onInputChange,onImageSubmit}) => {
  return (
    <div>
     <p className="f3 b white">
                {'This Application will detect faces from images using web API.'}
                </p>

            <p className="f3 b white">
                {'NOTE:IT WILL ONLY DETECT IMAGE FROM THE SIMPLE LINK LIKE BELOW GIVEN LINK AND ALSO WITH THE EXTENSION OF PNG'}
                
                
            </p>
            <p className="white">
            {'Sample Img: https://www.pngall.com/wp-content/uploads/2016/03/John-Cena-Body-PNG.png'}
            </p>
    <div className='center'>
    <div className='form center pa4 br3 shadow-5'>
        <input className='f4 pa2 w-70 center' type="text" onChange={onInputChange}/>
        <button className='w-30 grow f4 link ph3 pv2 dib white bg-orange'
        onClick={onImageSubmit}
        
        >Detect</button>
    </div>
    </div>
    </div>
  )
}

export default ImageLinkForm