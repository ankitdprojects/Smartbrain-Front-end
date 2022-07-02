import Tilty from 'react-tilty';
import Brain from './Brain.png';
import './Logo.css';

const Logo = () => {
    return (
        <div className="ma4 mt5">
            <Tilty className="Tilt br2 shadow-2 center" options={{ max: 55 }} style={{ height: 100, width: 145 }} >
                <div className="Tilt-inner">
                    <img src={Brain} alt="logo"/>
                </div>
            </Tilty>
        </div>
    )
}

export default Logo;