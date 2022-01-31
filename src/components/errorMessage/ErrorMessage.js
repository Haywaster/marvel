import img from './error.gif'
import './ErrorMessage.css'

const ErrorMessage = () => {
    return (
        <img className='error' src={img} alt='Error'/>
    )
}

export default ErrorMessage