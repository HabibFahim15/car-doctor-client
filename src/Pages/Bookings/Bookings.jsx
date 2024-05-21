import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Providers/AuthProvider";
import BookingRow from "./BookingRow";
import Swal from "sweetalert2";
import axios from "axios";


const Bookings = () => {
 const {user} =useContext(AuthContext);
const [bookings, setBookings] =useState([])


 const url =`http://localhost:5000/bookings?email=${user?.email}`;
 useEffect(()=>{

  // to send the cookie server set credentials true
  axios.get(url , {withCredentials: true})
  .then(res => {
    setBookings(res.data)
  })

  // fetch(url)
  // .then(res => res.json())
  // .then(data =>{
  //  setBookings(data);
  // })
 },[url])


 const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  });

  if (result.isConfirmed) {
    fetch(`http://localhost:5000/bookings/${id}`, {
      method: 'DELETE'
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      if (data.deletedCount > 0) {
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
        const remaining = bookings.filter(booking=> booking._id !== id);
        setBookings(remaining)
      }
    });
  }
};

const handleBookingConfirm = id => {
  fetch(`http://localhost:5000/bookings/${id}`,{
    method: 'PATCH',
    headers: {
     'content-type' :'application/json'
    },
    body: JSON.stringify({status: 'confirm'})
  })
  .then(res => res.json())
  .then(data => {
    console.log(data);
    if(data.modifiedCount > 0){
      //update state
      const remaining = bookings.filter(booking => booking._id !== id);
      const updated =bookings.find(booking => booking._id === id);
      updated.status = 'confirm'
      const newBookings = [updated, ...remaining]
      console.log(newBookings);
      setBookings(newBookings)
    }
  })
}

  return (
    <div>
      <h2 className="text-5xl">Your bookings: {bookings.length} </h2>
      <div className="overflow-x-auto">
  <table className="table">
    {/* head */}
    <thead>
      <tr>
        <th>
          <label>
            <input type="checkbox" className="checkbox" />
          </label>
        </th>
        <th>Image</th>
        <th>Service</th>
        <th>Date</th>
        <th>Price</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {
        bookings.map(booking => <BookingRow key={booking._id}
        booking={booking}
        handleDelete={handleDelete}
        handleBookingConfirm={handleBookingConfirm}
        ></BookingRow>)
      }
    </tbody>
    
    
  </table>
</div>
    </div>
  );
};

export default Bookings;