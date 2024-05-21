import { Link, useLocation, useNavigate } from 'react-router-dom';
import img from '../../assets/images/login/login.svg'
import { useContext } from 'react';
import { AuthContext } from '../../Providers/AuthProvider';
import Swal from 'sweetalert2';
import axios from 'axios';


const Login = () => {
  const { signIn } = useContext(AuthContext);

  const location = useLocation();
  const navigate = useNavigate()
  console.log(location);


  const handleLogin = event => {
    event.preventDefault()
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;

    signIn(email, password)
      .then(result => {
        const loggedInUser = result.user;
        console.log(loggedInUser);
        const user = { email };
        if (loggedInUser) {
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "success",
            title: "Signed in successfully"
          });

        }
        // get access 
        axios.post('http://localhost:5000/jwt', user , { withCredentials: true })
          .then(res => {
            console.log(res.data);
            if (res.data.success) {
              navigate(location?.state ? location.state : '/')
            }
          })
      })
      .catch(error => console.log(error))
  }

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row">
        <div className="mx-auto mr-12 w-1/2">

          <img src={img} alt="" />

        </div>
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">

          {/* form  start*/}

          <form onSubmit={handleLogin} className="card-body">
            <h1 className="text-5xl text-center font-bold">Login now!</h1>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input type="email" name='email' placeholder="email" className="input input-bordered" required />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input type="password" name='password' placeholder="password" className="input input-bordered" required />
              <label className="label">
                <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
              </label>
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary">Login</button>
            </div>
          </form>
          <p className='text-center my-4'>Already Have an Account <Link className='text-orange-600 font-bold' to={'/signUp'}>SignUp</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;