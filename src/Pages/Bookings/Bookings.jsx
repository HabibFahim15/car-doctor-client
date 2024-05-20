import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Providers/AuthProvider";
import BookingRow from "./BookingRow";
import Swal from "sweetalert2";


const Bookings = () => {
 const {user} =useContext(AuthContext);
const [bookings, setBookings] =useState([])


 const url =`http://localhost:5000/bookings?email=${user?.email}`;
 useEffect(()=>{
  fetch(url)
  .then(res => res.json())
  .then(data =>{
   setBookings(data);
  })
 },[])


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
        ></BookingRow>)
      }
    </tbody>
    
    
  </table>
</div>
    </div>
  );
};

export default Bookings;